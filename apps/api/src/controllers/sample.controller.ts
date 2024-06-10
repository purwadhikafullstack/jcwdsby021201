import { NextFunction, Request, Response } from 'express';
import { SampleService } from '@/services/sample.service';
import { SampleBody } from '@/types/sample.type';

export class SampleController {
  async getSample(req: Request, res: Response, next: NextFunction) {
    try {
      const response = await SampleService.getSample();
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getSampleById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const response = await SampleService.getSampleById(id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createSample(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body as SampleBody;
      const response = await SampleService.createSample(body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }
}
