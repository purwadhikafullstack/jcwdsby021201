import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { loginTransport } from '@/features/auth/login/loginFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';

export const useLoginTransport = () => {
  return useMutation({
    mutationFn: loginTransport,
    onSuccess: (data) => {
      if (data.success) {
        successNotification(data.message);
        window.location.reload();
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
