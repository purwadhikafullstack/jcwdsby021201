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
import { apiRoutes } from '@/utils/routes';

export const createProduct = async (data: ProductBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>(
    apiRoutes.products.path,
    data,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return res.data;
};

export const getProducts = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<ProductResponse[]>>(
    apiRoutes.products.path,
    { params },
  );

  return res.data;
};

export const deleteProduct = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(
    `${apiRoutes.products.path}/${id}`,
  );

  return res.data;
};

export const getProduct = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<ProductResponse>>(
    `${apiRoutes.products.path}/${id}`,
  );

  return res.data;
};

export const updateProduct = async ({ id, ...data }: ProductUpdate) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `${apiRoutes.products.path}/${id}`,
    data,
  );

  return res.data;
};

export const deleteProductImage = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.delete<ResponseWithoutData>(
    `${apiRoutes.products.path}/upload/${id}`,
  );

  return res.data;
};

export const uploadProductImage = async ({ id, formData }: UploadPictures) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithData<UploadImageResponse[]>>(
    `${apiRoutes.products.path}/upload/${id}`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );

  return res.data;
};
