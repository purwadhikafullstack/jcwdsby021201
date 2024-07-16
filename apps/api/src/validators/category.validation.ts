import { z } from 'zod';

export class CategoryValidation {
  static BODY = z.object({
    name: z
      .string({
        message: 'Name is required!',
        invalid_type_error: 'Name must be a string!',
      })
      .min(1, { message: 'Name must be at least 1 character!' }),
  });
}
