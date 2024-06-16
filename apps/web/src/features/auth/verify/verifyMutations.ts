import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { verifyToken } from '@/features/auth/verify/verifyFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { authPages } from '@/utils/routes';

export const useVerifyToken = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: verifyToken,
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
