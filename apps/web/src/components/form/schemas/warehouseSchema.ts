import { number, z } from 'zod';

export const warehouseSchema = z.object({
  userId: z.number().nullable(),
  name: z.string().min(1, { message: 'Name is required' }),
  address: z
    .string()
    .min(5, { message: 'Address is too short' })
    .max(200, { message: 'Address should not exceed 200 characters' }),
  provinceId: number({ invalid_type_error: 'Province must be selected' })
    .min(1, { message: 'Province must be selected' })
    .refine((val) => val !== null, { message: 'Province is required' }),
  cityId: number({ invalid_type_error: 'City must be selected' })
    .min(1, { message: 'City must be selected' })
    .refine((val) => val !== null, { message: 'City is required' }),
  postalCode: z
    .string()
    .regex(/^\d{5}$/, { message: 'Postal code must be exactly 5 digits' }),
  latitude: z.number({ invalid_type_error: 'Latitude must be a number' }),
  longitude: z.number({ invalid_type_error: 'Longitude must be a number' }),
});

export type WarehouseFormData = {
  userId: number | null;
  name: string;
  address: string;
  provinceId: number | null;
  cityId: number | null;
  postalCode: string;
  latitude: number | null;
  longitude: number | null;
};
