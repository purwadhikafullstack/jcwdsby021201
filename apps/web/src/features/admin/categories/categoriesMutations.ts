import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from '@/features/admin/categories/categoriesFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';

export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createCategory,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.category.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.category.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['categories'] });
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
