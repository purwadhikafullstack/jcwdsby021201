import { ProductController } from '@/controllers/product.controller';
import {
  adminGuard,
  superAdminGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { uploader } from '@/middlewares/uploader.middleware';
import { Router } from 'express';

export class ProductRouter {
  private router: Router;
  private productController: ProductController;

  constructor() {
    this.productController = new ProductController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      superAdminGuard,
      uploader('/products', 'PRD').array('files'),
      this.productController.createProduct,
    );

    this.router.get(
      '/',
      verifyToken,
      adminGuard,
      this.productController.getProducts,
    );

    this.router.delete(
      '/upload/:imageId',
      verifyToken,
      superAdminGuard,
      this.productController.deleteProductImage,
    );

    this.router.post(
      '/upload/:id',
      verifyToken,
      superAdminGuard,
      uploader('/products', 'PRD').array('files'),
      this.productController.addProductImages,
    );

    this.router.delete(
      '/:id',
      verifyToken,
      superAdminGuard,
      this.productController.deleteProduct,
    );

    this.router.get(
      '/:id',
      verifyToken,
      adminGuard,
      this.productController.getProduct,
    );

    this.router.patch(
      '/:id',
      verifyToken,
      superAdminGuard,
      this.productController.updateProduct,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
