import { useQuery } from '@tanstack/react-query';
import { getAddressByAddressId, getAddressById } from './addressFetchers';

export const useGetAddressById = (token: string) => {
  return useQuery({
    queryKey: ['addressList', token],
    queryFn: () => getAddressById(token!),
    enabled: !!token,
  });
};

export const useGetAddressByAddressId = (token: string, addressId: string) => {
  return useQuery({
    queryKey: ['address', addressId, token], // Menggunakan addressId dan token sebagai queryKey
    queryFn: () => getAddressByAddressId(token, addressId),
    enabled: !!token && !!addressId, // Memastikan token dan addressId tersedia
  });
};
