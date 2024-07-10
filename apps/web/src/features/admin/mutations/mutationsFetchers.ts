import {
  HistoryResponse,
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import { createAxiosInstance } from '@/utils/axiosInstance';
import { MutationApprove, MutationBody, MutationResponse } from './types';

export const createMutation = async (data: MutationBody) => {
  const instance = await createAxiosInstance();
  const res = await instance.post<ResponseWithoutData>('/mutations', data);

  return res.data;
};

export const getMutations = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<MutationResponse[]>>(
    '/mutations',
    { params },
  );

  return res.data;
};

export const getMutation = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseWithData<MutationResponse>>(
    `/mutations/${id}`,
  );

  return res.data;
};

export const updateMutationToCancel = async (id: string) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `/mutations/to-cancel/${id}`,
  );

  return res.data;
};

export const updateMutationToApprove = async ({
  id,
  ...data
}: MutationApprove) => {
  const instance = await createAxiosInstance();
  const res = await instance.patch<ResponseWithoutData>(
    `/mutations/to-approve/${id}`,
    data,
  );

  return res.data;
};

export const getMutationHistory = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<HistoryResponse[]>>(
    '/mutations/history',
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
    `/mutations/history/${id}`,
    { params },
  );

  return res.data;
};
