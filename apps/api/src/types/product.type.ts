import { Prisma } from '@prisma/client';

export type ProductBody = {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
};

export type ProductForm = {
  name: string;
  price: string;
  description: string;
  categoryId: string;
};

export type ProductQuery = {
  page?: number;
  limit?: number;
  filter?: string | number;
  sortBy?: string;
  orderBy?: string;
};

export type ProductResponse = Prisma.ProductGetPayload<{
  include: {
    category: { select: { id: true; name: true } };
    pictures: { select: { id: true; name: true; url: true } };
  };
}>;

export type ProductDeleteInventory = {
  id: number;
  name: string;
  price: number;
};
