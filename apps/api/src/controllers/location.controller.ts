import { LocationService } from '@/services/location.service';
import { NextFunction, Request, Response } from 'express';

export class LocationController {
  public async getProvince(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await LocationService.getProvinces();
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getCities(req: Request, res: Response, next: NextFunction) {
    try {
      const { provinceId } = req.params;

      const response = await LocationService.getCitiesByProvince(
        Number(provinceId),
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getProvinceForProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { provinceId } = req.params;

      const response = await LocationService.getProvinceForProfile(
        Number(provinceId),
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }

  public async getCityForProfile(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { cityId } = req.params;

      const response = await LocationService.getCityForProfile(
        Number(cityId),
      );
      return res.status(200).send(response);
    } catch (error) {
      next(error);
    }
  }
}
