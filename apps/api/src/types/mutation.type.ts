import { Prisma } from '@prisma/client';

export type MutationBody = {
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  productId: number;
  stockRequest: number;
  note?: string;
};

export type MutationQuery = {
  page?: number;
  limit?: number;
  filter?: number | string;
  sortBy?: string;
  orderBy?: string;
};

export type MutationQueryRequired = {
  page: number;
  limit: number;
  filter: number | string;
  sortBy: string;
  orderBy: string;
};

export type MutationUpdate = {
  stockProcess: number;
};

export type MutationResponse = Prisma.MutationGetPayload<{
  include: {
    sourceWarehouse: {
      select: {
        id: true;
        name: true;
        user: { select: { id: true; username: true } };
      };
    };
    destinationWarehouse: { select: { id: true; name: true } };
    product: { select: { id: true; name: true } };
  };
}>;
