import { createSample } from '@/features/user/samples/sampleFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { useQueryClient, useMutation } from '@tanstack/react-query';

export const useCreateSample = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSample,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['samples'] });
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
