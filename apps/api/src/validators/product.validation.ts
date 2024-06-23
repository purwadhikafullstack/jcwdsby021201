import { z } from 'zod';

export class ProductValidation {
  static BODY = z.object({
    name: z
      .string({
        message: 'Name is required!',
        invalid_type_error: 'Name must be a string!',
      })
      .min(1, { message: 'Name must be at least 1 character!' }),
    price: z
      .number({
        message: 'Price is required!',
        invalid_type_error: 'Price must be a number!',
      })
      .positive({ message: 'Price must be greater than 0!' }),
    description: z
      .string({ invalid_type_error: 'Description must be a string!' })
      .optional(),
    categoryId: z
      .number({
        message: 'Category Id is required!',
        invalid_type_error: 'Category Id must be a number!',
      })
      .int({ message: 'Category Id must be a number!' })
      .positive({ message: 'Category Id must be greater than 0!' }),
  });

  static ID = z.coerce
    .number({
      required_error: 'Id is required!',
      invalid_type_error: 'Id is invalid!',
    })
    .int({ message: 'Id is invalid!' })
    .positive({ message: 'Id is invalid!' });
}
