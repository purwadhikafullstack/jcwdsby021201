import { z } from 'zod';

export const userSchema = z
  .object({
    username: z.string().min(3, { message: 'Username minimum length is 3!' }),
    email: z
      .string()
      .min(1, { message: 'Email is required!' })
      .email({ message: 'Email is invalid!' }),
    password: z.string().min(8, { message: 'Password minimum length is 8!' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Password minimum length is 8!' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

export type UserFormData = z.infer<typeof userSchema>;
