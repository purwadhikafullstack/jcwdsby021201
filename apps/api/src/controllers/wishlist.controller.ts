import { WishlistService } from '@/services/wishlist.service';
import { NextFunction, Request, Response } from 'express';

export class WishlistController {
  public async AddToWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body;
      const response = await WishlistService.AddToWishlist(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async removeWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body;
      const response = await WishlistService.removeWishlist(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async myWishlist(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const response = await WishlistService.myWishlist(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getWishlistCount(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const response = await WishlistService.getWishlistCount(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
