import { WarehouseController } from '@/controllers/warehouse.controller';
import {
  adminGuard,
  adminWarehouseGuard,
  superAdminGuard,
  verifyToken,
} from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class WarehouseRouter {
  private router: Router;
  private warehouseController: WarehouseController;

  constructor() {
    this.warehouseController = new WarehouseController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      superAdminGuard,
      this.warehouseController.createWarehouse,
    );

    this.router.get(
      '/',
      verifyToken,
      adminGuard,
      this.warehouseController.getWarehouses,
    );

    this.router.post('/nearest', this.warehouseController.findNearestWarehouse);

    this.router.get(
      '/user',
      verifyToken,
      adminWarehouseGuard,
      this.warehouseController.getUserWarehouse,
    );

    this.router.delete(
      '/:id',
      verifyToken,
      superAdminGuard,
      this.warehouseController.deleteWarehouse,
    );

    this.router.get(
      '/:id',
      verifyToken,
      superAdminGuard,
      this.warehouseController.getWarehouse,
    );

    this.router.patch(
      '/:id',
      verifyToken,
      superAdminGuard,
      this.warehouseController.updateWarehouse,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
