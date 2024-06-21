import { NextFunction, Request, Response } from 'express';
import { CategoryBody, CategoryQuery } from '@/types/category.type';
import { CategoryService } from '@/services/category.service';

export class CategoryController {
  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as CategoryBody;
      const response = await CategoryService.createCategory(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as CategoryQuery;
      const response = await CategoryService.getCategories(query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
