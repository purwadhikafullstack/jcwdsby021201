import { CartController } from '@/controllers/cart.controller';
import { userGuard, verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class CartRouter {
  private router: Router;
  private cartController: CartController;

  constructor() {
    this.cartController = new CartController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      userGuard,
      this.cartController.addProductToCart,
    );

    this.router.get(
      '/counter',
      verifyToken,
      userGuard,
      this.cartController.getCartCount,
    );

    this.router.get(
      '/',
      verifyToken,
      userGuard,
      this.cartController.getProductCart,
    );
    
    this.router.delete(
      '/:productId',
      verifyToken,
      userGuard,
      this.cartController.deleteProductCart,
    );

    this.router.patch(
      '/',
      verifyToken,
      userGuard,
      this.cartController.updateQuantity,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
