import { ResponseWithData, ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import { AddressBody, CreateAddress, UpdateAddress } from './type';
import { Token } from '@mui/icons-material';
import { AddressRequest } from './type';
export const getAddressById = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData<AddressBody[]>>(
    '/addresses',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data.result;
};

export const getAddressByAddressId = async (
  token: string,
  addressId: string,
) => {
  const res = await axiosInstance.get<ResponseWithData<AddressBody>>(
    `/addresses/${addressId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.result;
};

export const deleteAddress = async ({ token, addressId }: AddressRequest) => {
  const res = await axiosInstance.delete<ResponseWithoutData>(
    `/addresses/${addressId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const updateAddress = async ({
  token,
  addressId,
  data,
}: UpdateAddress) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `/addresses/${addressId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const addAddress = async ({ token, addressData }: CreateAddress) => {
  const res = await axiosInstance.post<ResponseWithoutData>(
    `/addresses`,
    addressData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};
