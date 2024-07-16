import { z } from 'zod';
import { deleteFile } from '@/utils/file';
import { ErrorResponse } from '@/utils/error';

const MAX_FILE_SIZE = 1 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
];

export class UserValidation {
  static CREDENTIAL = z.object({
    username: z
      .string({ message: 'Username must be string!' })
      .min(3, { message: 'Username must be at least 3 characters long' })
      .max(50, { message: 'Username must not exceed 50 characters' })
      .regex(/^[a-zA-Z0-9_ ]+$/, {
        message: 'Username can only contain letters, numbers, and underscores',
      })
      .optional(),
    password: z
      .string({ message: 'Password must be string!' })
      .min(8, { message: 'Password must be at least 8 characters long' })
      .max(100, { message: 'Password must not exceed 100 characters' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]+$/, {
        message:
          'Password must contain at least one uppercase letter, one lowercase letter, and one number',
      })
      .optional(),
  });
  static EMAIL = z
    .string({ message: 'Email must be string!' })
    .email({ message: 'Invalid email address' })
    .min(5, { message: 'Email must be at least 5 characters long' })
    .max(255, { message: 'Email must not exceed 255 characters' });

  static fileValidation(file: Express.Multer.File) {
    if (!file) throw new ErrorResponse(400, 'Image is required!');

    if (file.size > MAX_FILE_SIZE) {
      deleteFile('../../public/assets/profile', file.filename);
      throw new ErrorResponse(400, 'Image must be less than 1MB!');
    }

    if (!ACCEPTED_IMAGE_TYPES.includes(file.mimetype)) {
      deleteFile('../../public/assets/profile', file.filename);
      throw new ErrorResponse(
        400,
        '.jpg, .jpeg, .png and .gif files are only accepted.',
      );
    }

    return file;
  }
}
