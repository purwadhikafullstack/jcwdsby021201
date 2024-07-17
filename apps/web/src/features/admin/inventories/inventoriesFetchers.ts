import {
  HistoryResponse,
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { InventoryBody, InventoryResponse, InventoryUpdate } from './types';
import { apiRoutes } from '@/utils/routes';

export const createInventory = async (data: InventoryBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>(
    apiRoutes.inventories.path,
    data,
  );

  return res.data;
};

export const getInventories = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<InventoryResponse[]>>(
    apiRoutes.inventories.path,
    { params },
  );

  return res.data;
};

export const deleteInventory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(
    `${apiRoutes.inventories.path}/${id}`,
  );

  return res.data;
};

export const getInventory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<InventoryResponse>>(
    `${apiRoutes.inventories.path}/${id}`,
  );

  return res.data;
};

export const updateInventory = async ({ id, ...data }: InventoryUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `${apiRoutes.inventories.path}/${id}`,
    data,
  );

  return res.data;
};

export const getInventoryHistory = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<HistoryResponse[]>>(
    `${apiRoutes.inventories.path}/history`,
    { params },
  );

  return res.data;
};

export const getInventoryHistoryById = async (
  id: string,
  params: QueryPagination,
) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<HistoryResponse[]>>(
    `${apiRoutes.inventories.path}/history/${id}`,
    { params },
  );

  return res.data;
};
