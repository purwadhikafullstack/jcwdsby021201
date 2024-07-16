import { NextFunction, Request, Response } from 'express';
import { UserDecoded } from '@/types/auth.type';
import { UserBody, UserQuery } from '@/types/admin.type';
import { AdminService } from '@/services/admin.service';

export class AdminController {
  async getWarehouseAdmins(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as UserQuery;
      const response = await AdminService.getWarehouseAdmins(query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
  async createAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as UserBody;
      const response = await AdminService.createAdmin(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUsersWithoutSuperAdmin(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query as UserQuery;
      const response = await AdminService.getUsersWithoutSuperAdmin(query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await AdminService.deleteAdmin(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await AdminService.getUser(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body as UserBody;
      const response = await AdminService.updateAdmin(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
