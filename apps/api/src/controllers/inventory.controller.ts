import { NextFunction, Request, Response } from 'express';
import { InventoryService } from '@/services/inventory.service';
import { InventoryBody, InventoryQuery } from '@/types/inventory.type';
import { UserDecoded } from '@/types/auth.type';

export class InventoryController {
  async createInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const body = req.body as InventoryBody;
      const response = await InventoryService.createInventory(user, body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getInventories(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const query = req.query as InventoryQuery;
      const response = await InventoryService.getInventories(user, query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const { id } = req.params;
      const response = await InventoryService.deleteInventory(user, id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getInventory(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const { id } = req.params;
      const response = await InventoryService.getInventory(user, id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
