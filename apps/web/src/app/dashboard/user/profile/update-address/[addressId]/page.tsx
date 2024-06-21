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
} from '@/features/user/location/locationQueries';
import { AddressBody } from '@/features/user/address/type';
import { deleteAddress } from '@/features/user/address/addressFetchers';
import {
  useDeleteAddress,
  useUpdateAddress,
} from '@/features/user/address/addressMutations';

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
    error,
    isLoading,
  }: {
    data: AddressBody | undefined;
    error: Error | null;
    isLoading: boolean;
  } = useGetAddressByAddressId(token || '', String(addressId));

  //PENGATURAN NGAMBIL PROVINCE DAN CITY
  const { data: provinces, isLoading: isLoadingProvinces } = useFetchProvince();
  const [selectedProvince, setSelectedProvince] = React.useState<string>('');
  const { data: cities, isLoading: isLoadingCities } =
    useFetchCities(selectedProvince);

  //Penggunaan Mutation
  const { mutateAsync: deleteAddressMutateAsync, isPending: isDeletePending } =
    useDeleteAddress();
  const { mutateAsync: updateAddressMutateAsync, isPending: isUpdatePending } =
    useUpdateAddress();

  React.useEffect(() => {
    if (data && data.province) {
      setValue('name', data.name);
      setValue('address', data.address);
      setValue('city', data.city);
      setValue('province', data.province);
      setValue('postalCode', data.postalCode);
      setValue('isPrimary', data.isPrimary === true ? true : false);
      setSelectedProvince(data.province);
    }
  }, [data, setValue]);

  const handleProvinceChange = (event: SelectChangeEvent<string>) => {
    const provinceId = event.target.value as string;
    setSelectedProvince(String(provinceId));
    setValue('province', String(provinceId));
    setValue('city', '');
  };

  const handleCityChange = (event: SelectChangeEvent<string>) => {
    const cityId = event.target.value as string;
    setValue('city', cityId);
  };

  const onSubmit = async (data: AddressSchema) => {
    try {
      if (token) {
        await updateAddressMutateAsync({
          token: token,
          addressId: String(addressId),
          data,
        });
        reset(defaultValues);
      }
    } catch (error) {
      console.error('Error:', error);
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

  return (
    <Box
      component="form"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2, // Gunakan theme.spacing
        maxWidth: 500, // Sedikit lebih lebar
        padding: 3, // Tambahkan padding
        borderRadius: 2, // Rounding corners
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)', // Tambahkan shadow
        backgroundColor: 'background.paper', // Sesuaikan dengan theme
        margin: 'auto', // Tengah-kan form
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
                <MenuItem
                  key={province.provinceId}
                  value={String(province.provinceId)}
                >
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
