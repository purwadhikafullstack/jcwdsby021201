import * as React from 'react';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';
import { useGetProfileById } from '@/features/user/profile/profileQueries';
import { useGetAddressById } from '@/features/user/address/addressQueries';

export function useProfileLogic() {
  const session = useSession();
  const user = session.data?.user as UserSession;
  const token = user?.token;

  const { data: dataAddress, error: errorAddress } = useGetAddressById(token || '');
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

  return {
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
  };
}