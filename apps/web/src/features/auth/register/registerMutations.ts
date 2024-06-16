import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { register } from '@/features/auth/register/registerFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { authPages } from '@/utils/routes';

export const useRegister = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: register,
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
