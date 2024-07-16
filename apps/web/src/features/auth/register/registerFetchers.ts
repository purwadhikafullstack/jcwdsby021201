import { RegisterBody } from '@/features/auth/register/types';
import { ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { apiRoutes } from '@/utils/routes';

export const register = async (data: RegisterBody) => {
  const res = await axiosInstance.post<ResponseWithoutData>(
    apiRoutes.register.path,
    data,
  );

  return res.data;
};
