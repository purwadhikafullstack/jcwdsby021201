'use client';
import * as React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Skeleton,
} from '@mui/material';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useGetAddressById } from '@/features/user/address/addressQueries';
import { UserSession } from '@/features/types';
import {
  useGetProvinceName,
  useGetCityName,
} from '@/features/user/location/locationQueries';
import { useRouter } from 'next/navigation';
import StyledButton from '@/components/button/StyledButton';

interface IAddressListProps {}

const AddressList: React.FunctionComponent<IAddressListProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const { data: addresses, error, isLoading } = useGetAddressById(token || '');

  return (
    <Box>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        width="100%"
        p={2}
      >
        <Typography
          variant="h4"
          gutterBottom
          fontWeight={500}
          sx={{ fontSize: '20px' }}
        >
          Address List
        </Typography>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" />
        ) : addresses ? (
          <Grid container spacing={3} justifyContent="center">
            {addresses.map((address: any, index: number) => (
              <AddressCard key={index} address={address} />
            ))}
          </Grid>
        ) : (
          <Skeleton variant="rectangular" width="100%" height="30vh" />
        )}

        <Box mt={3}>
          <Link href={'/dashboard/user/profile/create-address'} passHref>
            <StyledButton variant="contained" color="primary">
              Add New Address
            </StyledButton>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

const AddressCard = ({ address }: { address: any }) => {
  const router = useRouter();
  const { data: provinceName, isLoading: isProvinceLoading } =
    useGetProvinceName(address.provinceId);
  const { data: cityName, isLoading: isCityLoading } = useGetCityName(
    address.cityId,
  );

  return (
    <Grid item>
      <Card
        onClick={() =>
          router.push(`/dashboard/user/profile/update-address/${address.id}`)
        }
        sx={{
          width: 345,
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        }}
      >
        <CardContent>
          <Typography
            gutterBottom
            variant="h5"
            component="div"
            sx={{ textDecoration: 'none' }}
          >
            {address.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {address.address}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Province:{' '}
            {isProvinceLoading
              ? 'Loading...'
              : provinceName?.name || address.provinceId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            City:{' '}
            {isCityLoading
              ? 'Loading...'
              : cityName?.[0]?.name || address.cityId}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Postal Code: {address.postalCode}
          </Typography>
          {address.isPrimary && (
            <Typography
              variant="body2"
              color="primary"
              sx={{ fontWeight: 'bold', marginTop: 1 }}
            >
              Primary Address
            </Typography>
          )}
        </CardContent>
        <Box p={2} textAlign="center">
          <StyledButton
            variant="outlined"
            color="primary"
            component="span"
            size="small"
          >
            Edit
          </StyledButton>
        </Box>
      </Card>
    </Grid>
  );
};

export default AddressList;
