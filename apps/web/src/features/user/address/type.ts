export type AddressBody = {
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  isPrimary: Boolean;
  id?: number;
  latitude: number;
  longitude: number;
};

export type AddressRequest = {
  token: string;
  addressId: string;
};

export type CreateAddress = {
  token: string;
  addressData: AddressBody;
};

export type UpdateAddress = {
  token: string;
  data: AddressBody;
  addressId: string;
};
