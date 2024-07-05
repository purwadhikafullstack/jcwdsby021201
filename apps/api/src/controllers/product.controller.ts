import { NextFunction, Request, Response } from 'express';
import { ProductBody, ProductForm } from '@/types/product.type';
import { ProductService } from '@/services/product.service';
import { ProductQuery } from '@/types/product.type';

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as ProductForm;
      const files = req.files as Express.Multer.File[];
      const response = await ProductService.createProduct(body, files);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as ProductQuery;
      const response = await ProductService.getProducts(query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await ProductService.deleteProduct(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const response = await ProductService.getProduct(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const body = req.body as ProductBody;
      const response = await ProductService.updateProduct(id, body);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteProductImage(req: Request, res: Response, next: NextFunction) {
    try {
      const { imageId } = req.params;
      const response = await ProductService.deleteProductImage(imageId);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async addProductImages(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const files = req.files as Express.Multer.File[];
      const response = await ProductService.addProductImages(id, files);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public async getStock(req: Request, res: Response, next: NextFunction) {
    try {
      const params = Number(req.params.productId);
      const response = await ProductService.getStock(params);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getProductForUser(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const response = await ProductService.getProductForUser();
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
