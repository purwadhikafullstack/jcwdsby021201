'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

// MUI Icons
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  productSchema,
  ProductFormData,
} from '@/components/form/schemas/productSchema';

// Styles
import {
  dropzoneContainerStyles,
  dropzoneThumbStyles,
} from '@/styles/dropzoneStyles';
import {
  adminFormContainerStyles,
  adminFormStyles,
} from '@/styles/adminFormStyles';

// Types
import { ResponseWithData, UserSession } from '@/features/types';
import { ProductResponse } from '@/features/admin/products/types';

// TanStack
import {
  useGetCategories,
  useGetCategory,
} from '@/features/admin/categories/categoriesQueries';
import {
  useCreateCategory,
  useUpdateCategory,
} from '@/features/admin/categories/categoriesMutations';

// Utils
import { errorFetcherNotification } from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';
import {
  deletePropertyWhenEmpty,
  toNumberFromThousandFlag,
  toThousandFlag,
} from '@/utils/formatter';
import { useDebounce } from 'use-debounce';

// Custom Components
import LinkButton from '@/components/button/LinkButton';

// NextAuth
import { useSession } from 'next-auth/react';
import { useDropzone } from 'react-dropzone';
import {
  useCreateProduct,
  useUpdateProduct,
} from '@/features/admin/products/productsMutations';
import { useGetProduct } from '@/features/admin/products/productsQueries';

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
};

interface FileWithPreview extends File {
  preview: string;
}

export default function ProductForm({
  mutateAsync,
  isMutatePending,
  queryData,
  errorQuery,
  isErrorQuery,
  isQueryPending,
}: ProductFormProps) {
  const [inputValue, setInputValue] = useState('');
  const [debouncedInputValue] = useDebounce(inputValue, 300);
  const { handleSubmit, control, reset } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  const session = useSession();
  const user = session.data?.user as UserSession;
  const disabledOnPending = isMutatePending || isQueryPending;
  const onlySuperAdmin = disabledOnPending || user?.role !== 'SUPER_ADMIN';

  const { data, isRefetching } = useGetCategories(
    debouncedInputValue,
    { pageIndex: 0, pageSize: 5 },
    [{ id: 'name', desc: false }],
  );

  useEffect(() => {
    if (queryData) {
      const newResult = {
        ...queryData.result,
        price: toThousandFlag(queryData.result.price),
      };

      reset(newResult);
    }
  }, [queryData, reset]);

  if (isErrorQuery) {
    errorFetcherNotification(errorQuery);
  }

  // TODO: Upload File using Dropzone
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const maxSize = 1 * 1024 * 1024;

  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/jpeg': [], 'image/png': [] },
    onDrop: (acceptedFiles) => {
      const validFiles = acceptedFiles.filter((file) => {
        return file.size <= maxSize;
      });

      const newFiles = validFiles.map((file) => {
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
      });

      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    },
    maxSize,
    disabled: onlySuperAdmin,
  });

  const handleDeleteFile = (index: number) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
  };

  const thumbs = files.map((file, index) => (
    <Box key={index} sx={dropzoneThumbStyles}>
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDeleteFile(index)}
        sx={{ position: 'absolute', zIndex: 1, top: -10, right: -10 }}
      >
        <DeleteIcon />
      </IconButton>
      <Image
        src={file.preview}
        alt={file.name}
        width={104}
        height={104}
        objectFit="cover"
        onLoad={() => URL.revokeObjectURL(file.preview)}
      />
    </Box>
  ));

  const onSubmit = async (data: ProductFormData) => {
    const newData = { ...data, price: toNumberFromThousandFlag(data.price) };
    const payload = deletePropertyWhenEmpty(newData);

    if (queryData) {
      await mutateAsync({ ...payload, id: queryData.result.id });
    } else {
      await mutateAsync(payload);
    }
    reset(defaultValues);
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
        <Box>
          <Box {...getRootProps()} sx={dropzoneContainerStyles}>
            <input {...getInputProps()} />
            <CloudUploadIcon
              sx={{ fontSize: 50, color: (theme) => theme.palette.grey[600] }}
            />
            <Typography sx={{ color: (theme) => theme.palette.grey[600] }}>
              Drag & drop some files here, or click to select files
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: (theme) => theme.palette.grey[600] }}
            >
              (Only *.jpeg, *.jpg and *.png images will be accepted, max 1MB
              each)
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
            {thumbs}
          </Box>
        </Box>

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
              rows={4}
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
              options={data?.result ?? []}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => {
                onChange(value?.id ?? null);
              }}
              value={
                value
                  ? data?.result.find((category) => category.id === value)
                  : null
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
  } = useGetProduct(id);

  return (
    <ProductForm
      mutateAsync={mutateAsync}
      isMutatePending={isMutatePending}
      queryData={data}
      errorQuery={errorQuery}
      isQueryPending={isQueryPending}
      isErrorQuery={isErrorQuery}
    />
  );
}
