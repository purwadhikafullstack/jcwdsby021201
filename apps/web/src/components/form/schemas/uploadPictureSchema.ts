import { z } from 'zod';

export const uploadPictureSchema = z.any();

export type UploadPictureSchema = z.infer<typeof uploadPictureSchema>;
