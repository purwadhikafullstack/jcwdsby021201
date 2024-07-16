'use client';

import * as React from 'react';

import { Box, Typography, Container, Grid, Divider } from '@mui/material';

import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetProfileById } from '@/features/user/profile/profileQueries';
import { useGetAddressById } from '@/features/user/address/addressQueries';

//MODAL
import UsernameModalUpdate from '@/components/modal/UsernameModalUpdate';
import PasswordModalUpdate from '@/components/modal/PasswordModalUpdate';
import EmailModalUpdate from '@/components/modal/EmailModalUpdate';
import ProfileModalUpdate from '@/components/modal/ProfileModalUpdate';

//SECTION
import UsernameSection from './UsernameSection';
import EmailSection from './EmailSection';
import AddressSection from './AddressSection';
import PhotoProfileSection from './PhotoProfileSection';
import PasswordSection from './PasswordSection';

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
      <Typography
        sx={{
          fontSize: '20px',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        Account Information
      </Typography>
      <Divider />
      <Container maxWidth="md" sx={{ position: 'relative', zIndex: '1000' }}>
        <Grid container spacing={2}>
          <PhotoProfileSection
            data={data}
            isLoading={isLoading}
            handleOpenProfilePictureModal={handleOpenProfilePictureModal}
          />
        </Grid>

        <Grid container spacing={2}>
          <UsernameSection
            isLoading={isLoading}
            data={data}
            handleOpen={handleOpen}
          />
          <EmailSection
            isLoading={isLoading}
            data={data}
            handleOpenEmailModal={handleOpenEmailModal}
          />
          <AddressSection
            isLoading={isLoading}
            primaryAddress={primaryAddress}
          />
          <PasswordSection
            data={data}
            handleOpenPasswordModal={handleOpenPasswordModal}
            isLoading={isLoading}
          />
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
