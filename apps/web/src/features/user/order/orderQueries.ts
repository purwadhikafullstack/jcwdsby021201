import { useQuery } from '@tanstack/react-query';
import { getOrders, getShippedOrders } from './orderFetcher';

export const useGetOrders = (token: string) => {
  return useQuery({
    queryKey: ['list-orders', token],
    queryFn: () => getOrders(token!),
    enabled: !!token,
  });
};

export const useGetShippedOrders = (token: string) => {
  return useQuery({
    queryKey: ['list-orders-shipped', token],
    queryFn: () => getShippedOrders(token!),
    enabled: !!token,
  });
};
