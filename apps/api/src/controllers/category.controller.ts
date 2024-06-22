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

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body as CategoryBody;
      const response = await CategoryService.updateCategory(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await CategoryService.getCategory(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await CategoryService.deleteCategory(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
