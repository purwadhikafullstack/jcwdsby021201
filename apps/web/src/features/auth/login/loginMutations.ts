import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { loginTransport } from '@/features/auth/login/loginFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { mainPages } from '@/utils/routes';

export const useLoginTransport = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: loginTransport,
    onSuccess: (data) => {
      if (data.success) {
        successNotification(data.message);
        router.refresh();

        if (window.history?.length && window.history.length > 2) {
          router.back();
        } else {
          router.replace(mainPages.home.path);
        }
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
