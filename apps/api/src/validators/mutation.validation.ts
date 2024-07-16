import { z } from 'zod';

export class MutationValidation {
  static BODY = z
    .object({
      sourceWarehouseId: z
        .number({
          message: 'Source Warehouse Id is required!',
          invalid_type_error: 'Source Warehouse Id must be a number!',
        })
        .int({ message: 'Source Warehouse Id must be a number!' })
        .positive({ message: 'Source Warehouse Id must be greater than 0!' }),
      destinationWarehouseId: z
        .number({
          message: 'Destination Warehouse Id is required!',
          invalid_type_error: 'Destination Warehouse Id must be a number!',
        })
        .int({ message: 'Destination Warehouse Id must be a number!' })
        .positive({
          message: 'Destination Warehouse Id must be greater than 0!',
        }),
      productId: z
        .number({
          message: 'Product Id is required!',
          invalid_type_error: 'Product Id must be a number!',
        })
        .int({ message: 'Product Id must be a number!' })
        .positive({ message: 'Product Id must be greater than 0!' }),
      stockRequest: z
        .number({
          message: 'Stock Request is required!',
          invalid_type_error: 'Stock Request must be a number!',
        })
        .int({ message: 'Stock Request must be a integer number!' })
        .positive({ message: 'Stock Request must be greater than 0!' }),
      note: z
        .string({ invalid_type_error: 'Note must be a string!' })
        .optional(),
    })
    .refine((data) => data.sourceWarehouseId !== data.destinationWarehouseId, {
      message: 'Source Warehouse and Destination Warehouse cannot be same!',
      path: ['destinationWarehouseId'],
    });

  static UPDATE = z.object({
    stockProcess: z
      .number({
        message: 'Stock Process is required!',
        invalid_type_error: 'Stock Process must be a number!',
      })
      .int({ message: 'Stock Process must be a integer number!' })
      .positive({ message: 'Stock Process must be greater than 0!' }),
  });
}
