import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { forgotPassword } from '@/features/auth/forgotPassword/forgotPasswordFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { authPages } from '@/utils/routes';

export const useForgotPassword = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: forgotPassword,
    onSuccess: (data) => {
      if (data.success) {
        successNotification(data.message);
        router.replace(authPages.checkMail.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
