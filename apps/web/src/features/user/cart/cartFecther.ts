import { ResponseWithData, ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { CartCount, CartProduct, DeleteProduct, ProductBody } from './type';

export const getCountProductCart = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData<CartCount>>(
    '/carts/counter',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.result;
};

export const addToCart = async ({ token, data }: CartProduct) => {
  const res = await axiosInstance.post<ResponseWithoutData>('/carts', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const deleteProduct = async ({ token, productId }: DeleteProduct) => {
  const res = await axiosInstance.delete<ResponseWithoutData>(
    `/carts/${productId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getProductCart = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData<ProductBody[]>>(
    '/carts',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.result;
};

export const updateQuantity = async ({ token, data }: CartProduct) => {
  const res = await axiosInstance.patch<ResponseWithoutData>('/carts', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const checkStock = async (productId: number) => {
  const res = await axiosInstance.get<ResponseWithData>(
    `/products/${productId}`,
  );
  return res.data.result.stock;
};
