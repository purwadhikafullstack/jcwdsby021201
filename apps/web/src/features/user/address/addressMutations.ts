import { useMutation } from '@tanstack/react-query';
import { addAddress, deleteAddress, updateAddress } from './addressFetchers';
import { errorNotification, successNotification } from '@/utils/notifications';
import { useRouter } from 'next/navigation';

export const useDeleteAddress = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: (data) => {
      if (data.success) {
        router.push('/dashboard/user/profile/address');
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};

export const useUpdateAddress = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: updateAddress,
    onSuccess: (data) => {
      if (data.success) {
        router.push('/dashboard/user/profile/address');
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};

export const useAddAddress = (shouldRedirect = true) => {
  const router = useRouter();
  return useMutation({
    mutationFn: addAddress,
    onSuccess: (data) => {
      if (data.success) {
        if (shouldRedirect) {
          router.push('/dashboard/user/profile/address');
        }
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};
