import { OrderRepository } from '@/repositories/order.repository';
import { responseWithData } from '@/utils/response';
import { OrderValidation } from '@/validators/order.validation';
import { Validation } from '@/validators/validation';

export class OrderService {
  static async handleCheckout(id: number, body: any) {
    const newBody = Validation.validate(OrderValidation.CHECKOUT_BODY, body);
    const response = await OrderRepository.handleCheckout(id, newBody);
    return responseWithData(200, 'Order created successfully', response);
  }

  static async getOrderByUserId(id: number) {
    const response = await OrderRepository.getOrderByUserId(id);
    const simplifiedOrders = response.map((order) => ({
      id: order.id,
      name: order.name,
      total: order.total,
      paymentMethod: order.paymentMethod,
      expirePayment: order.expirePayment,
      orderProducts: order.orderProducts.map((op) => ({
        quantity: op.quantity,
        price: op.price,
        total: op.total,
        product: {
          id: op.product.id,
          name: op.product.name,
          picture: op.product.pictures[0]?.url || null,
        },
      })),
    }));
    return responseWithData(
      200,
      'Order created successfully',
      simplifiedOrders,
    );
  }

  static async uploadPaymentProof(
    id: number,
    orderId: number,
    file: Express.Multer.File,
  ) {
    //INI BELUM VALIDASI FILE DI BACKEND
    const response = await OrderRepository.uploadPaymentProof(
      id,
      orderId,
      file,
    );
    return responseWithData(200, 'Success upload payment Proofy', {
      paymentProof: response.paymentProof,
    });
  }

  static async checkAndMutateStock(
    warehouseId: number,
    products: Array<{ productId: number; quantity: number }>,
  ) {
    const response = await OrderRepository.checkAndMutateStock(
      warehouseId,
      products,
    );

    return responseWithData(200, 'Success check and mutate', {
      response,
    });
  }

  static async cancelOrder(id: number, orderId: number) {
    const response = await OrderRepository.cancelOrder(id, orderId);
    return responseWithData(200, 'Success cancel order', response);
  }

  static async getShippedOrder(id: number) {
    const response = await OrderRepository.getShippedOrder(id);
    const simplifiedOrders = response.map((order) => ({
      id: order.id,
      name: order.name,
      total: order.total,
      paymentMethod: order.paymentMethod,
      expirePayment: order.expirePayment,
      orderProducts: order.orderProducts.map((op) => ({
        quantity: op.quantity,
        price: op.price,
        total: op.total,
        product: {
          id: op.product.id,
          name: op.product.name,
          picture: op.product.pictures[0]?.url || null,
        },
      })),
    }));
    return responseWithData(
      200,
      'Success get Shipped Order',
      simplifiedOrders,
    );
  }

  static async receivedOrder(id: number, orderId: number){
    const response = await OrderRepository.receivedOrder(id,orderId);
    return responseWithData(200, 'Success received Order ', response);

  }
}
