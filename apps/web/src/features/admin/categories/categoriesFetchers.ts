import { QueryPagination, ResponseDataPagination } from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { CategoryResponse } from './types';

export const getCategories = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<CategoryResponse[]>>(
    '/categories',
    { params },
  );

  return res.data;
};
