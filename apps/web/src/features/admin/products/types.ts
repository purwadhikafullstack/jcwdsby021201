export type ProductBody = {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
};

export interface ProductUpdate extends ProductBody {
  id: number;
}

export type UploadPictures = {
  id: string;
  formData: FormData;
};

export type Pictures = {
  id: number;
  name: string;
  url?: string;
  preview?: string;
};

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
  pictures: Pictures[];
};

export type UploadImageResponse = {
  id: number;
  name: string;
  url: string;
  productId: number;
  createdAt: string;
  updatedAt: string;
};
