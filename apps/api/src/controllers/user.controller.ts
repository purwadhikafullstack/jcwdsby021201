import { UserService } from '@/services/user.service';
import { ActivationBody, CredentialBody, UpdateEmailBody } from '@/types/user.type';
import { NextFunction, Request, Response } from 'express';
import { any } from 'zod';

export class UserController {
  public async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const response = await UserService.getDataProfile(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async changeUserProfileCredential(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body as CredentialBody;
      const response = await UserService.changeUserProfileCredential(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async checkEmailAvailability(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as UpdateEmailBody;
      const response = await UserService.checkEmailAvailability(body);
      return res.status(200).send(response.success);
    } catch (error) {
      next(error);
    }
  }

  public async changeEmailUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body as UpdateEmailBody;
      const response = await UserService.changeEmailUser(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async changeProfilPicture(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const file = req.file as Express.Multer.File;

      const response = await UserService.changeProfilPicture(id, file);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async activationAccount(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const token = req.body as ActivationBody
      const response = await UserService.activationAccount(token);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
