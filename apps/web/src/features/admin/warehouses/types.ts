import { OptionLabel } from '@/features/types';

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
};

export type WarehouseUpdate = WarehouseBody & { id: number };
