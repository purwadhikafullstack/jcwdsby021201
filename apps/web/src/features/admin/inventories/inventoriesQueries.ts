import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getInventories,
  getInventory,
} from '@/features/admin/inventories/inventoriesFetchers';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useGetInventories = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'inventories',
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

      const res = await getInventories({
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

export const useGetInventory = (id: string) => {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: async () => {
      return await getInventory(id);
    },
  });
};
