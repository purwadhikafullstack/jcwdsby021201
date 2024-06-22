import {
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { CategoryBody, CategoryResponse, CategoryUpdate } from './types';

export const getCategories = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<CategoryResponse[]>>(
    '/categories',
    { params },
  );

  return res.data;
};

export const createCategory = async (data: CategoryBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>('/categories', data);

  return res.data;
};

export const getCategory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<CategoryResponse>>(
    `/categories/${id}`,
  );

  return res.data;
};

export const updateCategory = async ({ id, name }: CategoryUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(`/categories/${id}`, {
    name,
  });

  return res.data;
};

export const deleteCategory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(`/categories/${id}`);

  return res.data;
};
