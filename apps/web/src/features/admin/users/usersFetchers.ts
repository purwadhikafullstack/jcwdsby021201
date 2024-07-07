import {
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { AdminResponse, UserBody, UserResponse, UserUpdate } from './types';

export const getWarehouseAdmins = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<AdminResponse[]>>(
    '/admin/admins',
    { params },
  );

  return res.data;
};

export const createUser = async (data: UserBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>('/admin/users', data);

  return res.data;
};

export const getUsers = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<UserResponse[]>>(
    `/admin/users`,
    { params },
  );

  return res.data;
};

export const deleteUser = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(`/admin/users/${id}`);

  return res.data;
};

export const getUser = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<UserResponse>>(
    `/admin/users/${id}`,
  );

  return res.data;
};

export const updateUser = async ({ id, ...data }: UserUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `/admin/users/${id}`,
    data,
  );

  return res.data;
};
