import { ResetPasswordBody } from '@/features/auth/resetPassword/types';
import { ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { apiRoutes } from '@/utils/routes';

export const resetPassword = async (data: ResetPasswordBody) => {
  const res = await axiosInstance.post<ResponseWithoutData>(
    apiRoutes.resetPassword.path,
    data,
  );

  return res.data;
};
