'use client';

import * as React from 'react';

//MATERIAL UI
import {
  Box,
  Typography,
  Grid,
  Skeleton,
  Button,
} from '@mui/material';

// OTHER
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import AddressCard from './AddressCard';
import { buttonPrimaryStyles } from '@/styles/buttonStyles';
import { useGetAddressById } from '@/features/user/address/addressQueries';

//AUTH
import { UserSession } from '@/features/types';

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
          variant="h5"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textTransform: 'uppercase',
            mb: 5,
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
            <Button
              sx={{
                mt: '10px',
                fontWeight: 'bold',
                padding: '12px 16px',
                fontSize: '14px',
                textTransform: 'uppercase',
                ...buttonPrimaryStyles,
              }}
              variant="contained"
              color="primary"
            >
              Add New Address
            </Button>
          </Link>
        </Box>
      </Box>
    </Box>
  );
};

export default AddressList;
