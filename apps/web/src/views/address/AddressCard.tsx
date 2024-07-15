'use client';

import * as React from 'react';

//MATERIAL UI
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
} from '@mui/material';

//REACT-QUERY
import {
  useGetProvinceName,
  useGetCityName,
} from '@/features/user/location/locationQueries';

//OTHER
import { useRouter } from 'next/navigation';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';

interface IAddressCardProps {
  address: any;
}

const AddressCard: React.FunctionComponent<IAddressCardProps> = ({
  address,
}: IAddressCardProps) => {
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
          <Button
            sx={{
              mt: '10px',
              fontWeight: 'bold',
              padding: '12px 16px',
              fontSize: '14px',
              textTransform: 'uppercase',
              ...buttonPrimaryStyles,
            }}
            fullWidth
            component="span"
            size="small"
          >
            Edit
          </Button>
        </Box>
      </Card>
    </Grid>
  );
};

export default AddressCard;
