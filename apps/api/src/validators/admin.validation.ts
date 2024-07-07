import { z } from 'zod';

export class AdminValidation {
  static USER_BODY = z.object({
    username: z
      .string({
        message: 'Username is required!',
        invalid_type_error: 'Username must be a string!',
      })
      .min(1, { message: 'Username must be at least 1 character!' }),
    email: z
      .string({
        message: 'Email is required!',
        invalid_type_error: 'Email must be a string!',
      })
      .email({ message: 'Email is invalid!' }),
    password: z
      .string({ message: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters!' }),
  });
}
