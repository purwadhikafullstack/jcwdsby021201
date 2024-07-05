import { CheckoutController } from '@/controllers/checkout.controller';
import { OrderController } from '@/controllers/order.controller';
import { userGuard, verifyToken } from '@/middlewares/auth.middleware';
import { uploader } from '@/middlewares/uploader.middleware';
import { Router } from 'express';

export class OrderRouter {
  private router: Router;
  private orderController: OrderController;

  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      userGuard,
      this.orderController.handleCheckout,
    );

    this.router.post('/check-mutate', this.orderController.checkAndMutateStock);
    //BARU
    this.router.get(
      '/to-pay',
      verifyToken,
      userGuard,
      this.orderController.getToPayOrder,
    );

    this.router.get(
      '/to-ship',
      verifyToken,
      userGuard,
      this.orderController.getToShipOrder,
    );

    this.router.get(
      '/to-receive',
      verifyToken,
      userGuard,
      this.orderController.getToReceive,
    );

    this.router.patch(
      '/cancel-order/:orderId',
      verifyToken,
      userGuard,
      this.orderController.cancelOrder,
    );

    this.router.patch(
      '/payment-proof/:orderId',
      verifyToken,
      userGuard,
      uploader('/payment', 'PAYMENT').single('image'),
      this.orderController.uploadPaymentProof,
    );

    this.router.patch(
      '/receive-order/:orderId',
      verifyToken,
      userGuard,
      this.orderController.receivedOrder,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
