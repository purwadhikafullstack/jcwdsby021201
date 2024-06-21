import { config } from 'dotenv';
import { resolve } from 'path';

export const NODE_ENV = process.env.NODE_ENV || 'development';

const envFile = NODE_ENV === 'development' ? '.env.development' : '.env';

config({ path: resolve(__dirname, `../${envFile}`) });
config({ path: resolve(__dirname, `../${envFile}.local`), override: true });

// Load all environment variables from .env file

export const PORT = process.env.PORT || 8000;
export const DATABASE_URL = process.env.DATABASE_URL || '';
export const SALT = parseInt(process.env.SALT || '10');
export const JWT_SECRET = process.env.JWT_SECRET || 'super-secret';
export const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';
export const MAIL_SENDER = process.env.MAIL_SENDER || 'example@gmail.com';
export const MAIL_APP_PASSWORD =
  process.env.MAIL_APP_PASSWORD || 'super-secret';
export const RAJAONGKIR_API_KEY = process.env.RAJAONGKIR_API_KEY || 'super-secret'
export const RAJAONGKIR_API_URL = process.env.RAJAONGKIR_API_URL || 'seper-secret'
