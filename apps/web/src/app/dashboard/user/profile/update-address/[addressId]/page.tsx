'use client';
import { useParams } from 'next/navigation';

// React Hook Form
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import { Add as AddIcon } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
// Zod
import { zodResolver } from '@hookform/resolvers/zod';
import {
  AddressSchema,
  addressSchema,
} from '@/components/form/schemas/addAddressSchema';

//Axios
import axios from 'axios';

// Material UI
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
  FormControlLabel,
  Switch,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetAddressByAddressId } from '@/features/user/address/addressQueries';
import {
  useFetchCities,
  useFetchProvince,
  useGetCityName,
  useGetProvinceName,
} from '@/features/user/location/locationQueries';
import { AddressBody } from '@/features/user/address/type';
import { deleteAddress } from '@/features/user/address/addressFetchers';
import {
  useDeleteAddress,
  useUpdateAddress,
} from '@/features/user/address/addressMutations';
import Map from '@/components/map/Map';
import { errorNotification } from '@/utils/notifications';

// Penampung
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

const UpdateAddress: React.FunctionComponent = () => {
  const { control, handleSubmit, reset, setValue } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  // PENGATURAN UNTUK NGAMBIL DATA
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const id = useParams();
  const addressId = id.addressId;
  const {
    data,
  }: {
    data: AddressBody | undefined;
    error: Error | null;
    isLoading: boolean;
  } = useGetAddressByAddressId(token || '', String(addressId));

  //PENGATURAN NGAMBIL PROVINCE DAN CITY
  const { data: provinces, isLoading: isLoadingProvinces } = useFetchProvince();
  const [selectedProvince, setSelectedProvince] = React.useState<number>(0);
  const { data: cities, isLoading: isLoadingCities } =
    useFetchCities(selectedProvince);
  const [selectedCity, setSelectedCity] = React.useState<number>(0);

  //Penggunaan Mutation
  const { mutateAsync: deleteAddressMutateAsync, isPending: isDeletePending } =
    useDeleteAddress();
  const { mutateAsync: updateAddressMutateAsync, isPending: isUpdatePending } =
    useUpdateAddress();

  //State untuk titik koordinat:
  const [coordinates, setCoordinates] = React.useState<{
    lat: number;
    lon: number;
  } | null>(null);

  React.useEffect(() => {
    if (data && data.provinceId) {
      setValue('name', data.name);
      setValue('address', data.address);
      setValue('cityId', data.cityId);
      setValue('provinceId', data.provinceId);
      setValue('postalCode', data.postalCode);
      setValue('isPrimary', data.isPrimary === true ? true : false);
      setValue('latitude', data.latitude);
      setValue('longitude', data.longitude);
      setSelectedProvince(data.provinceId);

      if (data.latitude && data.longitude) {
        setCoordinates({
          lat: data.latitude,
          lon: data.longitude,
        });
      }
    }
  }, [data, setValue]);

  const handleProvinceChange = (event: SelectChangeEvent<number>) => {
    const provinceId = event.target.value as number;
    setSelectedProvince(provinceId);
    setValue('provinceId', provinceId);
    setValue('cityId', 0);
    setCoordinates(null);
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
        return;
      }
      if (token && coordinates) {
        const dataWithCoordinates = {
          ...data,
          latitude: coordinates.lat,
          longitude: coordinates.lon,
        };
        await updateAddressMutateAsync({
          token,
          addressId: String(addressId),
          data: dataWithCoordinates,
        });
      }
    } catch (error) {
      errorNotification('Sorry, an error occurred on our server');
    }
  };

  const handleDelete = async () => {
    try {
      if (token) {
        await deleteAddressMutateAsync({
          addressId: String(addressId),
          token: token,
        });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        gap: 2,
        maxWidth: '800px',
        padding: 3,
        borderRadius: 2,
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
        backgroundColor: 'background.paper',
        margin: 'auto',
        marginTop: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        Update Address
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
              variant="outlined"
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
              variant="outlined"
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
              id="provinceId"
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
              id="cityId"
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
              variant="outlined"
            />
          </FormControl>
        )}
      />

      <Controller
        control={control}
        name="isPrimary"
        render={({ field }) => (
          <FormControlLabel
            control={
              <Switch
                checked={field.value}
                onChange={(e) => field.onChange(e.target.checked)}
                color="primary"
              />
            }
            label="Menjadikan Alamat Utama"
          />
        )}
      />
      <Typography color="primary">
        Please mark your address again, to help us find your address more easily
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

      <Box display="flex" justifyContent="space-between">
        <Button
          onClick={handleDelete}
          color="secondary"
          variant="contained"
          endIcon={<DeleteIcon />}
        >
          Delete
        </Button>
        <Button type="submit" variant="contained" startIcon={<AddIcon />}>
          Update
        </Button>
      </Box>
    </Box>
  );
};

export default UpdateAddress;
