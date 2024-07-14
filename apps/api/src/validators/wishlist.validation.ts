import { z } from 'zod';

export class WishlistValidation {
  static PRODUCT_ID = z
    .number({ message: 'Product ID must be Number!' })
    .int()
    .positive({ message: 'Product ID must be a positive integer' });
}
