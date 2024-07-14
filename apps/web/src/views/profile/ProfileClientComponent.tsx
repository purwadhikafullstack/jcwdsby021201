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
import UsernameModalUpdate from '@/components/modal/UsernameModalUpdate';
import PasswordModalUpdate from '@/components/modal/PasswordModalUpdate';
import EmailModalUpdate from '@/components/modal/EmailModalUpdate';
import ProfileModalUpdate from '@/components/modal/ProfileModalUpdate';
import Image from 'next/image';
import StyledButton from '@/components/button/StyledButton';
import { useProfileLogic } from './useProfileLogic';

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const {
    data,
    isLoading,
    primaryAddress,
    open,
    profilePictureModal,
    passwordModal,
    emailModal,
    handleOpen,
    handleClose,
    handleOpenPasswordModal,
    handleClosePasswordModal,
    handleOpenEmailModal,
    handleCloseEmailModal,
    handleOpenProfilePictureModal,
    handleCloseProfilePictureModal,
  } = useProfileLogic();

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
                    data.image && data.image.startsWith('https')
                      ? data.image
                      : `${process.env.NEXT_PUBLIC_BASE_API_URL || ''}${data.image || '/profile.jpg'}`
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
          <Grid item xs={12} display="flex" justifyContent="left"></Grid>
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
              <StyledButton variant="outlined" onClick={handleOpen} fullWidth>
                {' '}
                {data?.username ? data?.username : 'Choose username'}
              </StyledButton>
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
              <StyledButton onClick={handleOpenEmailModal} fullWidth>
                {' '}
                {data?.email}
              </StyledButton>
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
                <StyledButton variant="outlined" fullWidth>
                  {primaryAddress ? primaryAddress : 'Location'}
                </StyledButton>
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
              <StyledButton fullWidth onClick={handleOpenPasswordModal}>
                {data?.password ? 'SECRET' : 'SECRET'}
              </StyledButton>
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
