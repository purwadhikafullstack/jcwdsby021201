import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';

export type Route = {
  path: string;
  label?: string;
  Icon?: any;
};

export const mainPages: Record<string, Route> = {
  home: { path: '/', label: 'Home' },
};

export const authPages: Record<string, Route> = {
  register: { path: '/auth/register', label: 'Register' },
  login: { path: '/auth/login', label: 'Login' },
  forgotPassword: { path: '/auth/forgot-password', label: 'Forgot Password' },
  checkMail: { path: '/auth/check-mail', label: 'Check Mail' },
  resetPassword: { path: '/auth/reset-password', label: 'Reset Password' },
  verify: { path: '/auth/verify', label: 'Verify' },
};

export const dashboardUserPages: Record<string, Route> = {
  profile: { path: '/dashboard/user/profile', label: 'Profile' },
  purchases: { path: '/dashboard/user/order/to-pay', label: 'To Pay' },
  shipping: { path: '/dashboard/user/order/to-ship', label: 'To Ship' },
  receive: { path: '/dashboard/user/order/to-receive', label: 'To Receive' },
};

export const dashboardAdminPages: Record<string, Route> = {
  warehouse: {
    path: '/dashboard/admin/warehouses',
    label: 'Warehouse',
    Icon: WarehouseOutlinedIcon,
  },
  category: {
    path: '/dashboard/admin/categories',
    label: 'Category',
    Icon: SellOutlinedIcon,
  },
  product: {
    path: '/dashboard/admin/products',
    label: 'Product',
    Icon: ShoppingCartOutlinedIcon,
  },
  inventory: {
    path: '/dashboard/admin/inventories',
    label: 'Inventory',
    Icon: InventoryOutlinedIcon,
  },
  mutation: {
    path: '/dashboard/admin/mutations',
    label: 'Mutation',
    Icon: LocalShippingOutlinedIcon,
  },
};

export const apiRoutes: Record<string, Route> = {
  register: { path: '/auth/register' },
  verify: { path: '/auth/verify' },
  login: { path: '/auth/login' },
  oauth: { path: '/auth/oauth' },
  forgotPassword: { path: '/auth/forgot-password' },
  resetPassword: { path: '/auth/reset-password' },
};

export const internalApiRoutes: Record<string, Route> = {
  login: { path: '/api/login' },
};
