import { ForgotPasswordBody } from '@/features/auth/forgotPassword/types';
import { ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { apiRoutes } from '@/utils/routes';

export const forgotPassword = async (data: ForgotPasswordBody) => {
  const res = await axiosInstance.post<ResponseWithoutData>(
    apiRoutes.forgotPassword.path,
    data,
  );

  return res.data;
};
