import { ResponseWithData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { ProductBody } from './type';
import { apiRoutes } from '@/utils/routes';

export const getProducts = async () => {
  const res = await axiosInstance.get<ResponseWithData<ProductBody[]>>(
    `${apiRoutes.products.path}/display`,
  );

  return res.data.result;
};

export const getStock = async (productId: number) => {
  const res = await axiosInstance.get<ResponseWithData>(
    `${apiRoutes.products.path}/stock/${productId}`,
  );

  return res.data.result.stock;
};
