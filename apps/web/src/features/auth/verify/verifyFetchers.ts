import { VerifyTokenBody } from '@/features/auth/verify/types';
import { ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { apiRoutes } from '@/utils/routes';

export const verifyToken = async (data: VerifyTokenBody) => {
  const res = await axiosInstance.post<ResponseWithoutData>(
    apiRoutes.verify.path,
    data,
  );

  return res.data;
};
