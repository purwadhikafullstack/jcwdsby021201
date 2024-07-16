import { LocationRepository } from '@/repositories/location.repository';
import { LocationQuery } from '@/types/location.type';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { LocationValidation } from '@/validators/location.validation';
import { Validation } from '@/validators/validation';

export class LocationService {
  static async getProvinces(query: LocationQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    if (query && Object.keys(query).length !== 0) {
      const queryPage = page || 1;
      const queryLimit = limit || 10;
      const queryFilter = filter || '';
      const querySortBy = sortBy || 'name';
      const queryOrderBy = orderBy || 'asc';

      const response = await LocationRepository.getProvinces({
        page: queryPage,
        limit: queryLimit,
        filter: queryFilter,
        sortBy: querySortBy,
        orderBy: queryOrderBy,
      });

      if (!response.length) {
        return responseWithoutData(404, false, 'Province Not Found');
      }

      const total = await LocationRepository.countProvinces(queryFilter);
      return responseDataWithPagination(
        200,
        'Success Get Province Data',
        response,
        { page: queryPage, limit: queryLimit, total },
      );
    }

    const response = await LocationRepository.getProvinces();
    return responseWithData(200, 'Success Get Province Data', response);
  }
  static async getCitiesByProvince(provinceId: number) {
    const newProvinceId = Validation.validate(
      LocationValidation.ONLY_PROVINCE_ID,
      Number(provinceId),
    );
    const response = await LocationRepository.getCities(newProvinceId);
    return responseWithData(200, 'Success Get Cities Data', response);
  }

  static async getProvinceForProfile(provinceId: number) {
    const newProvinceId = Validation.validate(
      LocationValidation.ONLY_PROVINCE_ID,
      Number(provinceId),
    );
    const response =
      await LocationRepository.getProvinceForProfile(newProvinceId);
    return responseWithData(200, 'Success Get Province Data', response);
  }

  static async getCityForProfile(cityId: number) {
    const newCityId = Validation.validate(
      LocationValidation.ONLY_CITY_ID,
      Number(cityId),
    );
    const response = await LocationRepository.getCityForProfile(newCityId);
    return responseWithData(200, 'Success Get Cities Data', response);
  }

  static async getCitiesPagination(provinceId: string, query: LocationQuery) {
    const newProvinceId = Validation.validate(Validation.INT_ID, provinceId);
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const checkProvince = await LocationRepository.getProvinceForProfile(
      Number(newProvinceId),
    );

    if (!checkProvince) {
      return responseWithoutData(404, false, 'Province Not Found');
    }

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'name';
    const queryOrderBy = orderBy || 'asc';

    const response = await LocationRepository.getCities(Number(newProvinceId), {
      page: queryPage,
      limit: queryLimit,
      filter: queryFilter,
      sortBy: querySortBy,
      orderBy: queryOrderBy,
    });

    if (!response.length) {
      return responseWithoutData(404, false, 'City Not Found');
    }

    const total = await LocationRepository.countCities(
      Number(newProvinceId),
      queryFilter,
    );
    return responseDataWithPagination(200, 'Success Get City Data', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }
}
