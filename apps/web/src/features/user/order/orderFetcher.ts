import {
  ResponseDataPagination,
  ResponseWithData,
  ResponseWithoutData,
} from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import {
  CancelOrder,
  CheckMutateOtomaticOrder,
  UserResponse,
  DetailOrder,
  OrderDataBody,
  OrderDetailResponseWrapper,
  QueryPagination,
  ReceiveOrder,
  ShippingCostParams,
  UploadPaymentProof,
  WarehouseNearestParams,
} from './type';

export const uploadPaymmentProof = async ({
  token,
  data,
  orderId,
}: UploadPaymentProof) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `/orders/payment-proof/${orderId}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const cancelOrder = async ({ token, orderId }: CancelOrder) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `/orders/cancel-order/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const fetchShippingCost = async (params: ShippingCostParams) => {
  const res = await axiosInstance.post<ResponseWithData>('/checkouts', params);
  return res.data.result[0].value;
};

export const fetchWarehouseNearest = async ({
  latitude,
  longitude,
}: WarehouseNearestParams) => {
  const res = await axiosInstance.post<ResponseWithData>(
    '/warehouses/nearest',
    {
      latitude,
      longitude,
    },
  );
  return res.data.result;
};

export const checkAndMutateStock = async ({
  warehouseId,
  products,
  latitude,
  longitude,
}: CheckMutateOtomaticOrder) => {
  const res = await axiosInstance.post('/orders/check-mutate', {
    warehouseId,
    products: products.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
    latitude,
    longitude,
  });
  return res.data.result.response;
};

export const createOrder = async ({ token, orderData }: OrderDataBody) => {
  const res = await axiosInstance.post('/orders', orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const receiveOrder = async ({ token, orderId }: ReceiveOrder) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `/orders//receive-order/${orderId}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getUnpaidOrder = async ({
  token,
  params,
}: {
  token: string;
  params: QueryPagination;
}) => {
  const res = await axiosInstance.get<ResponseDataPagination<UserResponse[]>>(
    '/orders/to-pay',
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getToShipOrder = async ({
  token,
  params,
}: {
  token: string;
  params: QueryPagination;
}) => {
  const res = await axiosInstance.get<ResponseDataPagination<UserResponse[]>>(
    '/orders/to-ship',
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getToReceiveOrder = async ({
  token,
  params,
}: {
  token: string;
  params: QueryPagination;
}) => {
  const res = await axiosInstance.get<ResponseDataPagination<UserResponse[]>>(
    '/orders/to-receive',
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getToCancelOrder = async ({
  token,
  params,
}: {
  token: string;
  params: QueryPagination;
}) => {
  const res = await axiosInstance.get<ResponseDataPagination<UserResponse[]>>(
    '/orders/cancelled',
    {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data;
};

export const getDetailOrder = async ({ token, orderId }: DetailOrder) => {
  const res = await axiosInstance.get<OrderDetailResponseWrapper>(
    `orders/detail/${orderId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return res.data.result;
};
