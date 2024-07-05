import { OptionLabel, UserOption } from '@/features/types';

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
  warehouse: OptionLabel & {
    user: UserOption | null;
  };
  product: OptionLabel & {
    price: number;
  };
};
