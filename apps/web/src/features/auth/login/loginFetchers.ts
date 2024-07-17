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
  const res = await signIn('credentials', data);
  if (res?.error) {
    return { rc: 400, success: false, message: res.error };
  }

  // return res;
  // const res = await axios.post(internalApiRoutes.login.path, data);
  // if (res.data.rc === 400) {
  //   return res.data;
  // }
  return { rc: 200, success: true, message: 'Login Success' };
};

export const login = async (data: LoginBody) => {
  const res = await axiosInstance.post<ResponseWithData<LoginResponse>>(
    apiRoutes.login.path,
    data,
  );

  return res.data;
};

export const oauth = async (data: OAuthBody) => {
  const res = await axiosInstance.post<ResponseWithData<LoginResponse>>(
    apiRoutes.oauth.path,
    data,
  );

  return res.data;
};
