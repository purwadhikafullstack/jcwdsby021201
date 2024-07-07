'use client';
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import { Add as AddIcon, Token } from '@mui/icons-material';
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressSchema, addressSchema } from './schemas/addAddressSchema';
import {
  Button,
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import {
  useFetchCities,
  useFetchProvince,
  useGetCityName,
  useGetProvinceName,
} from '@/features/user/location/locationQueries';
import { useAddAddress } from '@/features/user/address/addressMutations';
import Map from '../map/Map';
import { errorNotification } from '@/utils/notifications';
import StyledButton from '../button/StyledButton';

const defaultValues: AddressSchema = {
  name: '',
  address: '',
  cityId: 0,
  provinceId: 0,
  postalCode: '',
  userId: 0,
  isPrimary: false,
  latitude: 0,
  longitude: 0,
};

interface AddressFormProps {
  onAddressAdded?: () => void;
  shouldRedirect?: boolean; // tambahkan parameter ini
}

export default function AddressForm({
  onAddressAdded,
  shouldRedirect = false,
}: AddressFormProps) {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const { control, handleSubmit, reset, setValue } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  const { data: provinces, isLoading: isLoadingProvinces } = useFetchProvince();
  const [selectedProvince, setSelectedProvince] = React.useState<number>(0);
  const { data: cities, isLoading: isLoadingCities } =
    useFetchCities(selectedProvince);
  const [selectedCity, setSelectedCity] = React.useState<number>(0);

  //State Nama Provinsi dan City
  const [province, setProvince] = React.useState<string>('');
  const [city, setCity] = React.useState<string>('');

  //State untuk titik koordinat:
  const [coordinates, setCoordinates] = React.useState<{
    lat: number;
    lon: number;
  } | null>(null);

  //Fetch Nama :
  const { data: provinceName, isLoading: isProvinceNameLoading } =
    useGetProvinceName(selectedProvince);
  const { data: cityName, isLoading: isCityNameLoading } =
    useGetCityName(selectedCity);

  //Fetch Redirect Halaman
  const { mutateAsync: addAddressMutateAsync, isPending: isADdPending } =
    useAddAddress(shouldRedirect);

  //Handle Id Province dan City :
  const handleProvinceChange = (event: SelectChangeEvent<number>) => {
    const provinceId = event.target.value as number;
    setSelectedProvince(provinceId);
    setValue('provinceId', provinceId);
  };

  const handleCityChange = (event: SelectChangeEvent<number>) => {
    const cityId = event.target.value as number;
    setSelectedCity(cityId);
    setValue('cityId', cityId);
  };

  const onSubmit = async (data: AddressSchema) => {
    try {
      if (!coordinates) {
        errorNotification('Please mark your location on the map.');
      }
      if (token && coordinates) {
        const dataWithCoordinates = {
          ...data,
          latitude: coordinates.lat,
          longitude: coordinates.lon,
        };
        await addAddressMutateAsync({
          addressData: dataWithCoordinates,
          token: token,
        });
        if (onAddressAdded) {
          onAddressAdded();
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  React.useEffect(() => {
    if (selectedProvince && !isProvinceNameLoading && provinceName) {
      setProvince(provinceName.name);
    }
  }, [selectedProvince, isProvinceNameLoading, provinceName]);

  React.useEffect(() => {
    if (selectedCity && !isCityNameLoading && cityName) {
      setCity(cityName[0]?.name);
    }
  }, [selectedCity, isCityNameLoading, cityName]);

  // Fungsi untuk mengatur koordinat yang diperoleh dari komponen Map
  const handleCoordinatesChange = (lat: number, lon: number) => {
    setCoordinates({ lat: lat, lon: lon });
  };

  React.useEffect(() => {
    if (coordinates) {
      setValue('latitude', coordinates.lat);
      setValue('longitude', coordinates.lon);
    }
  }, [coordinates, setValue]);

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '800px',
        margin: 'auto',
        mt: '50px',
        p: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      <Typography variant="h6">Add New Address</Typography>

      <Controller
        control={control}
        name="name"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth>
            <TextField
              {...field}
              required
              error={Boolean(error)}
              helperText={error?.message}
              label="Name"
              placeholder="Input Name"
              size="small"
            />
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="address"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth>
            <TextField
              {...field}
              required
              error={Boolean(error)}
              helperText={error?.message}
              label="Address"
              placeholder="Input Address"
              size="small"
            />
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="provinceId"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth>
            <InputLabel id="province-label">Province</InputLabel>
            <Select
              {...field}
              required
              error={Boolean(error)}
              label="Province"
              id="province"
              labelId="province-label"
              onChange={handleProvinceChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {provinces?.map((province: any) => (
                <MenuItem key={province.id} value={Number(province.id)}>
                  {province.name}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="body2" color="error">
                {error.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="cityId"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth>
            <InputLabel id="city-label">City</InputLabel>
            <Select
              {...field}
              required
              error={Boolean(error)}
              label="City"
              id="city"
              labelId="city-label"
              onChange={handleCityChange}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {cities?.map((city: any) => (
                <MenuItem key={city.id} value={city.id}>
                  {city.name}
                </MenuItem>
              ))}
            </Select>
            {error && (
              <Typography variant="body2" color="error">
                {error.message}
              </Typography>
            )}
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="postalCode"
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth>
            <TextField
              {...field}
              required
              error={Boolean(error)}
              helperText={error?.message}
              label="Postal Code"
              placeholder="Input Postal Code"
              size="small"
            />
          </FormControl>
        )}
      />

      <Typography color="primary">
        Please mark your address, to help us find your address more easily
      </Typography>
      <Box sx={{ height: '400px', width: '100%' }}>
        <Map
          onCoordinatesChange={handleCoordinatesChange}
          selectedCoordinates={
            coordinates
              ? { lat: Number(coordinates.lat), lon: Number(coordinates.lon) }
              : null
          }
        />
      </Box>

      <StyledButton type="submit" variant="contained" startIcon={<AddIcon />}>
        Submit
      </StyledButton>
    </Box>
  );
}
