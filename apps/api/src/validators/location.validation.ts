import { z } from 'zod';

export class LOcationValidation {
  static ONLY_PROVINCE_ID = z
    .number({ message: 'Province ID must be number!' })
    .min(1, { message: 'Email must be at least 1 characters long' });

  static ONLY_CITY_ID = z
    .number({ message: 'Province ID must be number!' })
    .min(1, { message: 'Email must be at least 1 characters long' });
}
