import { z } from 'zod';

export class CheckoutValidation {
  static COUNT_SHIPPING_BODY = z.object({
    courier: z.string({ message: 'Courier is required!' }).min(1, { message: 'Courier must not be empty' }),
    destination: z
      .string({ message: 'destinationCityId is required!' })
      .min(1, { message: 'Destination City ID must not be empty' }),
    origin: z
      .string({ message: 'originCityId is required!' })
      .min(1, { message: 'Destination City ID must not be empty' }),
    weight: z
      .number({ message: 'weight is required!' })
      .positive({ message: 'Weight must be a positive number' }),
  });
}
