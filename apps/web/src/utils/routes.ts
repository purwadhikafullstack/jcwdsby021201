type Route = {
  path: string;
  label?: string;
};

export const mainPages = {
  home: { path: '/', label: 'Home' } as Route,
};

export const authPages = {
  register: { path: '/auth/register', label: 'Register' } as Route,
  login: { path: '/auth/login', label: 'Login' } as Route,
  forgotPassword: {
    path: '/auth/forgot-password',
    label: 'Forgot Password',
  } as Route,
  checkMail: {
    path: '/auth/check-mail',
    label: 'Check Mail',
  } as Route,
  resetPassword: {
    path: '/auth/reset-password',
    label: 'Reset Password',
  } as Route,
  verify: {
    path: '/auth/verify',
    label: 'Verify',
  } as Route,
};

export const dashboardPages = {
  profile: { path: '/dashboard/user/profile', label: 'Profile' } as Route,
};

export const apiRoutes = {
  register: { path: '/auth/register' } as Route,
  verify: { path: '/auth/verify' } as Route,
  login: { path: '/auth/login' } as Route,
  oauth: { path: '/auth/oauth' } as Route,
  forgotPassword: { path: '/auth/forgot-password' } as Route,
  resetPassword: { path: '/auth/reset-password' } as Route,
};

export const internalApiRoutes = {
  login: { path: '/api/login' } as Route,
};
