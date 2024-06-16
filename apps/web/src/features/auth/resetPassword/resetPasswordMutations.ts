import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { resetPassword } from '@/features/auth/resetPassword/resetPasswordFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { authPages } from '@/utils/routes';

export const useResetPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: resetPassword,
    onSuccess: (data) => {
      if (data.success) {
        successNotification(data.message);
        router.replace(authPages.login.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
