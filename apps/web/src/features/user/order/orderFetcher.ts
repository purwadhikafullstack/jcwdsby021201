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
import { apiRoutes } from '@/utils/routes';

export const uploadPaymmentProof = async ({
  token,
  data,
  orderId,
}: UploadPaymentProof) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.orders.path}/payment-proof/${orderId}`,
    data,
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

export const cancelOrder = async ({ token, orderId }: CancelOrder) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.orders.path}/cancel-order/${orderId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

  return res.data;
};

export const fetchShippingCost = async (params: ShippingCostParams) => {
  const res = await axiosInstance.post<ResponseWithData>(
    apiRoutes.checkouts.path,
    params,
  );
  return res.data.result[0].value;
};

export const fetchWarehouseNearest = async ({
  latitude,
  longitude,
}: WarehouseNearestParams) => {
  const res = await axiosInstance.post<ResponseWithData>(
    `${apiRoutes.warehouses.path}/nearest`,
    { latitude, longitude },
  );
  return res.data.result;
};

export const checkAndMutateStock = async ({
  warehouseId,
  products,
  latitude,
  longitude,
}: CheckMutateOtomaticOrder) => {
  const res = await axiosInstance.post(
    `${apiRoutes.orders.path}/check-mutate`,
    {
      warehouseId,
      products: products.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
      latitude,
      longitude,
    },
  );
  return res.data.result.response;
};

export const createOrder = async ({ token, orderData }: OrderDataBody) => {
  const res = await axiosInstance.post(`${apiRoutes.orders.path}`, orderData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const receiveOrder = async ({ token, orderId }: ReceiveOrder) => {
  const res = await axiosInstance.patch<ResponseWithoutData>(
    `${apiRoutes.orders.path}/receive-order/${orderId}`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
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
    `${apiRoutes.orders.path}/to-pay`,
    {
      params,
      headers: { Authorization: `Bearer ${token}` },
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
    `${apiRoutes.orders.path}/to-ship`,
    {
      params,
      headers: { Authorization: `Bearer ${token}` },
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
    `${apiRoutes.orders.path}/to-receive`,
    {
      params,
      headers: { Authorization: `Bearer ${token}` },
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
    `${apiRoutes.orders.path}/cancelled`,
    {
      params,
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data;
};

export const getDetailOrder = async ({ token, orderId }: DetailOrder) => {
  const res = await axiosInstance.get<OrderDetailResponseWrapper>(
    `${apiRoutes.orders.path}/detail/${orderId}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    },
  );

  return res.data.result;
};
