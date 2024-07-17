import {
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { CategoryBody, CategoryResponse, CategoryUpdate } from './types';
import { apiRoutes } from '@/utils/routes';

export const getCategories = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<CategoryResponse[]>>(
    apiRoutes.categories.path,
    { params },
  );

  return res.data;
};

export const createCategory = async (data: CategoryBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>(
    apiRoutes.categories.path,
    data,
  );

  return res.data;
};

export const getCategory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<CategoryResponse>>(
    `${apiRoutes.categories.path}/${id}`,
  );

  return res.data;
};

export const updateCategory = async ({ id, name }: CategoryUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `${apiRoutes.categories.path}/${id}`,
    { name },
  );

  return res.data;
};

export const deleteCategory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(
    `${apiRoutes.categories.path}/${id}`,
  );

  return res.data;
};
