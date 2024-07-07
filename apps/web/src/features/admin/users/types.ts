import { OptionLabel } from '@/features/types';

export type UserBody = {
  username: string;
  email: string;
  password: string;
};

export type UserUpdate = UserBody & {
  id: number;
};

type Response = {
  id: number;
  email: string;
  isVerified: boolean;
  jwtToken: string | null;
  image: string | null;
  provider: string;
  createdAt: string;
  updatedAt: string;
};

export type UserResponse = Response & {
  username: string | null;
  role: 'ADMIN' | 'USER';
};

export type AdminResponse = Response & {
  username: string;
  role: 'ADMIN';
  warehouse: OptionLabel | null;
};
