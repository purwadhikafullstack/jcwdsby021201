import { InventoryController } from '@/controllers/inventory.controller';
import { adminGuard, verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class InventoryRouter {
  private router: Router;
  private inventoryController: InventoryController;

  constructor() {
    this.inventoryController = new InventoryController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      adminGuard,
      this.inventoryController.createInventory,
    );

    this.router.get(
      '/',
      verifyToken,
      adminGuard,
      this.inventoryController.getInventories,
    );

    this.router.delete(
      '/:id',
      verifyToken,
      adminGuard,
      this.inventoryController.deleteInventory,
    );

    this.router.get(
      '/:id',
      verifyToken,
      adminGuard,
      this.inventoryController.getInventory,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
