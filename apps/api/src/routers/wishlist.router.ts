import { LocationController } from '@/controllers/location.controller';
import { WishlistController } from '@/controllers/wishlist.controller';
import { userGuard, verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class WishlistRouter {
  private router: Router;
  private wishlistController: WishlistController;

  constructor() {
    this.wishlistController = new WishlistController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      userGuard,
      this.wishlistController.myWishlist,
    );

    this.router.get(
      '/count',
      verifyToken,
      userGuard,
      this.wishlistController.getWishlistCount,
    );

    this.router.post(
      '/',
      verifyToken,
      userGuard,
      this.wishlistController.AddToWishlist,
    );
    
    this.router.delete(
      '/',
      verifyToken,
      userGuard,
      this.wishlistController.removeWishlist,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
