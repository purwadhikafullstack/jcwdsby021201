import { z } from 'zod';

export class CategoryValidation {
  static CREATE = z.object({
    name: z.string({ message: 'Name is required!' }).min(1, {
      message: 'Name must be at least 1 character!',
    }),
  });
}
