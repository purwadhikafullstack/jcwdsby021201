import { OptionLabel, QueryPagination } from '@/features/types';

export type WarehouseBody = {
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  latitude: number;
  longitude: number;
};

export type WarehouseResponse = WarehouseBody & {
  id: number;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
  province: OptionLabel;
  city: OptionLabel;
  user: {
    id: number;
    username: string | null;
  };
};

export type WarehouseUpdate = WarehouseBody & { id: number };

export type WarehouseQueryPagination = QueryPagination & {
  excludeId?: number;
};
