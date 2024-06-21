import { UserSession } from '@/features/types';
import axios from 'axios';
import { getSession } from 'next-auth/react';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
});

export default axiosInstance;

export const createAxiosInstance = async () => {
  const session = await getSession();
  const user = session?.user as UserSession;

  const instance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BASE_API_URL,
  });

  instance.interceptors.request.use(
    (config) => {
      if (user) config.headers.Authorization = `Bearer ${user?.token}`;
      return config;
    },
    (error) => Promise.reject(error),
  );

  return instance;
};
