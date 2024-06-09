import { JWT_SECRET } from '@/config';
import { sign, verify } from 'jsonwebtoken';

export function generateJWTTokenWithoutExpiry(
  payload: string | object | Buffer,
): string {
  return sign(payload, JWT_SECRET);
}

export function generateJWTTokenWithExpiry(
  payload: string | object | Buffer,
  expiresIn: string | number,
) {
  return sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJWTToken(token: string): any {
  return verify(token, JWT_SECRET);
}
