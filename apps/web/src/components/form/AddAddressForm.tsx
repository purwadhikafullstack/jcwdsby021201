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
} from '@/features/user/location/locationQueries';
import { useAddAddress } from '@/features/user/address/addressMutations';
import Map from '../map/Map';
import { errorNotification } from '@/utils/notifications';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

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
  shouldRedirect?: boolean;
}

export default function AddressForm({
  onAddressAdded,
  shouldRedirect = false,
}: AddressFormProps) {
  //AUTH
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  //USE FORM
  const { control, handleSubmit, reset, setValue } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  //FETCG DATA PROVINCE DAN CITY, TRIGGER CITY BY PROVINCE
  const { data: provinces, isLoading: isLoadingProvinces } = useFetchProvince();
  const [selectedProvince, setSelectedProvince] = React.useState<number>(0);
  const { data: cities, isLoading: isLoadingCities } =
    useFetchCities(selectedProvince);

  //State untuk titik koordinat:
  const [coordinates, setCoordinates] = React.useState<{
    lat: number;
    lon: number;
  } | null>(null);

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

  // Fungsi untuk mengatur koordinat yang diperoleh dari komponen Map
  const handleCoordinatesChange = (lat: number, lon: number) => {
    setCoordinates({ lat: lat, lon: lon });
  };

  //Fetch coordinates
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
      }}
    >
      <Typography variant="h6" sx={{ textTransform: 'uppercase' }}>
        Add New Address
      </Typography>

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
              sx={{ backgroundColor: 'white' }}
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
              sx={{ backgroundColor: 'white' }}
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
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {provinces?.slice(0, 34).map((province: any) => (
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
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
              sx={{ backgroundColor: 'white' }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {cities?.slice(0, 36).map((city: any) => (
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
              sx={{ backgroundColor: 'white' }}
            />
          </FormControl>
        )}
      />

      <Typography sx={{ color: 'black', fontStyle: 'italic' }}>
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

      <Button
        sx={{ p: 2, ...buttonPrimaryStyles }}
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
      >
        Submit
      </Button>
    </Box>
  );
}
