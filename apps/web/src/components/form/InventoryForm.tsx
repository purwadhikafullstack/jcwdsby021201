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
  inventorySchema,
  InventoryFormData,
} from '@/components/form/schemas/inventorySchema';

// Styles
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
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
import {
  useCreateInventory,
  useUpdateInventory,
} from '@/features/admin/inventories/inventoriesMutations';
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
import GeneralTextField from '@/components/input/GeneralTextField';
import GeneralAutocomplete from '@/components/input/GeneralAutocomplete';

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

  const { handleSubmit, control, reset, setValue } = useForm<InventoryFormData>(
    {
      resolver: zodResolver(inventorySchema),
      defaultValues,
    },
  );

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

  const { data: products, isRefetching: isProductRefetching } = useGetProducts(
    debouncedInputProduct,
    { pageIndex: 0, pageSize: 5 },
    [{ id: 'name', desc: false }],
  );

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
      selectedWarehouse &&
      !optionsWarehouse.find((opt) => opt.id === selectedWarehouse.id)
    ) {
      setOptionsWarehouse([...optionsWarehouse, selectedWarehouse]);
    } else if (optionsWarehouse.length) {
      setOptionsWarehouse(optionsWarehouse);
    }
  }, [selectedWarehouse, optionsWarehouse]);

  useEffect(() => {
    if (optionsWarehouse.length === 1) {
      setValue('warehouseId', optionsWarehouse[0].id);
    }
  }, [optionsWarehouse, setValue]);

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.inventory.path);
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
      await mutateAsync({ stock: payload.stock, id: queryData?.result?.id });
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
        <GeneralAutocomplete
          control={control}
          name="warehouseId"
          options={optionsWarehouse}
          shrink
          required
          label="Warehouse"
          placeholder="Choose Warehouse"
          disabled={disabledOnPending || id !== undefined}
          isRefetching={isWarehouseRefetching || isWarehousesRefetching}
          onInputChange={setInputWarehouse}
        />
        <GeneralAutocomplete
          control={control}
          name="productId"
          options={optionsProduct}
          shrink
          required
          label="Product"
          placeholder="Choose Product"
          disabled={disabledOnPending || id !== undefined}
          isRefetching={isProductRefetching}
          onInputChange={setInputProduct}
        />
        <GeneralTextField
          control={control}
          name="stock"
          required
          label="Stock"
          placeholder="Product Stock"
          disabled={disabledOnPending}
          additionalOnChange={(e) => {
            e.target.value = toThousandFlag(e.target.value);
          }}
          shrink
        />
        <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
          <Button
            type="submit"
            variant="contained"
            color="info"
            disabled={disabledOnPending}
            sx={buttonPrimaryStyles}
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

  const { mutateAsync, isPending: isMutatePending } = useUpdateInventory();
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
