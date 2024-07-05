import { Prisma } from '@prisma/client';

export type WarehouseBody = {
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  latitude: number;
  longitude: number;
};

export type WarehouseQuery = {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  orderBy?: string;
};

export type WarehouseResponse = Prisma.WarehouseGetPayload<{
  include: {
    province: { select: { id: true; name: true } };
    city: { select: { id: true; name: true } };
    user: { select: { id: true; username: true } };
  };
}>;

export type WarehouseDeleteInventory = {
  id: number;
  name: string;
  user: {
    id: number;
    username: string | null;
  } | null;
};
