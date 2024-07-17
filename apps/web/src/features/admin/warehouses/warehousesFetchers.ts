import {
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import {
  WarehouseBody,
  WarehouseQueryPagination,
  WarehouseResponse,
  WarehouseUpdate,
} from './types';
import { apiRoutes } from '@/utils/routes';

export const createWarehouse = async (data: WarehouseBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>(
    apiRoutes.warehouses.path,
    data,
  );

  return res.data;
};

export const getWarehouses = async (params: WarehouseQueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<WarehouseResponse[]>>(
    apiRoutes.warehouses.path,
    { params },
  );

  return res.data;
};

export const deleteWarehouse = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(
    `${apiRoutes.warehouses.path}/${id}`,
  );

  return res.data;
};

export const getWarehouse = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<WarehouseResponse>>(
    `${apiRoutes.warehouses.path}/${id}`,
  );

  return res.data;
};

export const updateWarehouse = async ({ id, ...data }: WarehouseUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `${apiRoutes.warehouses.path}/${id}`,
    data,
  );

  return res.data;
};

export const getUserWarehouse = async () => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<WarehouseResponse>>(
    `${apiRoutes.warehouses.path}/user`,
  );

  return res.data;
};
