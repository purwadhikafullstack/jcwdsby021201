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
