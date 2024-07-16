import { useQuery } from '@tanstack/react-query';
import { checkStock, getCountProductCart, getProductCart } from './cartFecther';

export const useGetCountProductCart = (token: string) => {
  return useQuery({
    queryKey: ['badge-cart', token],
    queryFn: () => getCountProductCart(token!),
    enabled: !!token,
  });
};

export const useGetProductCart = (token: string) => {
  return useQuery({
    queryKey: ['cart', token],
    queryFn: () => getProductCart(token!),
    enabled: !!token,
  });
};
