import { z } from 'zod';

export class AddressValidation {
  static CREATE = z.object({
    name: z
      .string({ message: 'Name is required!' })
      .min(3, 'Name must be at least 3 characters!'),
    address: z
      .string({ message: 'Address is required!' })
      .min(5, 'Address must be at least 5 characters!'),
    city: z.string().min(1, 'City is required'),
    province: z.string().min(1, 'Province is required'),
    postalCode: z
      .string()
      .regex(/^\d{5}$/, 'Postal Code must be a 5 digit number'),
    userId: z.number({ message: 'userId is required!' }),
    isPrimary: z.boolean(),
  });

  static UPDATE = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters!').optional(),
    address: z
      .string()
      .min(5, 'Address must be at least 5 characters!')
      .optional(),
    city: z.string().min(1, 'City is required').optional(),
    province: z.string().min(1, 'Province is required').optional(),
    postalCode: z
      .string()
      .regex(/^\d{5}$/, 'Postal Code must be a 5 digit number')
      .optional(),
    userId: z.number().optional(),
    isPrimary: z.boolean().optional(),
  });

  static ONLY_ADDRESS_ID = z
    .number({ message: 'addressId must be Number!' })
    .int()
    .positive({ message: 'Address ID must be a positive integer' });
}
