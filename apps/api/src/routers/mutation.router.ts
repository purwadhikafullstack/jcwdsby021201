import { MutationController } from '@/controllers/mutation.controller';
import { adminGuard, verifyToken } from '@/middlewares/auth.middleware';
import { Router } from 'express';

export class MutationRouter {
  private router: Router;
  private mutationController: MutationController;

  constructor() {
    this.mutationController = new MutationController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.post(
      '/',
      verifyToken,
      adminGuard,
      this.mutationController.createMutation,
    );

    this.router.get(
      '/',
      verifyToken,
      adminGuard,
      this.mutationController.getMutations,
    );

    this.router.patch(
      '/to-cancel/:id',
      verifyToken,
      adminGuard,
      this.mutationController.updateMutationToCancel,
    );

    this.router.patch(
      '/to-approve/:id',
      verifyToken,
      adminGuard,
      this.mutationController.updateMutationToApprove,
    );

    this.router.get(
      '/:id',
      verifyToken,
      adminGuard,
      this.mutationController.getMutation,
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
