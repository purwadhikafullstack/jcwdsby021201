'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Divider,
  Skeleton,
} from '@mui/material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetProfileById } from '@/features/user/profile/profileQueries';
import { useGetAddressById } from '@/features/user/address/addressQueries';
import UsernameModalUpdate from '@/components/modal/UsernameModalUpdate';
import PasswordModalUpdate from '@/components/modal/PasswordModalUpdate';
import EmailModalUpdate from '@/components/modal/EmailModalUpdate';
import ProfileModalUpdate from '@/components/modal/ProfileModalUpdate';
import Image from 'next/image';

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const { data: dataAddress, error: errorAddress } = useGetAddressById(
    token || '',
  );
  const { data, error, isLoading } = useGetProfileById(token || '');

  const [open, setOpen] = React.useState(false);
  const [profilePictureModal, setProfilePictureModal] = React.useState(false);
  const [passwordModal, setPasswordModal] = React.useState(false);
  const [primaryAddress, setPrimaryAddress] = React.useState<string>('');
  const [emailModal, setEmailModal] = React.useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleOpenPasswordModal = () => setPasswordModal(true);
  const handleClosePasswordModal = () => setPasswordModal(false);

  const handleOpenEmailModal = () => setEmailModal(true);
  const handleCloseEmailModal = () => setEmailModal(false);

  const handleOpenProfilePictureModal = () => setProfilePictureModal(true);
  const handleCloseProfilePictureModal = () => setProfilePictureModal(false);

  React.useEffect(() => {
    if (dataAddress) {
      const primaryAddr = dataAddress?.find((addr: any) => addr.isPrimary);
      if (primaryAddr) {
        setPrimaryAddress(primaryAddr.address);
      } else {
        setPrimaryAddress('Anda Belum Memasukan alamat utama');
      }
    }
  }, [dataAddress]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        maxWidth: '500px',
        margin: 'auto',
        mt: '50px',
        p: '14px',
        border: '1px solid #ccc',
      }}
    >
      <Typography fontWeight={500} sx={{ fontSize: '20px' }}>
        Account Information
      </Typography>
      <Divider />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: '1000' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="center">
            <Box>
              {isLoading ? (
                <Skeleton variant="circular" width={150} height={150} />
              ) : data ? (
                <Image
                  src={
                    process.env.NEXT_PUBLIC_BASE_API_URL + `${data.image}` ||
                    `${data?.image}`
                  }
                  alt="Profile"
                  width={150}
                  height={150}
                  style={{ borderRadius: '50%', cursor: 'pointer' }}
                  onClick={handleOpenProfilePictureModal}
                />
              ) : (
                <Skeleton variant="circular" width={150} height={150} />
              )}
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} display="flex" justifyContent="center"></Grid>
          <Grid item xs={12}>
            <Typography
              variant="inherit"
              component="h1"
              color="common.black"
              textAlign="left"
              fontSize={16}
            >
              Username
            </Typography>
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" />
            ) : data ? (
              <Button variant="outlined" onClick={handleOpen} fullWidth>
                {' '}
                {data?.username ? data?.username : 'Choose username'}
              </Button>
            ) : (
              <Skeleton variant="rectangular" width="100%" />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="inherit"
              component="h1"
              color="common.black"
              textAlign="left"
              fontSize={16}
            >
              Email
            </Typography>
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" />
            ) : data?.email ? (
              <Button
                variant="outlined"
                onClick={handleOpenEmailModal}
                fullWidth
              >
                {' '}
                {data?.email}
              </Button>
            ) : (
              <Skeleton variant="rectangular" width="100%" />
            )}
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="inherit"
              component="h1"
              color="common.black"
              textAlign="left"
              fontSize={16}
            >
              Address
            </Typography>
            <Link href={'/dashboard/user/profile/address'}>
              {isLoading ? (
                <Skeleton variant="rectangular" width="100%" />
              ) : primaryAddress ? (
                <Button variant="outlined" fullWidth>
                  {primaryAddress ? primaryAddress : 'Location'}
                </Button>
              ) : (
                <Skeleton variant="rectangular" width="100%" />
              )}
            </Link>
          </Grid>
          <Grid item xs={12}>
            <Typography
              variant="inherit"
              component="h1"
              color="common.black"
              textAlign="left"
              fontSize={16}
            >
              Password
            </Typography>
            {isLoading ? (
              <Skeleton variant="rectangular" width="100%" />
            ) : data ? (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleOpenPasswordModal}
              >
                {data?.password ? 'SECRET' : 'SECRET'}
              </Button>
            ) : (
              <Skeleton variant="rectangular" width="100%" />
            )}
          </Grid>
        </Grid>
      </Container>

      <ProfileModalUpdate
        open={profilePictureModal}
        handleClose={handleCloseProfilePictureModal}
      />

      <UsernameModalUpdate
        open={open}
        handleClose={handleClose}
        initialUsername={data?.username ? data?.username : ''}
      />

      <PasswordModalUpdate
        open={passwordModal}
        handleClose={handleClosePasswordModal}
      />

      <EmailModalUpdate
        open={emailModal}
        handleClose={handleCloseEmailModal}
        initialEmail={data?.email ? data?.email : ''}
      />
    </Box>
  );
};

export default Profile;
