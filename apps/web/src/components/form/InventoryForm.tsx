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
  inventorySchema,
  InventoryFormData,
} from '@/components/form/schemas/inventorySchema';

// Styles
import {
  adminFormContainerStyles,
  adminFormStyles,
} from '@/styles/adminFormStyles';

// Types
import { OptionLabel, ResponseWithData, UserSession } from '@/features/types';
import { ProductResponse } from '@/features/admin/products/types';
import { WarehouseResponse } from '@/features/admin/warehouses/types';
import { InventoryResponse } from '@/features/admin/inventories/types';

// TanStack
import {
  useGetUserWarehouse,
  useGetWarehouses,
} from '@/features/admin/warehouses/warehousesQueries';
import { useCreateInventory } from '@/features/admin/inventories/inventoriesMutations';
import { useGetInventory } from '@/features/admin/inventories/inventoriesQueries';
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

// NextAuth
import { useSession } from 'next-auth/react';

const defaultValues: InventoryFormData = {
  warehouseId: null,
  productId: null,
  stock: '',
};

type InventoryFormProps = {
  mutateAsync: (data: any) => Promise<any>;
  isMutatePending: boolean;
  queryData?: ResponseWithData<InventoryResponse>;
  errorQuery?: Error | null;
  isQueryPending?: boolean;
  isErrorQuery?: boolean;
  id?: string;
};

export default function InventoryForm({
  mutateAsync,
  isMutatePending,
  queryData,
  errorQuery,
  isErrorQuery,
  isQueryPending,
  id,
}: InventoryFormProps) {
  const [inputWarehouse, setInputWarehouse] = useState('');
  const [debouncedInputWarehouse] = useDebounce(inputWarehouse, 300);
  const [inputProduct, setInputProduct] = useState('');
  const [debouncedInputProduct] = useDebounce(inputProduct, 300);
  const [optionsWarehouse, setOptionsWarehouse] = useState<
    WarehouseResponse[] | OptionLabel[]
  >([]);
  const [selectedProduct, setSelectedProduct] = useState<OptionLabel | null>(
    null,
  );
  const [selectedWarehouse, setSelectedWarehouse] =
    useState<OptionLabel | null>(null);
  const [optionsProduct, setOptionsProduct] = useState<
    ProductResponse[] | OptionLabel[]
  >([]);

  const { handleSubmit, control, reset } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues,
  });

  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const disabledOnPending = isMutatePending || isQueryPending;

  const { data: warehouses, isRefetching: isWarehousesRefetching } =
    useGetWarehouses(
      debouncedInputWarehouse,
      { pageIndex: 0, pageSize: 5 },
      [{ id: 'name', desc: false }],
      user?.role === 'SUPER_ADMIN',
    );

  const { data: warehouse, isRefetching: isWarehouseRefetching } =
    useGetUserWarehouse(user?.role === 'ADMIN');

  useEffect(() => {
    if (warehouse?.result) {
      setOptionsWarehouse([warehouse.result]);
    }
  }, [warehouse?.result]);

  useEffect(() => {
    if (warehouses?.result) {
      setOptionsWarehouse(warehouses.result);
    }
  }, [warehouses?.result]);

  const { data: products, isRefetching: isProductRefetching } = useGetProducts(
    debouncedInputProduct,
    { pageIndex: 0, pageSize: 5 },
    [{ id: 'name', desc: false }],
  );

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
    } else {
      setOptionsProduct(optionsProduct);
    }
  }, [selectedProduct, optionsProduct]);

  useEffect(() => {
    if (
      selectedWarehouse &&
      !optionsWarehouse.find((opt) => opt.id === selectedWarehouse.id)
    ) {
      setOptionsWarehouse([...optionsWarehouse, selectedWarehouse]);
    } else {
      setOptionsWarehouse(optionsWarehouse);
    }
  }, [selectedWarehouse, optionsWarehouse]);

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.iventory.path);
    }
  }, [queryData, router, id]);

  useEffect(() => {
    if (queryData?.result && id) {
      const { warehouseId, productId, stock, warehouse, product } = {
        ...queryData.result,
        stock: toThousandFlag(queryData.result.stock),
      };

      reset({ productId, warehouseId, stock });
      setSelectedProduct({ id: productId, name: product.name });
      setSelectedWarehouse({ id: warehouseId, name: warehouse.name });
    }
  }, [queryData?.result, reset, id]);

  if (isErrorQuery) {
    errorFetcherNotification(errorQuery);
  }

  const onSubmit = async (data: InventoryFormData) => {
    const payload = {
      ...data,
      stock: toNumberFromThousandFlag(data.stock),
    };

    if (queryData) {
      await mutateAsync({ ...payload, id: queryData?.result?.id });
    } else {
      await mutateAsync(payload);
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
        <Controller
          control={control}
          name="warehouseId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Autocomplete
              openOnFocus
              disabled={disabledOnPending || id !== undefined}
              options={optionsWarehouse}
              getOptionLabel={(option) => option.name || ''}
              onChange={(_, value) => {
                onChange(value?.id ?? null);
              }}
              value={
                value ? optionsWarehouse.find((opt) => opt.id === value) : null
              }
              onInputChange={(_, newInputValue) => {
                setInputWarehouse(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Warehouse"
                  variant="outlined"
                  placeholder="Choose Warehouse"
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
          name="stock"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              size="small"
              label="Stock"
              variant="outlined"
              placeholder="Product Stock"
              disabled={disabledOnPending}
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
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
          <Button
            type="submit"
            variant="contained"
            color="info"
            disabled={disabledOnPending}
          >
            Submit
          </Button>
          <LinkButton
            href={dashboardAdminPages.inventory.path}
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

export function InventoryFormCreate() {
  const { mutateAsync, isPending } = useCreateInventory();
  return (
    <InventoryForm mutateAsync={mutateAsync} isMutatePending={isPending} />
  );
}

export function InventoryFormUpdate() {
  const params = useParams();
  const id = params.id as string;

  const { mutateAsync, isPending: isMutatePending } = useCreateInventory();
  const {
    data,
    error: errorQuery,
    isPending: isQueryPending,
    isError: isErrorQuery,
  } = useGetInventory(id);

  return (
    <InventoryForm
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
