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
          sx={{
            fontWeight: 'bold ',
            textTransform: 'uppercase',
          }}
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
          backgroundColor: '#EEE',
          width: 345,
          cursor: 'pointer',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: 'none',
          boxShadow: 'none',
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.02)',
          },
        }}
      >
        <CardContent>
          <Typography
            gutterBottom
            variant="body1"
            component="div"
            sx={{
              textDecoration: 'none',
              textTransform: 'uppercase',
              fontWeight: 'bold',
            }}
          >
            {address.name}
          </Typography>

          <Typography variant="body1">
            Province:{' '}
            {isProvinceLoading
              ? 'Loading...'
              : provinceName?.name || address.provinceId}
          </Typography>
          <Typography variant="body1">
            City:{' '}
            {isCityLoading
              ? 'Loading...'
              : cityName?.[0]?.name || address.cityId}
          </Typography>
          <Typography variant="body1">
            Postal Code: {address.postalCode}
          </Typography>
          <Typography variant="body1">
            <Typography component="span" sx={{ fontWeight: 'bold' }}>
              Full Address :{' '}
            </Typography>{' '}
            {address.address}
          </Typography>
        </CardContent>
        {address.isPrimary && (
          <Box p={2} display="flex" flexDirection="column" alignItems="center">
            <Typography
              variant="body1"
              sx={{
                fontWeight: 'bold',
                color: 'black',
                textTransform: 'uppercase',
              }}
            >
              Primary Address
            </Typography>
          </Box>
        )}
        <Box textAlign="center">
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
