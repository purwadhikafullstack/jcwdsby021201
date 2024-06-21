export type AddressBody = {
  name: string;
  address: string;
  province: string;
  city: string;
  postalCode: string;
  isPrimary: Boolean;
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
