'use client';

// React Hook Form
import { Controller, useForm } from 'react-hook-form';
import * as React from 'react';
import { Add as AddIcon, Token } from '@mui/icons-material';
// Zod
import { zodResolver } from '@hookform/resolvers/zod';
import { AddressSchema, addressSchema } from './schemas/addAddressSchema';

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
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import {
  useFetchCities,
  useFetchProvince,
} from '@/features/user/location/locationQueries';
import { useAddAddress } from '@/features/user/address/addressMutations';

// Penampung
const defaultValues: AddressSchema = {
  name: '',
  address: '',
  city: '',
  province: '',
  postalCode: '',
  userId: 0,
  isPrimary: false,
};

export default function AddressForm() {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const userId = user?.id || 0; // Ambil userId dari session jika tersedia
  const token = user?.token;

  const { control, handleSubmit, reset, setValue } = useForm<AddressSchema>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  //PENGATURAN NGAMBIL PROVINCE DAN CITY
  const { data: provinces, isLoading: isLoadingProvinces } = useFetchProvince();
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');
  const { data: cities, isLoading: isLoadingCities } =
    useFetchCities(selectedProvince);

  //NGAMBIL MUTATION
  const { mutateAsync: addAddressMutateAsync, isPending: isADdPending } =
    useAddAddress();

  const handleProvinceChange = (event: SelectChangeEvent<string>) => {
    const provinceId = event.target.value as string;
    setSelectedProvince(provinceId);
    setValue('province', provinceId);
  };

  const handleCityChange = (event: SelectChangeEvent<string>) => {
    const cityId = event.target.value as string;
    setValue('city', cityId);
  };

  const onSubmit = async (data: AddressSchema) => {
    try {
      if (token) {
        await addAddressMutateAsync({ addressData: data, token: token });
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

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
        maxWidth: '400px',
        margin: 'auto', 
        mt: '50px', 
        p: '20px', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', 
      }}
    >
      <Typography variant="h4" gutterBottom>
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
        name="province"
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
                <MenuItem key={province.id} value={String(province.provinceId)}>
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
        name="city"
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
                <MenuItem key={city.cityId} value={String(city.cityId)}>
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

      <Button type="submit" variant="contained" startIcon={<AddIcon />}>
        Submit
      </Button>
    </Box>
  );
}
