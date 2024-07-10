import { NextFunction, Request, Response } from 'express';
import { MutationService } from '@/services/mutation.service';
import {
  MutationBody,
  MutationQuery,
  MutationUpdate,
} from '@/types/mutation.type';
import { UserDecoded } from '@/types/auth.type';
import { JournalMutationQuery } from '@/types/journalMutation.type';

export class MutationController {
  async createMutation(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const body = req.body as MutationBody;
      const response = await MutationService.createMutation(user, body);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMutations(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const query = req.query as MutationQuery;
      const response = await MutationService.getMutations(user, query);
      return res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMutation(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const { id } = req.params;
      const response = await MutationService.getMutation(user, id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateMutationToCancel(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const { id } = req.params;
      const response = await MutationService.updateMutationToCancel(user, id);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateMutationToApprove(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const { id } = req.params;
      const body = req.body as MutationUpdate;
      const response = await MutationService.updateMutationToApprove(
        user,
        id,
        body,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMutationHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const user = res.locals.decoded as UserDecoded;
      const query = req.query as JournalMutationQuery;
      const response = await MutationService.getMutationHistory(user, query);
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getMutationHistoryById(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const user = res.locals.decoded as UserDecoded;
      const query = req.query as JournalMutationQuery;
      const response = await MutationService.getMutationHistoryById(
        id,
        user,
        query,
      );
      return res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
