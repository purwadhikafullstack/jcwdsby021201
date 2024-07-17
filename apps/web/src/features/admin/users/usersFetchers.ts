import {
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import {
  AdminResponse,
  UserBody,
  UserQueryPagination,
  UserResponse,
  UserUpdate,
} from './types';
import { apiRoutes } from '@/utils/routes';

export const getWarehouseAdmins = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<AdminResponse[]>>(
    `${apiRoutes.admin.path}/admins`,
    { params },
  );

  return res.data;
};

export const createUser = async (data: UserBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>(
    `${apiRoutes.admin.path}/users`,
    data,
  );

  return res.data;
};

export const getUsers = async (params: UserQueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<UserResponse[]>>(
    `${apiRoutes.admin.path}/users`,
    { params },
  );

  return res.data;
};

export const deleteUser = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(
    `${apiRoutes.admin.path}/users/${id}`,
  );

  return res.data;
};

export const getUser = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<UserResponse>>(
    `${apiRoutes.admin.path}/users/${id}`,
  );

  return res.data;
};

export const updateUser = async ({ id, ...data }: UserUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `${apiRoutes.admin.path}/users/${id}`,
    data,
  );

  return res.data;
};
