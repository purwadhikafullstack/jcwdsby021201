import { OptionLabel } from '@/features/types';

export type MutationBody = {
  sourceWarehouseId: number;
  destinationWarehouseId: number;
  productId: number;
  stockRequest: number;
  note?: string;
};

export type MutationResponse = MutationBody & {
  note: string | null;
  id: number;
  stockProcess: number;
  status: 'PENDING' | 'CANCELED' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
  sourceWarehouse: OptionLabel;
  destinationWarehouse: OptionLabel;
  product: OptionLabel;
};

export type MutationApprove = {
  id: string;
  stockProcess: number;
};
