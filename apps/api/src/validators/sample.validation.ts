import { z } from 'zod';

export class SampleValidation {
  static SAMPLE_ID = z.coerce
    .number({ invalid_type_error: 'Sample ID must be a number!' })
    .int({ message: 'Sample ID must be an integer!' })
    .positive({ message: 'Sample ID must be a positive number!' });

  static CREATE = z.object({
    name: z.string({ message: 'Name is required!' }),
    code: z.string({ message: 'Code is required!' }),
  });
}
