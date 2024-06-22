import { z } from 'zod';

export const registerFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email is invalid!' }),
});

export type RegisterFormData = z.infer<typeof registerFormSchema>;
