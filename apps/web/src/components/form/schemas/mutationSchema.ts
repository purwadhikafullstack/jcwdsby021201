import { z } from 'zod';

export const mutationSchema = z.object({
  sourceWarehouseId: z
    .number()
    .min(1, { message: 'Source Warehouse must be selected' })
    .nullable()
    .refine((val) => val !== null, { message: 'Source Warehouse is required' }),
  destinationWarehouseId: z
    .number()
    .min(1, { message: 'Destination Warehouse must be selected' })
    .nullable()
    .refine((val) => val !== null, {
      message: 'Destination Warehouse is required',
    }),
  productId: z
    .number()
    .min(1, { message: 'Product must be selected' })
    .nullable()
    .refine((val) => val !== null, { message: 'Product is required' }),
  stockRequest: z
    .string()
    .min(1, { message: 'Stock Request is required' })
    .refine(
      (val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed > 0 && Number.isInteger(parsed);
      },
      { message: 'Stock Request must be integer and greater than 0' },
    ),
  note: z.string().nullable(),
});

export const mutationUpdateSchema = z.object({
  stockProcess: z
    .string()
    .min(1, { message: 'Stock Process is required' })
    .refine(
      (val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed > 0 && Number.isInteger(parsed);
      },
      { message: 'Stock Process must be integer and greater than 0' },
    ),
});

export type MutationFormData = {
  sourceWarehouseId: number | null;
  destinationWarehouseId: number | null;
  productId: number | null;
  stockRequest: string;
  stockProcess?: string;
  note: string | null;
};
