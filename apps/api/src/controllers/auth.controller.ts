import { AuthService } from '@/services/auth.service';
import {
  LoginBody,
  OAuthBody,
  OnlyEmailBody,
  VerificationBody,
} from '@/types/auth.type';
import { NextFunction, Request, Response } from 'express';

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as OnlyEmailBody;
      const response = await AuthService.register(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async verify(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as VerificationBody;
      const response = await AuthService.verify(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as LoginBody;
      const response = await AuthService.login(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async oauth(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as OAuthBody;
      const response = await AuthService.oauth(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as OnlyEmailBody;
      const response = await AuthService.forgotPassword(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as VerificationBody;
      const response = await AuthService.resetPassword(body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
