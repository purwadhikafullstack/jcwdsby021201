export type InventoryBody = {
  warehouseId: number;
  productId: number;
  stock: number;
};

export type InventoryQuery = {
  page?: number;
  limit?: number;
  filter?: number | string;
  sortBy?: string;
  orderBy?: string;
};
