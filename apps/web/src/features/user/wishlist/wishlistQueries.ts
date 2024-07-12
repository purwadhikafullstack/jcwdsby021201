import { useQuery } from '@tanstack/react-query';
import { getCountWishlist, getWishlistData } from './wishlistFetcher';

export const useGetWishlistData = (token: string) => {
  return useQuery({
    queryKey: ['my-wishlist', token],
    queryFn: () => getWishlistData(token!),
    enabled: !!token,
  });
};

export const useGetCountWishlist = (token: string) => {
  return useQuery({
    queryKey: ['my-wishlist-badge', token],
    queryFn: () => getCountWishlist(token!),
    enabled: !!token,
  });
};
