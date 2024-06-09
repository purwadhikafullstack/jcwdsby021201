import { z } from 'zod';

export const sampleFormSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  code: z.string().min(1, { message: 'Code is required' }),
});

export type SampleFormSchema = z.infer<typeof sampleFormSchema>;
