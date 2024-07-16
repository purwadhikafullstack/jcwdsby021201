import { OrderRepository } from '@/repositories/order.repository';
import {
  CancellationSource,
  CheckoutBody,
  OrderQuery,
} from '@/types/order.type';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { OrderValidation } from '@/validators/order.validation';
import { Validation } from '@/validators/validation';

export class OrderService {
  static async handleCheckout(id: number, body: CheckoutBody) {
    const newBody = Validation.validate(OrderValidation.CHECKOUT_BODY, body);
    const response = await OrderRepository.handleCheckout(id, newBody);
    return responseWithData(200, 'Order created successfully', response);
  }

  static async uploadPaymentProof(
    id: number,
    orderId: number,
    file: Express.Multer.File,
  ) {
    const validatedFiles = OrderValidation.fileValidation(file);
    const newOrderId = Validation.validate(
      OrderValidation.ONLY_ORDER_ID,
      Number(orderId),
    );
    const response = await OrderRepository.uploadPaymentProof(
      id,
      newOrderId,
      validatedFiles,
    );
    return responseWithData(200, 'Success upload payment Proofy', {
      paymentProof: response.paymentProof,
    });
  }

  static async checkAndMutateStock(
    warehouseId: number,
    products: Array<{ productId: number; quantity: number }>,
    latitude: number,
    longitude: number,
  ) {
    const newWarehouseId = Validation.validate(
      OrderValidation.ONLY_WAREHOUSE_ID,
      warehouseId,
    );
    const response = await OrderRepository.checkAndMutateStock(
      newWarehouseId,
      products,
      latitude,
      longitude,
    );

    return responseWithData(200, 'Success check and mutate', {
      response,
    });
  }

  static async cancelOrder(
    id: number,
    orderId: number,
    source: CancellationSource,
  ) {
    const newOrderId = Validation.validate(
      OrderValidation.ONLY_ORDER_ID,
      Number(orderId),
    );
    const response = await OrderRepository.cancelOrder(id, newOrderId, source);
    return responseWithData(200, 'Success cancel order', response);
  }

  static async receivedOrder(id: number, orderId: number) {
    const newOrderId = Validation.validate(
      OrderValidation.ONLY_ORDER_ID,
      Number(orderId),
    );
    const response = await OrderRepository.receivedOrder(id, newOrderId);
    return responseWithData(200, 'Success received Order ', response);
  }

  static async getToPayOrder(id: number, query: OrderQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'name';
    const queryOrderBy = orderBy || 'asc';

    const response = await OrderRepository.getToPayOrder(
      id,
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await OrderRepository.countToPayOrder(id, queryFilter);
    return responseDataWithPagination(200, 'Success Get Categories', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async getToShipOrder(id: number, query: OrderQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'name';
    const queryOrderBy = orderBy || 'asc';

    const response = await OrderRepository.getToShipOrder(
      id,
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await OrderRepository.countToShipOrder(id, queryFilter);
    return responseDataWithPagination(200, 'Success Get Categories', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async getToReceive(id: number, query: OrderQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'name';
    const queryOrderBy = orderBy || 'asc';

    const response = await OrderRepository.getToReceive(
      id,
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await OrderRepository.countToReceiveOrder(id, queryFilter);
    return responseDataWithPagination(200, 'Success Get Categories', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }
  static async getCancelOrder(id: number, query: OrderQuery) {
    const { filter, limit, page, sortBy, orderBy } = Validation.validate(
      Validation.QUERY,
      query,
    );

    const queryPage = page || 1;
    const queryLimit = limit || 10;
    const queryFilter = filter || '';
    const querySortBy = sortBy || 'name';
    const queryOrderBy = orderBy || 'asc';

    const response = await OrderRepository.getCancelOrder(
      id,
      queryPage,
      queryLimit,
      queryFilter,
      querySortBy,
      queryOrderBy,
    );

    if (!response.length) {
      return responseWithoutData(404, false, 'Data Not Found');
    }

    const total = await OrderRepository.countToCancelOrder(id, queryFilter);
    return responseDataWithPagination(200, 'Success Get Categories', response, {
      page: queryPage,
      limit: queryLimit,
      total,
    });
  }

  static async getOrderDetailByOrderId(id: number, orderId: number) {
    const newOrderId = Validation.validate(
      OrderValidation.ONLY_ORDER_ID,
      Number(orderId),
    );
    const response = await OrderRepository.getOrderDetailByOrderId(
      id,
      newOrderId,
    );
    if (response === null) {
      return responseWithoutData(404, false, 'Order not found');
    }
    const newResponse = {
      name: response.name,
      shippingCost: response.shippingCost,
      total: response.total,
      shippingAddress: response.address.address,
      username: response.cart.user.username,
      orderProducts: response.orderProducts.map((prod) => ({
        name: prod.product.name,
        price: prod.price,
        total: prod.total,
        quantity: prod.quantity,
        imageUrl: prod.product.pictures[0]?.url || null,
      })),
    };

    return responseWithData(200, 'Success Get Order Detail ', newResponse);
  }
}
