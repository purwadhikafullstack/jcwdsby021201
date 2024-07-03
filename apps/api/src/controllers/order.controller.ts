import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { RAJAONGKIR_API_KEY } from '@/config';
import { CheckoutService } from '@/services/checkout.service';
import { CheckoutBody } from '@/types/checkout.type';
import { OrderService } from '@/services/order.service';

export class OrderController {
  public async handleCheckout(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body as any;
      const response = await OrderService.handleCheckout(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getOrderByUserId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const response = await OrderService.getOrderByUserId(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async uploadPaymentProof(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const orderId = Number(req.params.orderId);
      const file = req.file as Express.Multer.File;
      const response = await OrderService.uploadPaymentProof(id, orderId, file);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async checkAndMutateStock(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { warehouseId, products } = req.body;
      const response = await OrderService.checkAndMutateStock(
        warehouseId,
        products,
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async cancelOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const orderId = Number(req.params.orderId);
      const response = await OrderService.cancelOrder(id, orderId);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getShippedOrder(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const id = res.locals.decoded.id;
      const response = await OrderService.getShippedOrder(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async receivedOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const orderId = Number(req.params.orderId);
      const response = await OrderService.receivedOrder(id, orderId);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
