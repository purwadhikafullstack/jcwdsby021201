import { LocationController } from '@/controllers/location.controller';
import { Router } from 'express';

export class LocationRouter {
  private router: Router;
  private locationController: LocationController;

  constructor() {
    this.locationController = new LocationController();
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/province', this.locationController.getProvince);
    this.router.get(
      '/cities/:provinceId',
      this.locationController.getCitiesPagination,
    );
    this.router.get(
      '/province/:provinceId',
      this.locationController.getProvinceForProfile,
    );
    this.router.get('/city/:cityId', this.locationController.getCityForProfile);
    this.router.get('/:provinceId', this.locationController.getCities);
  }

  getRouter(): Router {
    return this.router;
  }
}
