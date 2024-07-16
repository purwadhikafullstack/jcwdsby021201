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

//AUTH
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';

//QUERY
import { useGetAddressByAddressId } from '@/features/user/address/addressQueries';
import {
  useFetchCities,
  useFetchProvince,
} from '@/features/user/location/locationQueries';
import { AddressBody } from '@/features/user/address/type';
import {
  useDeleteAddress,
  useUpdateAddress,
} from '@/features/user/address/addressMutations';
import Map from '@/components/map/Map';
import { errorNotification } from '@/utils/notifications';
import { ConfirmationDeleteAddress } from '@/components/dialog/ConfirmationDeleteAddress';
import { buttonPrimaryStyles, buttonBackStyles } from '@/styles/buttonStyles';

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

  //AUTH
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  //PARAMS
  const id = useParams();
  const addressId = id.addressId;

  //QUERIS
  const {
    data,
  }: {
    data: AddressBody | undefined;
    error: Error | null;
    isLoading: boolean;
  } = useGetAddressByAddressId(token || '', String(addressId));

  //PENGATURAN NGAMBIL PROVINCE DAN CITY
  const { data: provinces } = useFetchProvince();
  const [selectedProvince, setSelectedProvince] = React.useState<number>(0);
  const { data: cities } = useFetchCities(selectedProvince);

  //Penggunaan Mutation
  const { mutateAsync: deleteAddressMutateAsync, isPending: isDeletePending } =
    useDeleteAddress();
  const { mutateAsync: updateAddressMutateAsync } = useUpdateAddress();

  //State untuk titik koordinat:
  const [coordinates, setCoordinates] = React.useState<{
    lat: number;
    lon: number;
  } | null>(null);

  //handle dialog:
  const [openDialog, setOpenDialog] = React.useState(false);
  const handleDelete = () => {
    setOpenDialog(true);
  };
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  //FETCH DATA AWAL
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

  const handleConfirmDelete = async () => {
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
        gap: '10px',
        maxWidth: '800px',
        margin: 'auto',
        mt: '50px',
        p: '20px',
      }}
    >
      <Typography variant="h6" gutterBottom sx={{ textTransform: 'uppercase' }}>
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
              variant="outlined"
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
              id="provinceId"
              labelId="province-label"
              onChange={handleProvinceChange}
              sx={{ backgroundColor: 'white' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
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
              sx={{ backgroundColor: 'white' }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200,
                  },
                },
              }}
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
              sx={{ backgroundColor: 'white' }}
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
            label="Main Address"
            sx={{
              '& .MuiSwitch-switchBase': {
                color: '#000',
                '&.Mui-checked': {
                  color: '#000',
                  '& + .MuiSwitch-track': {
                    backgroundColor: '#000',
                  },
                },
              },
            }}
          />
        )}
      />
      <Typography color="primary" sx={{ color: 'black', fontStyle: 'italic' }}>
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
          variant="outlined"
          endIcon={<DeleteIcon />}
          sx={{
            ...buttonBackStyles,
            borderColor: 'white',
            '&:hover': {
              borderColor: 'white',
              backgroundColor: 'black',
            },
          }}
        >
          Delete
        </Button>
        <Button
          type="submit"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            ...buttonPrimaryStyles,
          }}
        >
          Update
        </Button>
      </Box>
      <ConfirmationDeleteAddress
        open={openDialog}
        onClose={handleDialogClose}
        mutation={handleConfirmDelete}
        isPending={isDeletePending}
        addressId={String(addressId)}
      />
    </Box>
  );
};

export default UpdateAddress;
