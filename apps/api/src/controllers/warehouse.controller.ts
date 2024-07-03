import { NextFunction, Request, Response } from 'express';
import { WarehouseService } from '@/services/warehouse.service';
import { WarehouseBody, WarehouseQuery } from '@/types/warehouse.type';

export class WarehouseController {
  async createWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as WarehouseBody;
      const response = await WarehouseService.createWarehouse(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getWarehouses(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as WarehouseQuery;
      const response = await WarehouseService.getWarehouses(query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await WarehouseService.deleteWarehouse(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await WarehouseService.getWarehouse(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateWarehouse(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body as WarehouseBody;
      const response = await WarehouseService.updateWarehouse(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async findNearestWarehouse(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as any;
      const response = await WarehouseService.findNearestWarehouse(body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
