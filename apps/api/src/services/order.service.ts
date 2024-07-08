import { OrderRepository } from '@/repositories/order.repository';
import { OrderQuery } from '@/types/order.type';
import {
  responseDataWithPagination,
  responseWithData,
  responseWithoutData,
} from '@/utils/response';
import { OrderValidation } from '@/validators/order.validation';
import { Validation } from '@/validators/validation';

export class OrderService {
  static async handleCheckout(id: number, body: any) {
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

    const response = await OrderRepository.uploadPaymentProof(
      id,
      orderId,
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
    const response = await OrderRepository.checkAndMutateStock(
      warehouseId,
      products,
      latitude,
      longitude,
    );

    return responseWithData(200, 'Success check and mutate', {
      response,
    });
  }

  static async cancelOrder(id: number, orderId: number) {
    const response = await OrderRepository.cancelOrder(id, orderId);
    return responseWithData(200, 'Success cancel order', response);
  }

  static async receivedOrder(id: number, orderId: number) {
    const response = await OrderRepository.receivedOrder(id, orderId);
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
}
