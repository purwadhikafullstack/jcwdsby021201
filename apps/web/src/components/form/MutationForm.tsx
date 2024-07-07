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
  mutationSchema,
  MutationFormData,
  mutationUpdateSchema,
} from '@/components/form/schemas/mutationSchema';

// Styles
import {
  adminFormContainerStyles,
  adminFormStyles,
} from '@/styles/adminFormStyles';

// Types
import { OptionLabel, ResponseWithData, UserSession } from '@/features/types';
import { ProductResponse } from '@/features/admin/products/types';
import { WarehouseResponse } from '@/features/admin/warehouses/types';
import { MutationResponse } from '@/features/admin/mutations/types';

// TanStack
import {
  useGetUserWarehouse,
  useGetWarehouses,
} from '@/features/admin/warehouses/warehousesQueries';
import {
  useCreateMutation,
  useUpdateMutationToApprove,
  useUpdateMutationToCancel,
} from '@/features/admin/mutations/mutationsMutations';
import { useGetMutation } from '@/features/admin/mutations/mutationsQueries';
import { useGetProducts } from '@/features/admin/products/productsQueries';

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
import ReasonDialog from '@/components/dialog/ReasonDialog';

// NextAuth
import { useSession } from 'next-auth/react';

const defaultValues: MutationFormData = {
  sourceWarehouseId: null,
  destinationWarehouseId: null,
  productId: null,
  stockRequest: '',
  stockProcess: '',
  note: '',
};

type MutationFormProps = {
  mutateAsync: (data: any) => Promise<any>;
  isMutatePending: boolean;
  queryData?: ResponseWithData<MutationResponse>;
  errorQuery?: Error | null;
  isQueryPending?: boolean;
  isErrorQuery?: boolean;
  id?: string;
};

export default function MutationForm({
  mutateAsync,
  isMutatePending,
  queryData,
  errorQuery,
  isErrorQuery,
  isQueryPending,
  id,
}: MutationFormProps) {
  const [open, setOpen] = useState(false);
  const [inputWarehouseSource, setInputWarehouseSource] = useState('');
  const [debouncedInputWarehouseSource] = useDebounce(
    inputWarehouseSource,
    300,
  );
  const [inputWarehouseDestination, setInputWarehouseDestination] =
    useState('');
  const [debouncedInputWarehouseDestination] = useDebounce(
    inputWarehouseDestination,
    300,
  );
  const [inputProduct, setInputProduct] = useState('');
  const [debouncedInputProduct] = useDebounce(inputProduct, 300);
  const [optionsWarehouseSource, setOptionsWarehouseSource] = useState<
    WarehouseResponse[] | OptionLabel[]
  >([]);
  const [optionsWarehouseDestination, setOptionsWarehouseDestination] =
    useState<WarehouseResponse[] | OptionLabel[]>([]);
  const [selectedWarehouseSource, setSelectedWarehouseSource] =
    useState<OptionLabel | null>(null);
  const [selectedWarehouseDestination, setSelectedWarehouseDestination] =
    useState<OptionLabel | null>(null);
  const [optionsProduct, setOptionsProduct] = useState<
    ProductResponse[] | OptionLabel[]
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<OptionLabel | null>(
    null,
  );

  const schema = id ? mutationUpdateSchema : mutationSchema;
  const { handleSubmit, control, reset, watch } = useForm<MutationFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const watchWarehouseSource = watch('sourceWarehouseId');

  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;

  const { data: warehouses, isRefetching: isWarehousesRefetching } =
    useGetWarehouses(
      debouncedInputWarehouseSource,
      { pageIndex: 0, pageSize: 5 },
      [{ id: 'name', desc: false }],
    );

  const { data: warehouse, isRefetching: isWarehouseRefetching } =
    useGetUserWarehouse(user?.role === 'ADMIN');

  const { data: products, isRefetching: isProductRefetching } = useGetProducts(
    debouncedInputProduct,
    { pageIndex: 0, pageSize: 5 },
    [{ id: 'name', desc: false }],
  );

  const {
    data: warehousesDestination,
    isRefetching: isWarehousesDestinationRefetching,
  } = useGetWarehouses(
    debouncedInputWarehouseDestination,
    { pageIndex: 0, pageSize: 5 },
    [{ id: 'name', desc: false }],
    true,
    watchWarehouseSource ?? undefined,
  );

  const { mutateAsync: mutateAsyncToCancel, isPending: isToCancelPending } =
    useUpdateMutationToCancel();

  const disabledOnPending =
    isMutatePending || isToCancelPending || isQueryPending;

  useEffect(() => {
    if (warehouse?.result) {
      setOptionsWarehouseSource([warehouse.result]);
    } else {
      setOptionsWarehouseSource(warehouses?.result || []);
    }
  }, [warehouses?.result, warehouse?.result]);

  useEffect(() => {
    if (warehousesDestination?.result) {
      setOptionsWarehouseDestination(warehousesDestination.result);
    }
  }, [warehousesDestination]);

  useEffect(() => {
    if (products?.result) {
      setOptionsProduct(products.result);
    }
  }, [products?.result]);

  useEffect(() => {
    if (
      selectedProduct &&
      !optionsProduct.find((opt) => opt.id === selectedProduct.id)
    ) {
      setOptionsProduct([...optionsProduct, selectedProduct]);
    } else if (optionsProduct.length) {
      setOptionsProduct(optionsProduct);
    }
  }, [selectedProduct, optionsProduct]);

  useEffect(() => {
    if (
      selectedWarehouseSource &&
      !optionsWarehouseSource.find(
        (opt) => opt.id === selectedWarehouseSource.id,
      )
    ) {
      setOptionsWarehouseSource([
        ...optionsWarehouseSource,
        selectedWarehouseSource,
      ]);
    } else if (optionsWarehouseSource.length) {
      setOptionsWarehouseSource(optionsWarehouseSource);
    }
  }, [selectedWarehouseSource, optionsWarehouseSource]);

  useEffect(() => {
    if (
      selectedWarehouseDestination &&
      !optionsWarehouseDestination.find(
        (opt) => opt.id === selectedWarehouseDestination.id,
      )
    ) {
      setOptionsWarehouseDestination([
        ...optionsWarehouseDestination,
        selectedWarehouseDestination,
      ]);
    } else if (optionsWarehouseDestination.length) {
      setOptionsWarehouseDestination(optionsWarehouseDestination);
    }
  }, [selectedWarehouseDestination, optionsWarehouseDestination]);

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.inventory.path);
    }
  }, [queryData, router, id]);

  useEffect(() => {
    if (queryData?.result && id) {
      const newData = {
        ...queryData.result,
        stockRequest: toThousandFlag(queryData.result.stockRequest),
        stockProcess: toThousandFlag(queryData.result.stockProcess),
      };

      reset(newData);
      setSelectedWarehouseSource({
        id: newData.sourceWarehouse.id,
        name: newData.sourceWarehouse.name,
      });
      setSelectedWarehouseDestination({
        id: newData.destinationWarehouse.id,
        name: newData.destinationWarehouse.name,
      });
      setSelectedProduct({
        id: newData.product.id,
        name: newData.product.name,
      });
    }
  }, [queryData?.result, reset, id]);

  if (isErrorQuery) {
    errorFetcherNotification(errorQuery);
  }

  const handleOpenDialog = () => {
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const onSubmit = async (data: MutationFormData) => {
    const { stockProcess, ...payload } = {
      ...data,
      stockRequest: toNumberFromThousandFlag(data.stockRequest),
      stockProcess: toNumberFromThousandFlag(data.stockProcess || '0'),
    };

    if (queryData) {
      await mutateAsync({ stockProcess, id: queryData?.result?.id });
    } else {
      await mutateAsync(payload);
      reset(defaultValues);
    }
  };

  return (
    <>
      <Box component="main" sx={adminFormContainerStyles}>
        <Box
          component="form"
          autoCapitalize="off"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          sx={adminFormStyles}
        >
          <Controller
            control={control}
            name="sourceWarehouseId"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Autocomplete
                openOnFocus
                disabled={disabledOnPending || id !== undefined}
                options={optionsWarehouseSource}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, value) => {
                  onChange(value?.id ?? null);
                }}
                value={
                  value
                    ? optionsWarehouseSource.find((opt) => opt.id === value)
                    : null
                }
                onInputChange={(_, newInputValue) => {
                  setInputWarehouseSource(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    label="Source"
                    variant="outlined"
                    placeholder="Choose Warehouse Source"
                    disabled={disabledOnPending || id !== undefined}
                    helperText={error?.message}
                    error={Boolean(error)}
                    InputLabelProps={{ shrink: true, required: true }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isWarehousesRefetching || isWarehouseRefetching ? (
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
          <Controller
            control={control}
            name="destinationWarehouseId"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Autocomplete
                openOnFocus
                disabled={
                  !watchWarehouseSource || disabledOnPending || id !== undefined
                }
                options={optionsWarehouseDestination}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, value) => {
                  onChange(value?.id ?? null);
                }}
                value={
                  value
                    ? optionsWarehouseDestination.find(
                        (opt) => opt.id === value,
                      )
                    : null
                }
                onInputChange={(_, newInputValue) => {
                  setInputWarehouseDestination(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    label="Destination"
                    variant="outlined"
                    placeholder="Choose Warehouse Destination"
                    disabled={
                      !watchWarehouseSource ||
                      disabledOnPending ||
                      id !== undefined
                    }
                    helperText={error?.message}
                    error={Boolean(error)}
                    InputLabelProps={{ shrink: true, required: true }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isWarehousesDestinationRefetching ? (
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
          <Controller
            control={control}
            name="productId"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <Autocomplete
                openOnFocus
                disabled={disabledOnPending || id !== undefined}
                options={optionsProduct}
                getOptionLabel={(option) => option.name || ''}
                onChange={(_, value) => {
                  onChange(value?.id ?? null);
                }}
                value={
                  value ? optionsProduct.find((opt) => opt.id === value) : null
                }
                onInputChange={(_, newInputValue) => {
                  setInputProduct(newInputValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    fullWidth
                    size="small"
                    label="Product"
                    variant="outlined"
                    placeholder="Choose Product"
                    disabled={disabledOnPending || id !== undefined}
                    helperText={error?.message}
                    error={Boolean(error)}
                    InputLabelProps={{ shrink: true, required: true }}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {isProductRefetching ? (
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
          <Controller
            control={control}
            name="stockRequest"
            render={({ field, fieldState: { error } }) => (
              <TextField
                fullWidth
                required
                size="small"
                label="Request"
                variant="outlined"
                placeholder="Stock Request"
                disabled={disabledOnPending || id !== undefined}
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
          {id && (
            <Controller
              control={control}
              name="stockProcess"
              render={({ field, fieldState: { error } }) => (
                <TextField
                  fullWidth
                  required
                  size="small"
                  label="Process"
                  variant="outlined"
                  placeholder="Stock Process"
                  disabled={
                    (id && queryData?.result.status !== 'PENDING') ||
                    disabledOnPending
                  }
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
          )}
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <TextField
                fullWidth
                size="small"
                label="Note"
                variant="outlined"
                placeholder="Mutation Note"
                disabled={disabledOnPending || id !== undefined}
                {...field}
                multiline
                minRows={3}
                InputLabelProps={{ shrink: true }}
              />
            )}
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
            <Button
              type="submit"
              variant="contained"
              color="info"
              disabled={
                (id && queryData?.result.status !== 'PENDING') ||
                disabledOnPending
              }
            >
              Submit
            </Button>
            {id && (
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
                disabled={
                  (id && queryData?.result.status !== 'PENDING') ||
                  disabledOnPending
                }
              >
                Cancel
              </Button>
            )}
            <LinkButton
              href={dashboardAdminPages.mutation.path}
              variant="back"
              disabled={disabledOnPending}
            >
              Back
            </LinkButton>
          </Box>
        </Box>
      </Box>
      <ReasonDialog
        open={open}
        onClose={handleCloseDialog}
        id={id}
        mutateAsync={mutateAsyncToCancel}
        isMutatePending={isToCancelPending}
        action="cancel"
      />
    </>
  );
}

export function MutationFormCreate() {
  const { mutateAsync, isPending } = useCreateMutation();
  return <MutationForm mutateAsync={mutateAsync} isMutatePending={isPending} />;
}

export function MutationFormUpdate() {
  const params = useParams();
  const id = params.id as string;

  const { mutateAsync, isPending: isMutatePending } =
    useUpdateMutationToApprove();
  const {
    data,
    error: errorQuery,
    isPending: isQueryPending,
    isError: isErrorQuery,
  } = useGetMutation(id);

  return (
    <MutationForm
      mutateAsync={mutateAsync}
      isMutatePending={isMutatePending}
      queryData={data}
      errorQuery={errorQuery}
      isQueryPending={isQueryPending}
      isErrorQuery={isErrorQuery}
      id={id}
    />
  );
}
