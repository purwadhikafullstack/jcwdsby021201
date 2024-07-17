import {
  QueryPagination,
  ResponseDataPagination,
  ResponseWithData,
} from '@/features/types';
import axiosInstance, { createAxiosInstance } from '@/utils/axiosInstance';
import {
  CityResponse,
  LocationBody,
  LocationName,
  ProvinceResponse,
} from './type';
import { apiRoutes } from '@/utils/routes';

export const getProvince = async () => {
  const res = await axiosInstance.get<ResponseWithData<LocationBody[]>>(
    `${apiRoutes.locations.path}/province`,
  );
  return res.data.result;
};

export const getCities = async (provinceId: number) => {
  const res = await axiosInstance.get<ResponseWithData<LocationBody[]>>(
    `${apiRoutes.locations.path}/${provinceId}`,
  );
  return res.data.result;
};

export const getProvinceName = async (provinceId: number) => {
  const res = await axiosInstance.get<ResponseWithData<LocationName[]>>(
    `${apiRoutes.locations.path}/province/${provinceId}`,
  );
  return res.data.result[0];
};

export const getCityName = async (cityId: number) => {
  const res = await axiosInstance.get<ResponseWithData<LocationName[]>>(
    `${apiRoutes.locations.path}/city/${cityId}`,
  );
  return res.data.result;
};

export const getProvincesPagination = async (params: QueryPagination) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<ProvinceResponse[]>>(
    `${apiRoutes.locations.path}/province`,
    { params },
  );

  return res.data;
};

export const getCitiesPagination = async (
  provinceId: string,
  params: QueryPagination,
) => {
  const instance = await createAxiosInstance();
  const res = await instance.get<ResponseDataPagination<CityResponse[]>>(
    `${apiRoutes.locations.path}/cities/${provinceId}`,
    { params },
  );

  return res.data;
};
