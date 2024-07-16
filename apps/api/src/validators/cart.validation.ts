import { z } from 'zod';

export class CartValidation {
  static ADD_TO_CART_BODY = z.object({
    productId: z
      .number({
        message: 'Product ID must be a number!',
      })
      .int({
        message: 'Product ID must be a positive integer!',
      })
      .positive({
        message: 'Product ID must be a positive number!',
      }),
    quantity: z
      .number({
        message: 'Quantity must be a number!',
      })
      .int({
        message: 'Quantity must be a integer!',
      })
      .positive({
        message: 'Quantity must be a positive number!',
      }),
  });

  static UPDATE_BODY =z.object({
    productId: z
      .number({
        message: 'Product ID must be a number!',
      })
      .int({
        message: 'Product ID must be a positive integer!',
      })
      .positive({
        message: 'Product ID must be a positive number!',
      }),
    quantity: z
      .number({
        message: 'Quantity must be a number!',
      })
      .int({
        message: 'Quantity must be a integer!',
      })
      .positive({
        message: 'Quantity must be a positive number!',
      }),
  });


  static DELETE_CART_BODY = z
    .number({
      message: 'Product ID must be a number!',
    })
    .int({
      message: 'Product ID must be a positive integer!',
    })
    .positive({
      message: 'Product ID must be a positive number!',
    });
}
