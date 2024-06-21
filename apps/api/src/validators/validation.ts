import { ZodType, z } from 'zod';

export class Validation {
  static validate<T>(schema: ZodType, data: T): T {
    return schema.parse(data);
  }

  static QUERY = z.object({
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
      .string({ invalid_type_error: 'Filter must be a string!' })
      .optional(),
    sortBy: z
      .string({ invalid_type_error: 'Sorting must be a string!' })
      .optional(),
    orderBy: z
      .string({ invalid_type_error: 'Ordering must be a string!' })
      .optional(),
  });
}
