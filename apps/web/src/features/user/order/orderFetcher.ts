import { ResponseWithData, ResponseWithoutData } from '@/features/types';
import axiosInstance from '@/utils/axiosInstance';
import {
  CancelOrder,
  CheckMutateOtomaticOrder,
  OrderDataBody,
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

export const getOrders = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData>('/orders', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.result;
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
  const res = await axiosInstance.post<ResponseWithData>('/warehouses/nearest', {
    latitude,
    longitude,
  });
  return res.data.result;
};

export const checkAndMutateStock = async ({
  warehouseId,
  products,
}: CheckMutateOtomaticOrder) => {
  const res = await axiosInstance.post('/orders/check-mutate', {
    warehouseId,
    products: products.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
    })),
  });
  return res.data.result.response;
};

export const createOrder = async ({ token, orderData }: OrderDataBody) => {
  const res = await axiosInstance.post('/orders', orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const getShippedOrders = async (token: string) => {
  const res = await axiosInstance.get<ResponseWithData>(
    '/orders/shipped-order',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return res.data.result;
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
