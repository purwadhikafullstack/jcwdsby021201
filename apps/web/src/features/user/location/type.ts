export type LocationBody = {
  provinceId: string;
  name: string;
  cityId: string;
};

export type LocationName = {
  cityId: string;
  name: string;
  provinceId: string;
};

export type ProvinceResponse = {
  id: number;
  name: string;
};

export type CityResponse = ProvinceResponse & {
  provinceId: number;
};
