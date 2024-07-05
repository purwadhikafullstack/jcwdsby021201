export type PaymentProofBody = {
  paymentProof: string;
};

export type UploadPaymentProof = {
  token: string;
  orderId: number;
  data: any;
};

export type CancelOrder = {
  token: string;
  orderId: string;
};

export type ReceiveOrder = {
  token: string;
  orderId: string;
};

export type ShippingCostParams = {
  courier: string;
  destination: string;
  origin: string;
  weight: number;
};

export type WarehouseNearestParams = {
  latitude: number;
  longitude: number;
};

export type Products = {
  productId: number;
  quantity: number;
};

export type CheckMutateOtomaticOrder = {
  products: Products[];
  warehouseId: string;
};

export type OrderProduct = {
  quantity: number;
  price: number;
  total: number;
  productId: number;
};

export type OrderData = {
  name: string;
  paymentStatus: string;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  warehouseId: string;
  cartId: number;
  addressId: number;
  courier: string;
  latitude: number;
  longitude: number;
  orderProducts: OrderProduct[];
};

export type OrderDataBody = {
  token: string;
  orderData: OrderData;
};

export type OrderShippedRequest = {
  searchDate?: string;
  orderNumber?: string;
  token: string;
};

export type QueryPagination = {
  page?: number;
  limit?: number;
  filter?: string | number;
  sortBy?: string;
  orderBy?: string;
};

export type QueryPaginationWithToken = {
  token: string;
  params: QueryPagination;
};

export type CobaBody = {
  name: string;
};
export type CobaResponse = CobaBody & {
  id: number;
  paymentStatus: string;
  shippingCost: number;
  total: number;
  paymentMethod: string;
  paymentProof: null;
  expirePayment: string;
  warehouseId: number;
  cartId: number;
  addressId: number;
  createdAt: string;
  updatedAt: string;
  image?: string;
};
