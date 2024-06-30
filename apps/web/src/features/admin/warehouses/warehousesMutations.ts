import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createWarehouse,
  deleteWarehouse,
  updateWarehouse,
} from '@/features/admin/warehouses/warehousesFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';

export const useCreateWarehouse = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createWarehouse,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.warehouse.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useDeleteWarehouse = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteWarehouse,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['warehouses'] });
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

export const useUpdateWarehouse = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateWarehouse,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['warehouses'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.warehouse.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};
