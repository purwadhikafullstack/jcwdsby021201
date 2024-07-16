import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/features/auth/resetPassword/resetPasswordFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { authPages } from '@/utils/routes';
import { signOut } from 'next-auth/react';

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.success) {
        successNotification(data.message);
        signOut({ callbackUrl: authPages.login.path });
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
