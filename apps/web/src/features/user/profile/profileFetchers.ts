import { ResponseWithData, ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { PhotoBody, UpdateProfile, UpdateProfileBody } from './type';
import { apiRoutes } from '@/utils/routes';

export const getProfileById = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData<UpdateProfileBody>>(
    apiRoutes.users.path,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data.result;
};

export const changeProfileUpdate = async ({ token, data }: UpdateProfile) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.users.path}/change-profile`,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

export const changeProfileEmail = async ({ token, data }: UpdateProfile) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.users.path}/change-email`,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

export const changeProfilePicture = async ({ token, data }: PhotoBody) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.users.path}/change-image`,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
