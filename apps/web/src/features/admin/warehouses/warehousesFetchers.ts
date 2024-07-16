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

export const createWarehouse = async (data: WarehouseBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>('/warehouses', data);

  return res.data;
};

export const getWarehouses = async (params: WarehouseQueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<WarehouseResponse[]>>(
    '/warehouses',
    { params },
  );

  return res.data;
};

export const deleteWarehouse = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(`/warehouses/${id}`);

  return res.data;
};

export const getWarehouse = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<WarehouseResponse>>(
    `/warehouses/${id}`,
  );

  return res.data;
};

export const updateWarehouse = async ({ id, ...data }: WarehouseUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `/warehouses/${id}`,
    data,
  );

  return res.data;
};

export const getUserWarehouse = async () => {
  const instance = await createAxiosInstance();
  const res =
    await instance.get<ResponseWithData<WarehouseResponse>>(`/warehouses/user`);

  return res.data;
};
