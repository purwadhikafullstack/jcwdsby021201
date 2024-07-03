import { CartService } from '@/services/cart.service';
import {
  AddToCartBody,
  DeleteProductCart,
  UpdateBody,
} from '@/types/cart.type';
import { NextFunction, Request, Response } from 'express';

export class CartController {
  public async addProductToCart(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body;
      const response = await CartService.addProductToCart(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getCartCount(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const response = await CartService.getCartCount(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getProductCart(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const response = await CartService.getProductCart(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteProductCart(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const params = Number(req.params.productId);
      const response = await CartService.deleteProductCart(id, params);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async updateQuantity(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body as UpdateBody;
      const response = await CartService.updateQuantity(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
