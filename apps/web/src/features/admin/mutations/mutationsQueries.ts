import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getMutation,
  getMutationHistory,
  getMutationHistoryById,
  getMutations,
} from '@/features/admin/mutations/mutationsFetchers';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useGetMutations = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'mutations',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let sortBy = 'id';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'id';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      let newFilter: string | number = globalFilter;
      if (globalFilter !== '') {
        !isNaN(Number(globalFilter)) && (newFilter = Number(newFilter));
      }

      const res = await getMutations({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: newFilter,
        sortBy,
        orderBy,
      });

      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetMutation = (id: string) => {
  return useQuery({
    queryKey: ['mutation', id],
    queryFn: async () => {
      return await getMutation(id);
    },
  });
};

export const useGetMutationHistory = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'mutation-history',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let sortBy = 'createdAt';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'createdAt';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      let newFilter: string | number = globalFilter;
      if (globalFilter !== '') {
        !isNaN(Number(globalFilter)) && (newFilter = Number(newFilter));
      }

      const res = await getMutationHistory({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: newFilter,
        sortBy,
        orderBy,
      });

      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetMutationHistoryById = (
  id: string,
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'mutation-history',
      id,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let sortBy = 'createdAt';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'createdAt';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      let newFilter: string | number = globalFilter;
      if (globalFilter !== '') {
        !isNaN(Number(globalFilter)) && (newFilter = Number(newFilter));
      }

      const res = await getMutationHistoryById(id, {
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: newFilter,
        sortBy,
        orderBy,
      });

      return res;
    },
    placeholderData: keepPreviousData,
  });
};
