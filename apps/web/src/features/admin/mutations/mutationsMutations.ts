import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createMutation,
  updateMutationToApprove,
  updateMutationToCancel,
} from '@/features/admin/mutations/mutationsFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';

export const useCreateMutation = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createMutation,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['mutations'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.mutation.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useUpdateMutationToCancel = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateMutationToCancel,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['mutations'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.mutation.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useUpdateMutationToApprove = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateMutationToApprove,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['mutations'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.mutation.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
