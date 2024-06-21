import { useQuery } from '@tanstack/react-query';
import { getCities, getCityName, getProvince, getProvinceName } from './locationFetchers';


export const useFetchProvince = () => {
  return useQuery({
    queryKey: ['province'],
    queryFn: () => getProvince(),
  });
};

export const useFetchCities = (provinceId: string) =>{
  return useQuery({
    queryKey: ['city', provinceId],
    queryFn: () => getCities(provinceId!),
    enabled: !!provinceId,
  });
}

export const useGetProvinceName = (provinceId: string) =>{
  return useQuery({
    queryKey: ['province-name', provinceId],
    queryFn: () => getProvinceName(provinceId!),
    enabled: !!provinceId,
  });
}

export const useGetCityName = (cityId: string) =>{
  return useQuery({
    queryKey: ['province-name', cityId],
    queryFn: () => getCityName(cityId!),
    enabled: !!cityId,
  });
}
