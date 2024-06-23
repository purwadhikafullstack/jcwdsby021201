export type ProductBody = {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
};

export type ProductQuery = {
  page?: number;
  limit?: number;
  filter?: string | number;
  sortBy?: string;
  orderBy?: string;
};
