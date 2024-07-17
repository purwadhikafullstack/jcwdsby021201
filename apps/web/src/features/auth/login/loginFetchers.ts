import { ResponseWithData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { apiRoutes } from '@/utils/routes';
import {
  LoginBody,
  LoginResponse,
  OAuthBody,
} from '@/features/auth/login/types';
import { signIn } from 'next-auth/react';

export const loginTransport = async (data: LoginBody) => {
  const res = await axiosInstance.post<ResponseWithData<LoginResponse>>(
    apiRoutes.login.path,
    data,
  );

  if (res.data.success) {
    await signIn('credentials', res.data.result);
  }

  return res.data;
};

export const oauth = async (data: OAuthBody) => {
  const res = await axiosInstance.post<ResponseWithData<LoginResponse>>(
    apiRoutes.oauth.path,
    data,
  );

  return res.data;
};
