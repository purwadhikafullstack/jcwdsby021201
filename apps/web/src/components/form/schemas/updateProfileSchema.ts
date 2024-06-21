import { z } from 'zod';

const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];

export const profilePictureSchema = z.any();
// .instanceof(File)
// .refine(
//   (file) => allowedFormats.includes(file.type),
//   "Only JPG, PNG, and GIF files are allowed."
// )
// .refine(
//   (file) => file.size <= 1024 * 1024,
//   "Maximum file size is 1MB."
// );

export type ProfilePictureSchema = z.infer<typeof profilePictureSchema>;
