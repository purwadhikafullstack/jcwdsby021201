import axiosInstance from '@/utils/axiosInstance';
import { ProductWishlist } from './type';

export const getWishlistData = async (token: string) => {
  const res = await axiosInstance.get<any>('/wishlists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
};

export const removeWishlist = async ({ token, productId }: ProductWishlist) => {
  const res = await axiosInstance.delete<any>('/wishlists', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { productId },
  });
  return res.data;
};

export const AddWishlist = async ({ token, productId }: ProductWishlist) => {
  const res = await axiosInstance.post<any>(
    '/wishlists',
    { productId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data;
};

export const getCountWishlist = async (token: string) => {
  const res = await axiosInstance.get<any>('/wishlists/count', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
};
