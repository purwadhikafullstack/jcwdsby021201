import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getCities,
  getCitiesPagination,
  getCityName,
  getProvince,
  getProvinceName,
  getProvincesPagination,
} from './locationFetchers';
import { MRT_PaginationState, MRT_SortingState } from 'material-react-table';

export const useFetchProvince = () => {
  return useQuery({
    queryKey: ['province'],
    queryFn: () => getProvince(),
  });
};

export const useFetchCities = (provinceId: string) => {
  return useQuery({
    queryKey: ['city', provinceId],
    queryFn: () => getCities(provinceId!),
    enabled: !!provinceId,
  });
};

export const useGetProvinceName = (provinceId: string) => {
  return useQuery({
    queryKey: ['province-name', provinceId],
    queryFn: () => getProvinceName(provinceId!),
    enabled: !!provinceId,
  });
};

export const useGetCityName = (cityId: string) => {
  return useQuery({
    queryKey: ['province-name', cityId],
    queryFn: () => getCityName(cityId!),
    enabled: !!cityId,
  });
};

export const useGetProvincesPagination = (
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'provinces',
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () => {
      let sortBy = 'name';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'name';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = getProvincesPagination({
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

export const useGetCitiesPagination = (
  provinceId: string,
  globalFilter: string,
  pagination: MRT_PaginationState,
  sorting: MRT_SortingState,
) => {
  return useQuery({
    queryKey: [
      'cities',
      provinceId,
      globalFilter,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
    ],
    queryFn: () => {
      let sortBy = 'name';
      let orderBy = 'asc';

      sorting.forEach((s) => {
        s.id ? (sortBy = s.id) : 'name';
        s.desc ? (orderBy = 'desc') : 'asc';
      });

      const res = getCitiesPagination(provinceId, {
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
