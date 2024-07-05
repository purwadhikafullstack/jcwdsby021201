import { z } from 'zod';

export const inventorySchema = z.object({
  warehouseId: z
    .number()
    .min(1, { message: 'Warehouse must be selected' })
    .nullable()
    .refine((val) => val !== null, { message: 'Warehouse is required' }),
  productId: z
    .number()
    .min(1, { message: 'Product must be selected' })
    .nullable()
    .refine((val) => val !== null, { message: 'Product is required' }),
  stock: z
    .string()
    .min(1, { message: 'Stock is required' })
    .refine(
      (val) => {
        const parsed = parseFloat(val);
        return !isNaN(parsed) && parsed >= 0 && Number.isInteger(parsed);
      },
      { message: 'Stock must be integer and greater than or equal to 0' },
    ),
});

export type InventoryFormData = {
  warehouseId: number | null;
  productId: number | null;
  stock: string;
};
