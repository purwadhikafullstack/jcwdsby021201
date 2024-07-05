import { z } from 'zod';

export class InventoryValidation {
  static BODY = z.object({
    warehouseId: z
      .number({
        message: 'Warehouse Id is required!',
        invalid_type_error: 'Warehouse Id must be a number!',
      })
      .int({ message: 'Warehouse Id must be a number!' })
      .positive({ message: 'Warehouse Id must be greater than 0!' }),
    productId: z
      .number({
        message: 'Product Id is required!',
        invalid_type_error: 'Product Id must be a number!',
      })
      .int({ message: 'Product Id must be a number!' })
      .positive({ message: 'Product Id must be greater than 0!' }),
    stock: z
      .number({
        message: 'Stock is required!',
        invalid_type_error: 'Stock must be a number!',
      })
      .int({ message: 'Stock must be a integer number!' }),
  });
}
