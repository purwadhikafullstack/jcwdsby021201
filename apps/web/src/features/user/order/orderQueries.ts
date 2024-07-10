import {
  getDetailOrder,
  getToReceiveOrder,
  getToShipOrder,
  getUnpaidOrder,
} from './orderFetcher';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useGetUnpaidOrder = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
  token: string,
) => {
  return useQuery({
    queryKey: [
      'to-pay',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      token,
    ],
    queryFn: async () => {
      let sortBy = 'name';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'name';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = await getUnpaidOrder({
        token,
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          filter: globalFilter ?? '',
          sortBy,
          orderBy,
        },
      });

      return res;
    },
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
};

export const useGetToShipOrder = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
  token: string,
) => {
  return useQuery({
    queryKey: [
      'to-ship',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      token,
    ],
    queryFn: async () => {
      let sortBy = 'name';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'name';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = await getToShipOrder({
        token,
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          filter: globalFilter ?? '',
          sortBy,
          orderBy,
        },
      });

      return res;
    },
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
};

export const useGetToReceiveOrder = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
  token: string,
) => {
  return useQuery({
    queryKey: [
      'to-ship',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      token,
    ],
    queryFn: async () => {
      let sortBy = 'name';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'name';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = await getToReceiveOrder({
        token,
        params: {
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
          filter: globalFilter ?? '',
          sortBy,
          orderBy,
        },
      });

      return res;
    },
    placeholderData: keepPreviousData,
    enabled: !!token,
  });
};

export const useGetDetailOrder = (token: string, orderId: string) => {
  return useQuery({
    queryKey: ['order-detail', orderId, token],
    queryFn: () => getDetailOrder({ token, orderId }),
    enabled: !!token && !!orderId,
  });
};
