import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email is required!' })
    .email({ message: 'Email is invalid!' }),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
