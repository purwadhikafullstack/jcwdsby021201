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

  static QUERY = z
    .object({
      page: z.coerce
        .number({ invalid_type_error: 'Page must be a number!' })
        .int({ message: 'Page must be an integer!' })
        .positive({ message: 'Page must be a positive number!' })
        .optional(),
      limit: z.coerce
        .number({ invalid_type_error: 'Limit must be a number!' })
        .int({ message: 'Limit must be an integer!' })
        .positive({ message: 'Limit must be a positive number!' })
        .optional(),
      filter: z
        .union([
          z.string({ invalid_type_error: 'Filter must be a string!' }),
          z.coerce.number({ invalid_type_error: 'Filter must be a number!' }),
        ])
        .optional(),
      sortBy: z
        .string({ invalid_type_error: 'Sorting must be a string!' })
        .optional(),
      orderBy: z
        .string({ invalid_type_error: 'Ordering must be a string!' })
        .optional(),
      role: z
        .enum(['ADMIN', 'USER'], {
          message: 'Role must be either ADMIN or USER!',
          invalid_type_error: 'Role must be a string!',
        })
        .optional(),
    })
    .optional();
}
