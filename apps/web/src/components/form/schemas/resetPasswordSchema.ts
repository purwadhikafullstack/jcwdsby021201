import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, { message: 'Password minimum length is 8!' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password minimum length is 8!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
