import { UserController } from '@/controllers/user.controller';
import { userGuard, verifyToken } from '@/middlewares/auth.middleware';
import { uploader } from '@/middlewares/uploader.middleware';
import { Router } from 'express';

export class UserRouter {
  private router: Router;
  private userController: UserController;

  constructor() {
    this.userController = new UserController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get(
      '/',
      verifyToken,
      userGuard,
      this.userController.getUserProfile,
    );

    this.router.patch(
      '/change-profile',
      verifyToken,
      userGuard,
      this.userController.changeUserProfileCredential,
    );

    this.router.patch(
      '/change-email',
      verifyToken,
      userGuard,
      this.userController.changeEmailUser,
    );

    this.router.post(
      '/email-availability',
      verifyToken,
      userGuard,
      this.userController.checkEmailAvailability,
    );

    this.router.patch(
      '/change-image',
      verifyToken,
      userGuard,
      uploader('/profile', 'PHOTO').single('image'),
      this.userController.changeProfilPicture,
    );

    this.router.patch(
      '/activation-email',
      this.userController.activationAccount,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
