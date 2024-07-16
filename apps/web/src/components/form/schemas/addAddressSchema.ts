// src/schemas/addressSchema.ts
import { z } from 'zod';

export const addressSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name should not exceed 100 characters' }),
  address: z
    .string()
    .min(5, { message: 'Address is too short' })
    .max(200, { message: 'Address should not exceed 200 characters' }),
  cityId: z.number().min(1, { message: 'City is required' }),
  provinceId: z.number().min(1, { message: 'Province is required' }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: 'Postal code must be exactly 5 digits' }),
  userId: z.number(),
  isPrimary: z.boolean(),
  latitude: z.number(),
  longitude: z.number(),
});

export type AddressSchema = z.infer<typeof addressSchema>;
