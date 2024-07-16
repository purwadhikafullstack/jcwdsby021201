import { useMutation, useQueryClient } from '@tanstack/react-query';
import { errorNotification, successNotification } from '@/utils/notifications';
import { useRouter } from 'next/navigation';
import { addToCart, deleteProduct, updateQuantity } from './cartFecther';

export const useAddToCart = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addToCart,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['badge-cart'] });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};

export const useUpdateQuantity = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateQuantity,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['badge-cart'] });
        queryClient.invalidateQueries({ queryKey: ['cart'] });
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};
