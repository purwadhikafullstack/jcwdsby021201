import {
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { InventoryBody, InventoryResponse } from './types';

export const createInventory = async (data: InventoryBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>('/inventories', data);

  return res.data;
};

export const getInventories = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<InventoryResponse[]>>(
    '/inventories',
    { params },
  );

  return res.data;
};

export const deleteInventory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(`/inventories/${id}`);

  return res.data;
};

export const getInventory = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<InventoryResponse>>(
    `/inventories/${id}`,
  );

  return res.data;
};
