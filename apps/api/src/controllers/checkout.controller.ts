import { NextFunction, Request, Response } from 'express';
import axios from 'axios';
import { RAJAONGKIR_API_KEY } from '@/config';
import { CheckoutService } from '@/services/checkout.service';
import { CheckoutBody } from '@/types/checkout.type';

export class CheckoutController {
  public async countShippingCost(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = req.body as CheckoutBody
      const response = await CheckoutService.countShippingCost(body)
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
