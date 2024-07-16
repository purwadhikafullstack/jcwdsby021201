import { OptionLabel } from '@/features/types';

export type ProductBody = {
  name: string;
  price: number;
  description?: string;
  categoryId: number;
};

export type ProductUpdate = ProductBody & { id: number };

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

export type ProductResponse = ProductBody & {
  description: string | null;
  id: number;
  slug: string;
  createdAt: string;
  updatedAt: string;
  category: OptionLabel;
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
