import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProduct,
  deleteProduct,
  deleteProductImage,
  updateProduct,
  uploadProductImage,
} from '@/features/admin/products/productsFetchers';
import {
  errorFetcherNotification,
  errorNotification,
  successNotification,
} from '@/utils/notifications';
import { dashboardAdminPages } from '@/utils/routes';

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.product.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
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

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: updateProduct,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
        successNotification(data.message);
        router.push(dashboardAdminPages.product.path);
      } else {
        errorNotification(data.message);
      }
    },
    onError: (error) => {
      errorFetcherNotification(error);
    },
  });
};

export const useDeleteProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProductImage,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['products'] });
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

export const useUploadProductImage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: uploadProductImage,
    onSuccess: (data, variables) => {
      if (data.success) {
        queryClient.setQueryData(['product', variables.id], data.result);
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
