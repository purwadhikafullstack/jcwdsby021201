'use client';
import * as React from 'react';
import Link from 'next/link';
import {
  Button,
  Box,
  Typography,
  Container,
  Grid,
  Modal,
  Backdrop,
  Fade,
  Divider,
  Skeleton,
} from '@mui/material';
import { Verified } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetProfileById } from '@/features/user/profile/profileQueries';
import ChangeUsernameForm from '@/components/form/UpdateUsernameForm';
import ChangePasswordForm from '@/components/form/UpdatePasswordForm';
import ChangeEmailForm from '@/components/form/UpdateEmailForm';
import { useGetAddressById } from '@/features/user/address/addressQueries';
import ProfilePictureForm from '@/components/form/UpdateProfileForm';

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;
  const { data: dataAddress, error: errorAddress } = useGetAddressById(
    token || '',
  );
  const { data, error, isLoading } = useGetProfileById(token || '');

  const [dataUser, setDataUser] = React.useState<any>([]);
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
              ) : data?.image ? (
                <img
                  src={process.env.NEXT_PUBLIC_BASE_API_URL + `${data.image}`}
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
        <Modal
          open={profilePictureModal}
          onClose={handleCloseProfilePictureModal}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
        >
          <Fade in={profilePictureModal}>
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '90%',
                maxWidth: 400,
                bgcolor: 'background.paper',
                p: 4,
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <ProfilePictureForm
                userId={5}
                handleClose={handleCloseProfilePictureModal}
              />
            </Box>
          </Fade>
        </Modal>
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
            ) : data?.username ? (
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
            ) : data?.password ? (
              <Button
                variant="outlined"
                fullWidth
                onClick={handleOpenPasswordModal}
              >
                {data?.password ? 'SECRET' : ''}
              </Button>
            ) : (
              <Skeleton variant="rectangular" width="100%" />
            )}
          </Grid>
        </Grid>
      </Container>
      <Modal
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 400,
              bgcolor: 'background.paper',
              p: 4,
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ChangeUsernameForm
              initialUsername={data?.username ? data?.username : ''}
              handleClose={handleClose}
            />
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={passwordModal}
        onClose={handleClosePasswordModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={passwordModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 400,
              bgcolor: 'background.paper',
              p: 4,
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ChangePasswordForm handleClose={handleClosePasswordModal} />
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={emailModal}
        onClose={handleCloseEmailModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={emailModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '90%',
              maxWidth: 400,
              bgcolor: 'background.paper',
              p: 4,
              border: '1px solid #ccc',
              borderRadius: '8px',
              boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <ChangeEmailForm
              initialEmail={data?.email ? data?.email : ''}
              handleClose={handleCloseEmailModal}
            />
          </Box>
        </Fade>
      </Modal>
    </Box>
  );
};

export default Profile;
