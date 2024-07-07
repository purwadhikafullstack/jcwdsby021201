import { OptionLabel } from '@/features/types';

export type InventoryBody = {
  stock: number;
  productId: number;
  warehouseId: number;
};

export type InventoryResponse = InventoryBody & {
  id: number;
  deleted: boolean;
  createdAt: string;
  updatedAt: string;
  warehouse: OptionLabel;
  product: OptionLabel & {
    price: number;
  };
};

export type InventoryUpdate = {
  id: string;
  stock: number;
};
