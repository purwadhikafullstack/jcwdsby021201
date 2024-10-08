'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  productSchema,
  ProductFormData,
} from '@/components/form/schemas/productSchema';

// Styles
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
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
import GeneralTextField from '@/components/input/GeneralTextField';
import GeneralAutocomplete from '@/components/input/GeneralAutocomplete';

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
    files.splice(index, 1);

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
        <GeneralTextField
          control={control}
          name="name"
          required
          label="Name"
          placeholder="Product Name"
          disabled={onlySuperAdmin}
          shrink
        />
        <GeneralTextField
          control={control}
          name="price"
          required
          label="Price"
          placeholder="Product Price"
          disabled={onlySuperAdmin}
          additionalOnChange={(e) =>
            (e.target.value = toThousandFlag(e.target.value))
          }
          shrink
        />
        <GeneralTextField
          control={control}
          name="description"
          label="Description"
          placeholder="Product Description"
          disabled={onlySuperAdmin}
          multiline
          minRows={3}
        />
        <GeneralAutocomplete
          control={control}
          name="categoryId"
          options={options}
          shrink
          required
          label="Category"
          placeholder="Choose Category"
          disabled={onlySuperAdmin}
          isRefetching={isRefetching}
          onInputChange={setInputValue}
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
          {user?.role === 'SUPER_ADMIN' && (
            <Button
              type="submit"
              variant="contained"
              color="info"
              disabled={disabledOnPending}
              sx={buttonPrimaryStyles}
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
