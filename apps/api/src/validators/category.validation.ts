import { z } from 'zod';

export class CategoryValidation {
  static BODY = z.object({
    name: z.string({ message: 'Name is required!' }).min(1, {
      message: 'Name must be at least 1 character!',
    }),
  });

  static ID = z.coerce
    .number({
      required_error: 'Id is required!',
      invalid_type_error: 'Id is invalid!',
    })
    .int({ message: 'Id is invalid!' })
    .positive({ message: 'Id is invalid!' });
}
