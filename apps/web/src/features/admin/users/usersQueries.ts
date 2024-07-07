import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getUser,
  getUsers,
  getWarehouseAdmins,
} from '@/features/admin/users/usersFetchers';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useGetWarehouseAdmins = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'admins',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let sortBy = 'username';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'username';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = await getWarehouseAdmins({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: globalFilter,
        sortBy,
        orderBy,
      });

      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetUsers = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'users',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let sortBy = 'email';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'email';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = await getUsers({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: globalFilter,
        sortBy,
        orderBy,
      });

      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetUser = (id: string) => {
  return useQuery({
    queryKey: ['user', id],
    queryFn: async () => {
      return await getUser(id);
    },
  });
};
