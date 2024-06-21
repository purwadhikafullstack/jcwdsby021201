import { z } from 'zod';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { UserSession } from '@/features/types';

export const emailSchema = z.object({
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .min(5, { message: 'Email must be at least 5 characters long' })
    .max(100, { message: 'Email cannot exceed 100 characters' }),
});

export type EmailSchema = z.infer<typeof emailSchema>;
