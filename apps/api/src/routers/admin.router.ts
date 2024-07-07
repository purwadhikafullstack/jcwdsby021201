import { AdminController } from '@/controllers/admin.controller';
import { superAdminGuard, verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class AdminRouter {
  private router: Router;
  private adminController: AdminController;

  constructor() {
    this.adminController = new AdminController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/admins',
      verifyToken,
      superAdminGuard,
      this.adminController.getWarehouseAdmins,
    );
    this.router.post(
      '/users',
      verifyToken,
      superAdminGuard,
      this.adminController.createAdmin,
    );

    this.router.get(
      '/users',
      verifyToken,
      superAdminGuard,
      this.adminController.getUsersWithoutSuperAdmin,
    );

    this.router.delete(
      '/users/:id',
      verifyToken,
      superAdminGuard,
      this.adminController.deleteAdmin,
    );

    this.router.get(
      '/users/:id',
      verifyToken,
      superAdminGuard,
      this.adminController.getUser,
    );

    this.router.patch(
      '/users/:id',
      verifyToken,
      superAdminGuard,
      this.adminController.updateAdmin,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
