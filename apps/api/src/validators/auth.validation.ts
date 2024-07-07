import { z } from 'zod';

export class AuthValidation {
  static ONLY_EMAIL = z.object({
    email: z
      .string({
        message: 'Email is required!',
        invalid_type_error: 'Email must be a string!',
      })
      .email({ message: 'Email is invalid!' }),
  });

  static VERIFICATION = z.object({
    password: z
      .string({ message: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters!' }),
    token: z.string({ message: 'Token is required!' }).min(1, {
      message: 'Token must be at least 1 character!',
    }),
  });

  static LOGIN = z.object({
    email: z
      .string({
        message: 'Email is required!',
        invalid_type_error: 'Email must be a string!',
      })
      .email({ message: 'Email is invalid!' }),
    password: z
      .string({ message: 'Password is required!' })
      .min(8, { message: 'Password must be at least 8 characters!' }),
  });

  static OAUTH = z.object({
    email: z
      .string({
        message: 'Email is required!',
        invalid_type_error: 'Email must be a string!',
      })
      .email({ message: 'Email is invalid!' }),
    image: z
      .string({ message: 'Image is required!' })
      .url({ message: 'Image is invalid!' }),
    provider: z.string({ message: 'Provider is required!' }).min(1, {
      message: 'Provider must be at least 1 character!',
    }),
  });
}
