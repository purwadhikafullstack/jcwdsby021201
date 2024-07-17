import { ResponseWithData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { ProductBody } from './type';

export const getProducts = async () => {
  const res =
    await axiosInstance.get<ResponseWithData<ProductBody[]>>(
      '/products/display',
    );
  return res.data.result;
};

export const getStock = async (productId: number) => {
  const res = await axiosInstance.get<ResponseWithData>(
    `/products/stock/${productId}`,
  );
  return res.data.result.stock;
};
