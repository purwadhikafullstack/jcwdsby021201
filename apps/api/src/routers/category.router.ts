import { CategoryController } from '@/controllers/category.controller';
import {
  adminGuard,
  superAdminGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class CategoryRouter {
  private router: Router;
  private categoryController: CategoryController;

  constructor() {
    this.categoryController = new CategoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      superAdminGuard,
      this.categoryController.createCategory,
    );

    this.router.get(
      '/',
      verifyToken,
      adminGuard,
      this.categoryController.getCategories,
    );

    this.router.delete(
      '/:id',
      verifyToken,
      superAdminGuard,
      this.categoryController.deleteCategory,
    );

    this.router.get(
      '/:id',
      verifyToken,
      adminGuard,
      this.categoryController.getCategory,
    );

    this.router.patch(
      '/:id',
      verifyToken,
      superAdminGuard,
      this.categoryController.updateCategory,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
