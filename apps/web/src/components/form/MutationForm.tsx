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
  mutationSchema,
  MutationFormData,
  mutationUpdateSchema,
} from '@/components/form/schemas/mutationSchema';

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
import GeneralTextField from '@/components/input/GeneralTextField';
import GeneralAutocomplete from '@/components/input/GeneralAutocomplete';

// NextAuth
import { useSession } from 'next-auth/react';

const defaultValues: MutationFormData = {
  sourceWarehouseId: null,
  destinationWarehouseId: null,
  productId: null,
  stockRequest: '',
  stockProcess: '0',
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
  const { handleSubmit, control, reset, watch, setValue } =
    useForm<MutationFormData>({
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
    if (optionsWarehouseSource.length === 1) {
      setValue('sourceWarehouseId', optionsWarehouseSource[0].id);
    }
  }, [optionsWarehouseSource, setValue]);

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.mutation.path);
    }
  }, [queryData, router, id]);

  useEffect(() => {
    if (queryData?.result && id) {
      const newData = {
        ...queryData.result,
        stockRequest: toThousandFlag(queryData.result.stockRequest),
        stockProcess: queryData.result.stockProcess
          ? toThousandFlag(queryData.result.stockProcess)
          : '0',
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
          <GeneralAutocomplete
            control={control}
            name="sourceWarehouseId"
            options={optionsWarehouseSource}
            shrink
            required
            label="Source"
            placeholder="Choose Warehouse Source"
            disabled={disabledOnPending || id !== undefined}
            isRefetching={isWarehouseRefetching || isWarehousesRefetching}
            onInputChange={setInputWarehouseSource}
          />
          <GeneralAutocomplete
            control={control}
            name="destinationWarehouseId"
            options={optionsWarehouseDestination}
            shrink
            required
            label="Destination"
            placeholder="Choose Warehouse Destination"
            disabled={
              !watchWarehouseSource || disabledOnPending || id !== undefined
            }
            isRefetching={isWarehousesDestinationRefetching}
            onInputChange={setInputWarehouseDestination}
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
            name="stockRequest"
            required
            label="Request"
            placeholder="Stock Request"
            disabled={disabledOnPending || id !== undefined}
            shrink
          />
          {id && (
            <GeneralTextField
              control={control}
              name="stockProcess"
              required
              label="Process"
              placeholder="Stock Process"
              shrink
              disabled={
                (id && queryData?.result?.status !== 'PENDING') ||
                disabledOnPending
              }
              additionalOnChange={(e) =>
                (e.target.value = toThousandFlag(e.target.value))
              }
            />
          )}
          <GeneralTextField
            control={control}
            name="note"
            label="Note"
            placeholder="Mutation Note"
            disabled={disabledOnPending || id !== undefined}
            multiline
            minRows={3}
            shrink
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 1, justifyContent: 'end' }}>
            <Button
              type="submit"
              variant="contained"
              color="info"
              disabled={
                (id && queryData?.result?.status !== 'PENDING') ||
                disabledOnPending
              }
              sx={buttonPrimaryStyles}
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
                  (id && queryData?.result?.status !== 'PENDING') ||
                  disabledOnPending
                }
              >
                Reject
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
        action="reject"
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
