import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getProduct,
  getProducts,
} from '@/features/admin/products/productsFetchers';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useGetProducts = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'products',
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

      let newFilter: string | number = globalFilter;
      if (globalFilter !== '') {
        !isNaN(Number(globalFilter)) && (newFilter = Number(newFilter));
      }

      const res = await getProducts({
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

export const useGetProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      return await getProduct(id);
    },
  });
};
