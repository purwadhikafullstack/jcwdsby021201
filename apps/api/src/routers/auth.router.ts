import { AuthController } from '@/controllers/auth.controller';
import { Router } from 'express';

export class AuthRouter {
  private router: Router;
  private authController: AuthController;

  constructor() {
    this.authController = new AuthController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post('/register', this.authController.register);
    this.router.post('/verify', this.authController.verify);
    this.router.post('/login', this.authController.login);
    this.router.post('/oauth', this.authController.oauth);
    this.router.post('/forgot-password', this.authController.forgotPassword);
    this.router.post('/reset-password', this.authController.resetPassword);
  }

  getRouter(): Router {
    return this.router;
  }
}
