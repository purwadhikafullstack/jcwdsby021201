export type ProductBody = {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
};

export interface ProductUpdate extends ProductBody {
  id: number;
}

export type ProductResponse = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  price: number;
  categoryId: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: number;
    name: string;
  };
};
