import { AddressController } from '@/controllers/address.controller';
import { UserController } from '@/controllers/user.controller';
import { userGuard, verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class AddressRouter {
  private router: Router;
  private addressController: AddressController;

  constructor() {
    this.addressController = new AddressController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      userGuard,
      this.addressController.getAddressById,
    );

    this.router.patch(
      '/deactivate/:addressId',
      verifyToken,
      userGuard,
      this.addressController.deleteAddressByAddressId,
    );

    this.router.get(
      '/:addressId',
      verifyToken,
      userGuard,
      this.addressController.getAddressByAddressId,
    );

    this.router.patch(
      '/edit/:addressId',
      verifyToken,
      userGuard,
      this.addressController.updateAddress,
    );

    this.router.post(
      '/',
      verifyToken,
      userGuard,
      this.addressController.addAddress,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
