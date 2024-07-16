import {
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import {
  ProductBody,
  ProductResponse,
  ProductUpdate,
  UploadImageResponse,
  UploadPictures,
} from './types';

export const createProduct = async (data: ProductBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>('/products', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return res.data;
};

export const getProducts = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<ProductResponse[]>>(
    '/products',
    { params },
  );

  return res.data;
};

export const deleteProduct = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(`/products/${id}`);

  return res.data;
};

export const getProduct = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<ProductResponse>>(
    `/products/${id}`,
  );

  return res.data;
};

export const updateProduct = async ({ id, ...data }: ProductUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `/products/${id}`,
    data,
  );

  return res.data;
};

export const deleteProductImage = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(
    `/products/upload/${id}`,
  );

  return res.data;
};

export const uploadProductImage = async ({ id, formData }: UploadPictures) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithData<UploadImageResponse[]>>(
    `/products/upload/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return res.data;
};
