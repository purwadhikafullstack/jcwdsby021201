import SellOutlinedIcon from '@mui/icons-material/SellOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import WarehouseOutlinedIcon from '@mui/icons-material/WarehouseOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import StoreIcon from '@mui/icons-material/Store';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InboxIcon from '@mui/icons-material/Inbox';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import CloseIcon from '@mui/icons-material/Close';
import { SvgIconComponent } from '@mui/icons-material';

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
  purchases: {
    path: '/dashboard/user/order/to-pay',
    label: 'To Pay',
    Icon: StoreIcon,
  },
  shipping: {
    path: '/dashboard/user/order/to-ship',
    label: 'To Ship',
    Icon: LocalShippingIcon,
  },
  receive: {
    path: '/dashboard/user/order/to-receive',
    label: 'To Receive',
    Icon: InboxIcon,
  },
  cancelled: {
    path: '/dashboard/user/order/cancelled',
    label: 'Cancel',
    Icon: CloseIcon,
  },
  profile: {
    path: '/dashboard/user/profile',
    label: 'Profile',
    Icon: AccountCircleIcon,
  },
  myAddress: {
    path: '/dashboard/user/profile/address',
    label: 'My Address',
    Icon: MyLocationIcon,
  },
};

export const dashboardAdminPages: Record<string, Route> = {
  user: {
    path: '/dashboard/admin/users',
    label: 'User',
    Icon: ManageAccountsOutlinedIcon,
  },
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
  register: { path: '/api/auth/register' },
  verify: { path: '/api/auth/verify' },
  login: { path: '/api/auth/login' },
  oauth: { path: '/api/auth/oauth' },
  forgotPassword: { path: '/api/auth/forgot-password' },
  resetPassword: { path: '/api/auth/reset-password' },
  categories: { path: '/api/categories' },
  inventories: { path: '/api/inventories' },
  mutations: { path: '/api/mutations' },
  products: { path: '/api/products' },
  admin: { path: '/api/admin' },
  warehouses: { path: '/api/warehouses' },
  addresses: { path: '/api/addresses' },
  carts: { path: '/api/carts' },
  locations: { path: '/api/locations' },
  orders: { path: '/api/orders' },
  checkouts: { path: '/api/checkouts' },
  users: { path: '/api/users' },
  wishlists: { path: '/api/wishlists' },
};

export const internalApiRoutes: Record<string, Route> = {
  login: { path: '/api/login' },
};
