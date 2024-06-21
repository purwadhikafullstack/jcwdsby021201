import { z } from 'zod';

export const usernameSchema = z.object({
  id: z.number(),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' })
    .max(20, { message: 'Username cannot exceed 20 characters' }),
});

export type UsernameSchema = z.infer<typeof usernameSchema>;
