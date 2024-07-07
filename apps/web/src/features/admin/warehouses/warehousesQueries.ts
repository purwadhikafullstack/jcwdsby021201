import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getUserWarehouse,
  getWarehouse,
  getWarehouses,
} from '@/features/admin/warehouses/warehousesFetchers';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useGetWarehouses = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
  enabled: boolean = true,
  excludeId?: number,
) => {
  return useQuery({
    queryKey: [
      'warehouses',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      excludeId,
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

      const res = await getWarehouses({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: newFilter,
        sortBy,
        orderBy,
        excludeId,
      });

      return res;
    },
    placeholderData: keepPreviousData,
    enabled,
  });
};

export const useGetWarehouse = (id: string) => {
  return useQuery({
    queryKey: ['warehouse', id],
    queryFn: async () => {
      return await getWarehouse(id);
    },
  });
};

export const useGetUserWarehouse = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['user-warehouse'],
    queryFn: async () => {
      return await getUserWarehouse();
    },
    enabled,
  });
};
