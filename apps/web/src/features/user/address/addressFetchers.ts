import { ResponseWithData, ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { AddressBody, CreateAddress, UpdateAddress } from './type';
import { AddressRequest } from './type';
import { apiRoutes } from '@/utils/routes';

export const getAddressById = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData<AddressBody[]>>(
    apiRoutes.addresses.path,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data.result;
};

export const getAddressByAddressId = async (
  token: string,
  addressId: string,
) => {
  const res = await axiosInstance.get<ResponseWithData<AddressBody>>(
    `${apiRoutes.addresses.path}/${addressId}`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return res.data.result;
};

export const deleteAddress = async ({ token, addressId }: AddressRequest) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.addresses.path}/deactivate/${addressId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

export const updateAddress = async ({
  token,
  addressId,
  data,
}: UpdateAddress) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.addresses.path}/edit/${addressId}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

export const addAddress = async ({ token, addressData }: CreateAddress) => {
  const res = await axiosInstance.post<ResponseWithoutData>(
    apiRoutes.addresses.path,
    addressData,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};
