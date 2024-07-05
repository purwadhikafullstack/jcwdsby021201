import { Prisma } from '@prisma/client';

export type ProductWarehouseResponse = Prisma.ProductWarehouseGetPayload<{}>;

export type ProductWarehouseQueryRequired = {
  page: number;
  limit: number;
  filter: number | string;
  sortBy: string;
  orderBy: string;
};
