import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().nullable(),
  price: z
    .string()
    .min(1, { message: 'Price is required' })
    .refine(
      (val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed > 0;
      },
      { message: 'Price must be a positive number' },
    ),
  categoryId: z
    .number()
    .min(1, { message: 'Category must be selected' })
    .nullable()
    .refine((val) => val !== null, { message: 'Category is required' }),
});

export type ProductFormData = {
  name: string;
  description: string | null;
  price: string;
  categoryId: number | null;
};
