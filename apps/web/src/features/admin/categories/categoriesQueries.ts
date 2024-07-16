import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getCategories,
  getCategory,
} from '@/features/admin/categories/categoriesFetchers';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useGetCategories = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'categories',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: async () => {
      let sortBy = 'name';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'name';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = await getCategories({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        filter: globalFilter ?? '',
        sortBy,
        orderBy,
      });

      return res;
    },
    placeholderData: keepPreviousData,
  });
};

export const useGetCategory = (id: string) => {
  return useQuery({
    queryKey: ['category', id],
    queryFn: async () => {
      return await getCategory(id);
    },
  });
};
