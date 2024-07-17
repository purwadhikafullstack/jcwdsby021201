import { ResponseWithData, ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { CartCount, CartProduct, DeleteProduct, ProductBody } from './type';
import { apiRoutes } from '@/utils/routes';

export const getCountProductCart = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData<CartCount>>(
    `${apiRoutes.carts.path}/counter`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.result;
};

export const addToCart = async ({ token, data }: CartProduct) => {
  const res = await axiosInstance.post<ResponseWithoutData>(
    apiRoutes.carts.path,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

export const deleteProduct = async ({ token, productId }: DeleteProduct) => {
  const res = await axiosInstance.delete<ResponseWithoutData>(
    `${apiRoutes.carts.path}/${productId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

export const getProductCart = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData<ProductBody[]>>(
    apiRoutes.carts.path,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.result;
};

export const updateQuantity = async ({ token, data }: CartProduct) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    apiRoutes.carts.path,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data;
};

export const checkStock = async (productId: number) => {
  const res = await axiosInstance.get<ResponseWithData>(
    `${apiRoutes.products.path}/stock/${productId}`,
  );
  return res.data.result.stock;
};
