import axiosInstance from '@/utils/axiosInstance';
import { ProductWishlist } from './type';
import { apiRoutes } from '@/utils/routes';

export const getWishlistData = async (token: string) => {
  const res = await axiosInstance.get<any>(apiRoutes.wishlists.path, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data.result;
};

export const removeWishlist = async ({ token, productId }: ProductWishlist) => {
  const res = await axiosInstance.delete<any>(apiRoutes.wishlists.path, {
    headers: { Authorization: `Bearer ${token}` },
    data: { productId },
  });
  return res.data;
};

export const AddWishlist = async ({ token, productId }: ProductWishlist) => {
  const res = await axiosInstance.post<any>(
    apiRoutes.wishlists.path,
    { productId },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

export const getCountWishlist = async (token: string) => {
  const res = await axiosInstance.get<any>(
    `${apiRoutes.wishlists.path}/count`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.result;
};
