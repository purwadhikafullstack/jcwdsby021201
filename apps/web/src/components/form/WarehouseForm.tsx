'use client';

import dynamic from 'next/dynamic';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// MUI Components
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import FormHelperText from '@mui/material/FormHelperText';

// Schemas
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  warehouseSchema,
  WarehouseFormData,
} from '@/components/form/schemas/warehouseSchema';

// Styles
import {
  adminFormContainerStyles,
  adminFormStyles,
} from '@/styles/adminFormStyles';

// Types
import { OptionLabel, ResponseWithData, UserSession } from '@/features/types';
import { CityResponse, ProvinceResponse } from '@/features/user/location/type';
import { WarehouseResponse } from '@/features/admin/warehouses/types';

// TanStack
import {
  useCreateWarehouse,
  useUpdateWarehouse,
} from '@/features/admin/warehouses/warehousesMutations';
import { useGetWarehouse } from '@/features/admin/warehouses/warehousesQueries';
import {
  useGetCitiesPagination,
  useGetProvincesPagination,
} from '@/features/user/location/locationQueries';

// Utils
import {
  errorFetcherNotification,
  errorNotification,
} from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';
import { useDebounce } from 'use-debounce';

// Custom Components
import LinkButton from '@/components/button/LinkButton';

// NextAuth
import { useSession } from 'next-auth/react';

// Map
import { LatLngExpression } from 'leaflet';

const WarehouseMap = dynamic(
  () => import('@/views/admin/warehouses/WarehouseMap'),
  { ssr: false },
);

const defaultValues: WarehouseFormData = {
  name: '',
  address: '',
  provinceId: null,
  cityId: null,
  postalCode: '',
  latitude: null,
  longitude: null,
};

type WarehouseFormProps = {
  mutateAsync: (data: any) => Promise<any>;
  isMutatePending: boolean;
  queryData?: ResponseWithData<WarehouseResponse>;
  errorQuery?: Error | null;
  isQueryPending?: boolean;
  isErrorQuery?: boolean;
  id?: string;
};

export default function WarehouseForm({
  mutateAsync,
  isMutatePending,
  queryData,
  errorQuery,
  isErrorQuery,
  isQueryPending,
  id,
}: WarehouseFormProps) {
  const [inputProvince, setInputProvince] = useState('');
  const [debouncedInputProvince] = useDebounce(inputProvince, 300);
  const [inputCity, setInputCity] = useState('');
  const [debouncedInputCity] = useDebounce(inputCity, 300);
  const [location, setLocation] = useState<LatLngExpression | null>(null);
  const [province, setProvince] = useState<OptionLabel | null>(null);
  const [city, setCity] = useState<OptionLabel | null>(null);
  const [optionsProvince, setOptionsProvince] = useState<
    ProvinceResponse[] | OptionLabel[]
  >([]);
  const [optionsCity, setOptionsCity] = useState<
    CityResponse[] | OptionLabel[]
  >([]);
  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WarehouseFormData>({
    resolver: zodResolver(warehouseSchema),
    defaultValues,
  });

  const selectedProvince = watch('provinceId') || 0;

  const router = useRouter();
  const session = useSession();
  const user = session.data?.user as UserSession;
  const disabledOnPending = isMutatePending || isQueryPending;
  const onlySuperAdmin = disabledOnPending || user?.role !== 'SUPER_ADMIN';

  const { data: provinces, isRefetching: isProvinceRefetching } =
    useGetProvincesPagination(
      debouncedInputProvince,
      { pageIndex: 0, pageSize: 5 },
      [{ id: 'name', desc: false }],
    );

  const { data: cities, isRefetching: isCityRefetching } =
    useGetCitiesPagination(
      `${selectedProvince}`,
      debouncedInputCity,
      { pageIndex: 0, pageSize: 5 },
      [{ id: 'name', desc: false }],
    );

  useEffect(() => {
    if (provinces?.result) {
      setOptionsProvince(provinces.result);
    }
  }, [provinces?.result]);

  useEffect(() => {
    if (province && !optionsProvince.find((opt) => opt.id === province.id)) {
      setOptionsProvince([...optionsProvince, province]);
    } else if (optionsProvince.length) {
      setOptionsProvince(optionsProvince);
    }
  }, [province, optionsProvince]);

  useEffect(() => {
    if (!selectedProvince) {
      setOptionsCity([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (cities?.result) {
      setOptionsCity(cities.result);
    }
  }, [cities?.result]);

  useEffect(() => {
    if (city && !optionsCity.find((opt) => opt.id === city.id)) {
      setOptionsCity([...optionsCity, city]);
    } else if (optionsCity.length) {
      setOptionsCity(optionsCity);
    }
  }, [city, optionsCity]);

  useEffect(() => {
    if (queryData?.success === false && id) {
      errorNotification(queryData?.message || 'Page not found');
      router.push(dashboardAdminPages.warehouse.path);
    }
  }, [queryData, router, id]);

  useEffect(() => {
    if (queryData?.result && id) {
      reset(queryData.result);
      setProvince({
        id: queryData?.result?.province?.id,
        name: queryData?.result?.province?.name,
      });
      setCity({
        id: queryData?.result?.city?.id,
        name: queryData?.result?.city?.name,
      });
      setLocation({
        lat: queryData?.result?.latitude,
        lng: queryData?.result?.longitude,
      });
    }
  }, [queryData?.result, reset, id]);

  if (isErrorQuery) {
    errorFetcherNotification(errorQuery);
  }

  const onSubmit = async (data: WarehouseFormData) => {
    if (queryData) {
      await mutateAsync({ ...data, id: queryData?.result?.id });
    } else {
      await mutateAsync(data);
      reset(defaultValues);
    }
  };

  if (errors.latitude || errors.longitude) {
    errorNotification(
      'Please click on the map and select the exact location of the warehouse',
    );
  }

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
          name="name"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              size="small"
              label="Name"
              variant="outlined"
              placeholder="Warehouse Name"
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
          name="address"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              multiline
              minRows={3}
              size="small"
              label="Address"
              variant="outlined"
              placeholder="Warehouse Address"
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
          name="provinceId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Autocomplete
              openOnFocus
              disabled={onlySuperAdmin}
              options={optionsProvince}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => {
                onChange(value?.id ?? null);
              }}
              value={
                value ? optionsProvince.find((opt) => opt.id === value) : null
              }
              onInputChange={(_, newInputValue) => {
                setInputProvince(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="Province"
                  variant="outlined"
                  placeholder="Choose Province"
                  disabled={onlySuperAdmin}
                  helperText={error?.message}
                  error={Boolean(error)}
                  InputLabelProps={{ shrink: true, required: true }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isProvinceRefetching ? (
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
          name="cityId"
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <Autocomplete
              openOnFocus
              disabled={!selectedProvince || onlySuperAdmin}
              options={optionsCity}
              getOptionLabel={(option) => option.name}
              onChange={(_, value) => {
                onChange(value?.id ?? null);
              }}
              value={value ? optionsCity.find((opt) => opt.id === value) : null}
              onInputChange={(_, newInputValue) => {
                setInputCity(newInputValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  size="small"
                  label="City"
                  variant="outlined"
                  placeholder="Choose City"
                  disabled={!selectedProvince || onlySuperAdmin}
                  helperText={error?.message}
                  error={Boolean(error)}
                  InputLabelProps={{ shrink: true, required: true }}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {isCityRefetching ? (
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
          name="postalCode"
          render={({ field, fieldState: { error } }) => (
            <TextField
              fullWidth
              required
              size="small"
              label="Postal Code"
              variant="outlined"
              placeholder="Warehouse Postal Code"
              disabled={onlySuperAdmin}
              {...field}
              helperText={error?.message}
              error={Boolean(error)}
              InputLabelProps={{ shrink: true, required: true }}
            />
          )}
        />

        <Box sx={{ width: '100%', height: '400px' }}>
          <WarehouseMap setValue={setValue} location={location} />
        </Box>

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
            href={dashboardAdminPages.warehouse.path}
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

export function WarehouseFormCreate() {
  const { mutateAsync, isPending } = useCreateWarehouse();
  return (
    <WarehouseForm mutateAsync={mutateAsync} isMutatePending={isPending} />
  );
}

export function WarehouseFormUpdate() {
  const params = useParams();
  const id = params.id as string;

  const { mutateAsync, isPending: isMutatePending } = useUpdateWarehouse();
  const {
    data,
    error: errorQuery,
    isPending: isQueryPending,
    isError: isErrorQuery,
    refetch: refetchQuery,
  } = useGetWarehouse(id);

  return (
    <WarehouseForm
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
