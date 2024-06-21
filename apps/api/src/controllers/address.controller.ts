import { AddressService } from '@/services/address.service';
import { AddressBody } from '@/types/address.type';
import { NextFunction, Request, Response } from 'express';

export class AddressController {
  public async getAddressById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const response = await AddressService.getAddressById(id);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getAddressByAddressId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = res.locals.decoded.id;
      const addressId = Number(req.params.addressId);
      const response = await AddressService.getAddressByAddressId(
        userId,
        addressId,
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async deleteAddressByAddressId(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = res.locals.decoded.id;
      const addressId = Number(req.params.addressId);
      const response = await AddressService.deleteAddressByAddressId(
        userId,
        addressId,
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async addAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;

      const body = req.body as AddressBody;
      const response = await AddressService.addAddress(id, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async updateAddress(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.decoded.id;
      const body = req.body as AddressBody;
      const addressId = Number(req.params.addressId);
      const response = await AddressService.updateAddress(id, addressId, body);
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
