import { CLIENT_URL } from '@/config';

export const clientRoutes = {
  verify: CLIENT_URL + '/auth/verify',
  resetPassword: CLIENT_URL + '/auth/reset-password',
};
