import { z } from 'zod';

const allowedFormats = ['image/jpeg', 'image/png', 'image/gif'];

export const uploadPictureSchema = z.any();

export type UploadPictureSchema = z.infer<typeof uploadPictureSchema>;
