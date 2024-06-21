import { LocationRepository } from '@/repositories/location.repository';
import { responseWithData } from '@/utils/response';
import { LOcationValidation } from '@/validators/locationvalidation';
import { Validation } from '@/validators/validation';

export class LocationService {
  static async getProvinces() {
    const response = await LocationRepository.getProvinces();
    return responseWithData(200, 'Success Get Province Data', response);
  }
  static async getCitiesByProvince(provinceId: number) {
    const newProvinceId = Validation.validate(
      LOcationValidation.ONLY_PROVINCE_ID,
      Number(provinceId),
    );
    const response = await LocationRepository.getCities(newProvinceId);
    return responseWithData(200, 'Success Get Cities Data', response);
  }

  static async getProvinceForProfile(provinceId: number) {
    const newProvinceId = Validation.validate(
      LOcationValidation.ONLY_PROVINCE_ID,
      Number(provinceId),
    );
    const response =
      await LocationRepository.getProvinceForProfile(newProvinceId);
    return responseWithData(200, 'Success Get Province Data', response);
  }

  static async getCityForProfile(cityId: number) {
    const newCityId = Validation.validate(
      LOcationValidation.ONLY_CITY_ID,
      Number(cityId),
    );
    const response = await LocationRepository.getCityForProfile(newCityId);
    return responseWithData(200, 'Success Get Cities Data', response);
  }
}
