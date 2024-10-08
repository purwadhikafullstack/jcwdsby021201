import { InventoryResponse } from '@/features/admin/inventories/types';
import type { User } from 'next-auth';

export type ResponseWithData<T = any> = {
  rc: number;
  success: boolean;
  message: string;
  result: T;
};

export type ResponseWithoutData = {
  rc: number;
  success: boolean;
  message: string;
};

export type ResponseDataPagination<T = any> = {
  rc: number;
  success: boolean;
  message: string;
  result: T;
  pagination: { page: number; limit: number; total: number };
};

export type Pagination = {
  page?: string | number;
  limit?: string | number;
  sort_by?: string;
  order_by?: string;
};

export type UserSession =
  | (User & {
      username?: string;
      email?: string;
      isVerified?: boolean;
      role?: 'SUPER_ADMIN' | 'ADMIN' | 'USER';
      image?: string | null;
      token?: string;
    })
  | undefined;

export type QueryPagination = {
  page?: number;
  limit?: number;
  filter?: string | number;
  sortBy?: string;
  orderBy?: string;
};

export type OptionLabel = {
  id: number;
  name: string;
};

export type UserOption = {
  id: number;
  username: string | null;
};

export type AdminOption = {
  id: number;
  username: string;
};

export type HistoryResponse = {
  id: number;
  quantity: number;
  transactionType: 'IN' | 'OUT';
  description: string;
  productWarehouseId: number;
  warehouseId: number | null;
  refMutationId: number | null;
  createdAt: string;
  updatedAt: string;
  productWarehouse: InventoryResponse;
};

export type ExportHistory = {
  id: number;
  date: string;
  quantity: number;
  type: 'IN' | 'OUT';
  product: string;
  warehouse: string;
  mutationCode: number | null;
  description: string;
};
