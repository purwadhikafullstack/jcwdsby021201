import { z } from 'zod';

export class WarehouseValidation {
  static BODY = z.object({
    name: z
      .string({
        message: 'Name is required!',
        invalid_type_error: 'Name must be a string!',
      })
      .min(1, { message: 'Name must be at least 1 character!' }),
    address: z
      .string({
        message: 'Address is required!',
        invalid_type_error: 'Address must be a string!',
      })
      .min(1, { message: 'Address must be at least 1 character!' }),
    provinceId: z
      .number({
        message: 'Province Id is required!',
        invalid_type_error: 'Province Id must be a number!',
      })
      .int({ message: 'Province Id must be a number!' })
      .positive({ message: 'Province Id must be greater than 0!' }),
    cityId: z
      .number({
        message: 'City Id is required!',
        invalid_type_error: 'City Id must be a number!',
      })
      .int({ message: 'City Id must be a number!' })
      .positive({ message: 'City Id must be greater than 0!' }),
    postalCode: z
      .string({
        message: 'Postal Code is required!',
        invalid_type_error: 'Postal Code must be a string!',
      })
      .regex(/^\d{5}$/, { message: 'Postal code must be exactly 5 digits' }),
    latitude: z.number({
      message: 'Latitude is required!',
      invalid_type_error: 'Latitude must be a number!',
    }),
    longitude: z.number({
      message: 'Longitude is required!',
      invalid_type_error: 'Longitude must be a number!',
    }),
  });
}
