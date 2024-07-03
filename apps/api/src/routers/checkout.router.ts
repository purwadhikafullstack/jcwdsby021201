import { CheckoutController } from '@/controllers/checkout.controller';
import { Router } from 'express';

export class CheckoutRouter {
  private router: Router;
  private checkoutCOntroller: CheckoutController;

  constructor() {
    this.checkoutCOntroller = new CheckoutController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/', this.checkoutCOntroller.countShippingCost);
  }

  getRouter(): Router {
    return this.router;
  }
}
