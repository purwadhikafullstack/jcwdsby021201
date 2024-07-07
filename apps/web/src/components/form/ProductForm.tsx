'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  productSchema,
  ProductFormData,
} from '@/components/form/schemas/productSchema';

// Styles
import {
  adminFormContainerStyles,
  adminFormStyles,
} from '@/styles/adminFormStyles';

// Types
import { OptionLabel, ResponseWithData, UserSession } from '@/features/types';
import { Pictures, ProductResponse } from '@/features/admin/products/types';
import { CategoryResponse } from '@/features/admin/categories/types';

// TanStack
import { useGetCategories } from '@/features/admin/categories/categoriesQueries';
import {
  useCreateProduct,
  useDeleteProductImage,
  useUpdateProduct,
} from '@/features/admin/products/productsMutations';
import { useGetProduct } from '@/features/admin/products/productsQueries';

// Utils
import {
  errorFetcherNotification,
  errorNotification,
} from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';
import { toNumberFromThousandFlag, toThousandFlag } from '@/utils/formatter';
import { useDebounce } from 'use-debounce';

// Custom Components
import LinkButton from '@/components/button/LinkButton';
import ProductFormDropzone from '@/views/admin/products/ProductFormDropzone';

// NextAuth
import { useSession } from 'next-auth/react';

const defaultValues: ProductFormData = {
  name: '',
  description: '',
  price: '',
  categoryId: null,
};

type ProductFormProps = {
  mutateAsync: (data: any) => Promise<any>;
  isMutatePending: boolean;
  queryData?: ResponseWithData<ProductResponse>;
  errorQuery?: Error | null;
  isQueryPending?: boolean;
  isErrorQuery?: boolean;
  refetchQuery?: () => void;
  id?: string;
};

export default function ProductForm({
  mutateAsync,
  isMutatePending,
  queryData,
  errorQuery,
  isErrorQuery,
  isQueryPending,
  refetchQuery,
  id,
}: ProductFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 300);
  const [files, setFiles] = useState<Pictures[]>([]);
  const [options, setOptions] = useState<CategoryResponse[] | OptionLabel[]>(
    [],
  );
  const [category, setCategory] = useState<OptionLabel | null>(null);
  const { handleSubmit, control, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;

  const { data, isRefetching } = useGetCategories(
    debouncedInputValue,
    { pageIndex: 0, pageSize: 5 },
    [{ id: 'name', desc: false }],
  );

  const { mutateAsync: mutateDeleteAsync, isPending: isDeletePending } =
    useDeleteProductImage();

  const disabledOnPending =
    isMutatePending || isDeletePending || isQueryPending;
  const onlySuperAdmin = disabledOnPending || user?.role !== 'SUPER_ADMIN';

  useEffect(() => {
    if (data?.result) {
      setOptions(data.result);
    }
  }, [data?.result]);

  useEffect(() => {
    if (category && !options.find((opt) => opt.id === category.id)) {
      setOptions([...options, category]);
    } else if (options.length) {
      setOptions(options);
    }
  }, [category, options]);

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.product.path);
    }
  }, [queryData, router, id]);

  useEffect(() => {
    if (queryData?.result && id) {
      const { name, price, categoryId, description, pictures } = {
        ...queryData.result,
        price: toThousandFlag(queryData?.result?.price),
      };

      setFiles(pictures);
      reset({ name, price, categoryId, description });
      setCategory({ id: categoryId, name: queryData?.result?.category?.name });
    }
  }, [queryData?.result, reset, id]);

  if (isErrorQuery) {
    errorFetcherNotification(errorQuery);
  }

  const handleDeleteFile = async (imageId: number) => {
    if (id) await mutateDeleteAsync(`${imageId}`);

    const index = files.findIndex((file) => file.id === imageId);
    if (index !== -1) {
      setFiles([...files]);
    } else {
      errorNotification('Something went wrong');
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    const payload: any = {
      ...data,
      price: toNumberFromThousandFlag(data.price),
    };

    const formData = new FormData();
    for (const key in payload) {
      if (payload[key]) {
        formData.append(key, payload[key]);
      }
    }

    files.forEach((file) => {
      formData.append('files', file as unknown as File);
    });

    if (queryData) {
      await mutateAsync({ ...payload, id: queryData?.result?.id });
    } else {
      await mutateAsync(formData);
      reset(defaultValues);
    }
  };

  return (
    <Box component="main" sx={adminFormContainerStyles}>
      <Box
        component="form"
        autoCapitalize="off"
        noValidate
        onSubmit={handleSubmit(onSubmit)}
        sx={adminFormStyles}
      >
        <ProductFormDropzone
          id={id}
          refetchQuery={refetchQuery}
          files={files}
          setFiles={setFiles}
          disabled={onlySuperAdmin}
          handleDeleteFile={handleDeleteFile}
          user={user}
        />

        <Controller
          control={control}
          name="name"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              size="small"
              label="Name"
              variant="outlined"
              placeholder="Product Name"
              disabled={onlySuperAdmin}
              {...field}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
            />
          )}
        />
        <Controller
          control={control}
          name="price"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              size="small"
              label="Price"
              variant="outlined"
              placeholder="Product Price"
              disabled={onlySuperAdmin}
              {...field}
              onChange={(e) => {
                const formattedValue = toThousandFlag(e.target.value);
                field.onChange(formattedValue);
              }}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
            />
          )}
        />
        <Controller
          control={control}
          name="description"
          render={({ field }) => (
            <TextField
              fullWidth
              size="small"
              label="Description"
              variant="outlined"
              placeholder="Product Description"
              disabled={onlySuperAdmin}
              {...field}
              multiline
              minRows={3}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
        <Controller
          control={control}
          name="categoryId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Autocomplete
              openOnFocus
              disabled={onlySuperAdmin}
              options={options}
              getOptionLabel={(option) => option.name || ''}
              onChange={(_, value) => {
                onChange(value?.id ?? null);
              }}
              value={
                value ? options.find((category) => category.id === value) : null
              }
              onInputChange={(_, newInputValue) => {
                setInputValue(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Category"
                  variant="outlined"
                  placeholder="Choose Category"
                  disabled={onlySuperAdmin}
                  helperText={error?.message}
                  error={Boolean(error)}
                  InputLabelProps={{ shrink: true, required: true }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isRefetching ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          )}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
          {user?.role === 'SUPER_ADMIN' && (
            <Button
              type="submit"
              variant="contained"
              color="info"
              disabled={disabledOnPending}
            >
              Submit
            </Button>
          )}
          <LinkButton
            href={dashboardAdminPages.product.path}
            variant="back"
            disabled={disabledOnPending}
          >
            Back
          </LinkButton>
        </Box>
      </Box>
    </Box>
  );
}

export function ProductFormCreate() {
  const { mutateAsync, isPending } = useCreateProduct();
  return <ProductForm mutateAsync={mutateAsync} isMutatePending={isPending} />;
}

export function ProductFormUpdate() {
  const params = useParams();
  const id = params.id as string;

  const { mutateAsync, isPending: isMutatePending } = useUpdateProduct();
  const {
    data,
    error: errorQuery,
    isPending: isQueryPending,
    isError: isErrorQuery,
    refetch: refetchQuery,
  } = useGetProduct(id);

  return (
    <ProductForm
      mutateAsync={mutateAsync}
      isMutatePending={isMutatePending}
      queryData={data}
      errorQuery={errorQuery}
      isQueryPending={isQueryPending}
      isErrorQuery={isErrorQuery}
      refetchQuery={refetchQuery}
      id={id}
    />
  );
}
