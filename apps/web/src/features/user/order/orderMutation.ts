import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelOrder, receiveOrder, uploadPaymmentProof } from './orderFetcher';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';

export const useUploadPaymmentProof = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: uploadPaymmentProof,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['list-orders'] });
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

export const useCancelOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['list-orders'] });
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

export const useReceiveOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: receiveOrder,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['list-orders-shipped'] });
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
