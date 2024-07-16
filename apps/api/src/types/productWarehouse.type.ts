import { Prisma } from '@prisma/client';

export type ProductWarehouseBody = {
  warehouseId: number;
  productId: number;
  stock: number;
};

export type ProductWarehouseQuery = {
  page?: number;
  limit?: number;
  filter?: number | string;
  sortBy?: string;
  orderBy?: string;
};

export type ProductWarehouseResponse = Prisma.ProductWarehouseGetPayload<{
  include: {
    warehouse: {
      select: {
        id: true;
        name: true;
        user: { select: { id: true; username: true } };
      };
    };
    product: { select: { id: true; name: true } };
  };
}>;

export type ProductWarehouseQueryRequired = {
  page: number;
  limit: number;
  filter: number | string;
  sortBy: string;
  orderBy: string;
};

export type ProductWarehouseUpdate = {
  stock: number;
};
