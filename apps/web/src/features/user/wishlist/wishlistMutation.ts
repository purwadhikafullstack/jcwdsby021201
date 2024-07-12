import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AddWishlist, removeWishlist } from './wishlistFetcher';
import { errorNotification, infoNotification, successNotification } from '@/utils/notifications';

export const useRemoveWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeWishlist,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['my-wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['my-wishlist-badge'] });
        infoNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};

export const useAddWishlist = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: AddWishlist,
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['my-wishlist'] });
        queryClient.invalidateQueries({ queryKey: ['my-wishlist-badge'] });
        successNotification(data.message);
      } else {
        errorNotification(data.message);
      }
    },
  });
};
