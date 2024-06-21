import { ResponseWithData, ResponseWithoutData } from '@/features/types';
import axiosInstance, { createAxiosInstance } from '@/utils/axiosInstance';
import { SampleResponse } from './types';

export const getSamples = async () => {
  const instance = await createAxiosInstance();
  const res =
    await instance.get<ResponseWithData<SampleResponse[]>>('/samples');

  return res.data;
};

export const createSample = async (data: any) => {
  const res = await axiosInstance.post<ResponseWithoutData>('/samples', data);

  return res.data;
};
