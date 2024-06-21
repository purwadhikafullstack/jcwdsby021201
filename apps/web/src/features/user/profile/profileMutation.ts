import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  changeProfileEmail,
  changeProfilePicture,
  changeProfileUpdate,
} from './profileFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { useRouter } from 'next/navigation';
export const useChangeProfileUpdate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeProfileUpdate,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useChangeProfileEmail = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeProfileEmail,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        router.push('/auth/check-mail-activation');
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useChangeProfilePicture = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeProfilePicture,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['profile'] });
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
