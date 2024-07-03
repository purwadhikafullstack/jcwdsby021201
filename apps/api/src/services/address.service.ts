import { AddressRepository } from '@/repositories/address.repository';
import { AddressBody } from '@/types/address.type';
import { responseWithData, responseWithoutData } from '@/utils/response';
import { AddressValidation } from '@/validators/address.validation';
import { Validation } from '@/validators/validation';

export class AddressService {
  static async getAddressById(id: number) {
    const response = await AddressRepository.getAddressById(id);
    return responseWithData(200, 'Get user address successfully', response);
  }

  static async getAddressByAddressId(id: number, addressId: number) {
    const newAddressId = Validation.validate(
      AddressValidation.ONLY_ADDRESS_ID,
      Number(addressId),
    );
    const response = await AddressRepository.getAddressByAddressId(
      id,
      newAddressId,
    );
    return responseWithData(200, 'Success get Address', {
      name: response?.name,
      address: response?.address,
      provinceId: response?.provinceId,
      cityId: response?.cityId,
      postalCode: response?.postalCode,
      isPrimary: response?.isPrimary,
      latitude: response?.latitude,
      longitude: response?.longitude,
    });
  }

  static async deleteAddressByAddressId(id: number, addressId: number) {
    const newAddressId = Validation.validate(
      AddressValidation.ONLY_ADDRESS_ID,
      Number(addressId),
    );
    const response = await AddressRepository.deleteAddressByAddressId(
      id,
      newAddressId,
    );
    return responseWithoutData(201, true, 'Success delete Address');
  }

  static async addAddress(id: number, body: AddressBody) {
    const newBody = Validation.validate(AddressValidation.CREATE, body);
    const response = await AddressRepository.addAddress(id, newBody);

    const successMessage = response.isPrimary
      ? 'Success create primary Address'
      : 'Success create Address';
    return responseWithoutData(201, true, successMessage);
  }

  static async updateAddress(id: number, addressId: number, body: AddressBody) {
    const newBody = Validation.validate(AddressValidation.UPDATE, body);
    const response = await AddressRepository.updateAddress(
      id,
      addressId,
      newBody,
    );
    return responseWithData(200, 'Success get Address', {
      name: response?.name,
      address: response?.address,
      provinceId: response?.provinceId,
      cityId: response?.cityId,
      postalCode: response?.postalCode,
      isPrimary: response?.isPrimary,
      latitude: response.latitude,
      longitude: response.longitude,
    });
  }
}
