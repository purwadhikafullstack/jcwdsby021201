import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getMutation,
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
