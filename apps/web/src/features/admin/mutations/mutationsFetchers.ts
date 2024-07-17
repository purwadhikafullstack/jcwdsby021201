import {
  HistoryResponse,
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { MutationApprove, MutationBody, MutationResponse } from './types';
import { apiRoutes } from '@/utils/routes';

export const createMutation = async (data: MutationBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>(
    apiRoutes.mutations.path,
    data,
  );

  return res.data;
};

export const getMutations = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<MutationResponse[]>>(
    apiRoutes.mutations.path,
    { params },
  );

  return res.data;
};

export const getMutation = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<MutationResponse>>(
    `${apiRoutes.mutations.path}/${id}`,
  );

  return res.data;
};

export const updateMutationToCancel = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `${apiRoutes.mutations.path}/to-cancel/${id}`,
  );

  return res.data;
};

export const updateMutationToApprove = async ({
  id,
  ...data
}: MutationApprove) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `${apiRoutes.mutations.path}/to-approve/${id}`,
    data,
  );

  return res.data;
};

export const getMutationHistory = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<HistoryResponse[]>>(
    `${apiRoutes.mutations.path}/history`,
    { params },
  );

  return res.data;
};

export const getMutationHistoryById = async (
  id: string,
  params: QueryPagination,
) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<HistoryResponse[]>>(
    `${apiRoutes.mutations.path}/history/${id}`,
    { params },
  );

  return res.data;
};
