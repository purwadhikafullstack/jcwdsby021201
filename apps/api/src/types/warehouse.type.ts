export type WarehouseBody = {
  name: string;
  address: string;
  provinceId: number;
  cityId: number;
  postalCode: string;
  latitude: number;
  longitude: number;
};

export type WarehouseQuery = {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  orderBy?: string;
};
