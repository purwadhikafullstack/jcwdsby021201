export type OrderQuery = {
  page?: number;
  limit?: number;
  filter?: string;
  sortBy?: string;
  orderBy?: string;
};

export type CheckoutBody = {
  name: string;
  paymentStatus: PaymentStatus;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  warehouseId: number;
  cartId: number;
  addressId: number;
  orderProducts: OrderProductBody[];
  latitude: number;
  longitude: number;
};
export enum PaymentStatus {
  UNPAID = 'UNPAID',
  PAID = 'PAID',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELED = 'CANCELED',
}

export type OrderProductBody = {
  productId: number;
  quantity: number;
  price: number;
  total: number;
};

export type CancellationSource = CancellationStatus;

export enum CancellationStatus {
  USER = 'USER',
  SYSTEM = 'SYSTEM',
}
