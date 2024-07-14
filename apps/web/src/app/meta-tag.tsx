import type { Metadata } from 'next';

const defaultMetadata: Metadata = {
  title: {
    default: 'TechTitans',
    template: '%s | TechTitans',
  },
  description: 'A brief description of your application',
  icons: {
    icon: '/favicon.png',
  },
};

//CORE
const homeMetadata: Metadata = {
  title: 'Home',
  description: 'Welcome to TechTitans - Find the best electronic products here',
};
const contactMetadata: Metadata = {
  title: 'Contact',
  description: 'Get in touch with TechTitans for any inquiries or support',
};
const aboutMetadata: Metadata = {
  title: 'About',
  description:
    'Learn more about TechTitans and our mission to provide the best electronic products',
};

//USER
const cartMetadata: Metadata = {
  title: 'Shopping Cart',
  description: 'View and manage items in your shopping cart',
};

const exploreMetadata: Metadata = {
  title: 'Explore',
  description: 'Discover the latest and greatest electronic products',
};

const checkoutMetadata: Metadata = {
  title: 'Checkout',
  description: 'Review and complete your purchase',
};

const transferMetadata: Metadata = {
  title: 'Transfer',
  description:
    'Manage and process your fund transfers securely and efficiently',
};

const dashboardToPayMetadata: Metadata = {
  title: 'Dashboard - To Pay',
  description: 'View and manage your pending payments',
};

const dashboardToShipMetadata: Metadata = {
  title: 'Dashboard - To Ship',
  description: 'View and manage your orders waiting to be shipped',
};

const dashboardToReceiveMetadata: Metadata = {
  title: 'Dashboard - To Receive',
  description: 'Track your orders on their way to you',
};

const dashboardCancelOrderMetadata: Metadata = {
  title: 'Dashboard - Cancel Order',
  description: 'View and manage your canceled orders',
};

const profileMetadata: Metadata = {
  title: 'Profile',
  description: 'View and manage your profile information',
};

const addressMetadata: Metadata = {
  title: 'Address',
  description: 'View and manage your address information',
};
const createAddressMetadata: Metadata = {
  title: 'Create Address',
  description:
    'Add a new address to your profile for seamless deliveries and billing.',
};
const updateAddressMetadata: Metadata = {
  title: ' Update Address',
  description:
    'Modify your existing address details to ensure accurate deliveries and billing information.',
};
const myWishlistMetadata: Metadata = {
  title: 'My Wishlist',
  description: 'View and manage your wishlist items for future purchases',
};

//AUTH
const activationAccountMetadata: Metadata = {
  title: 'Activation Account',
  description: 'Activate your account to access all features',
};

const checkEmailMetadata: Metadata = {
  title: 'Check Email',
  description: 'Please check your email for further instructions',
};

const checkMailActivationMetadata: Metadata = {
  title: 'Check Mail Activation',
  description: 'Confirm your email address to activate your account',
};

const forgotPasswordMetadata: Metadata = {
  title: 'Forgot Password',
  description: 'Recover your password and regain access to your account',
};

const loginMetadata: Metadata = {
  title: 'Login',
  description: 'Access your account by logging in',
};

const registerMetadata: Metadata = {
  title: 'Register',
  description: 'Create a new account to get started',
};

const resetPasswordMetadata: Metadata = {
  title: 'Reset Password',
  description: 'Reset your password to regain access to your account',
};

const verifyMetadata: Metadata = {
  title: 'Verify',
  description: 'Verify your identity to secure your account',
};

//Admin
const adminUserMetadata: Metadata = {
  title: 'User Management',
  description: 'Manage warehouse admins and users in the system',
};

const superAdminUserCreateMetadata: Metadata = {
  title: 'Create Admin Warehouse',
  description:
    'Create a new Admin Warehouse account with specific roles and permissions',
};

const superAdminUserUpdateMetadata: Metadata = {
  title: 'Update Admin Warehouse',
  description:
    'Update existing Admin Warehouse account details and permissions',
};

const adminWarehouseMetadata: Metadata = {
  title: 'Warehouse Management',
  description: 'View and manage warehouse locations and details',
};

const adminWarehouseCreateMetadata: Metadata = {
  title: 'Create Warehouse',
  description: 'Add a new warehouse location to the system',
};

const adminWarehouseUpdateMetadata: Metadata = {
  title: 'Update Warehouse',
  description: 'Update details of existing warehouse locations',
};
const adminCategoryMetadata: Metadata = {
  title: 'Category Management',
  description: 'Organize and manage product categories for the inventory',
};
const adminCategoryCreateMetadata: Metadata = {
  title: 'Create Category',
  description: 'Create a new product category for the inventory',
};

const adminCategoryUpdateMetadata: Metadata = {
  title: 'Update Category',
  description: 'Update existing product category details',
};

const adminProductMetadata: Metadata = {
  title: 'Product Management',
  description: 'Add, update, and manage products in the inventory',
};

const adminProductCreateMetadata: Metadata = {
  title: 'Create Product',
  description: 'Add a new product to the inventory system',
};

const adminProductUpdateMetadata: Metadata = {
  title: 'Update Product',
  description: 'Update details of existing products in the inventory',
};

const adminInventoryMetadata: Metadata = {
  title: 'Inventory Management',
  description: 'Track and manage inventory levels and stock details',
};

const adminInventoryCreateMetadata: Metadata = {
  title: 'Create Inventory',
  description: 'Add new inventory items to the system',
};

const adminInventoryUpdateMetadata: Metadata = {
  title: 'Update Inventory',
  description: 'Update existing inventory item details',
};

const adminMutationMetadata: Metadata = {
  title: 'Mutation Management',
  description: 'Manage stock mutations and inventory adjustments',
};

const adminMutationWarehouseCreateMetadata: Metadata = {
  title: 'Create Mutation Warehouse',
  description:
    'Create a new warehouse mutation record for inventory adjustments',
};

const adminMutationWarehouseUpdateMetadata: Metadata = {
  title: 'Update Mutation Warehouse',
  description: 'Update details of existing warehouse mutation records',
};

export {
  defaultMetadata,
  homeMetadata,
  cartMetadata,
  exploreMetadata,
  checkoutMetadata,
  transferMetadata,
  dashboardToPayMetadata,
  dashboardToShipMetadata,
  dashboardToReceiveMetadata,
  dashboardCancelOrderMetadata,
  profileMetadata,
  addressMetadata,
  createAddressMetadata,
  updateAddressMetadata,
  activationAccountMetadata,
  checkEmailMetadata,
  checkMailActivationMetadata,
  forgotPasswordMetadata,
  loginMetadata,
  registerMetadata,
  resetPasswordMetadata,
  verifyMetadata,
  myWishlistMetadata,
  contactMetadata,
  aboutMetadata,
  adminCategoryMetadata,
  adminInventoryMetadata,
  adminMutationMetadata,
  adminProductMetadata,
  adminUserMetadata,
  adminWarehouseMetadata,
  adminCategoryCreateMetadata,
  adminCategoryUpdateMetadata,
  adminInventoryCreateMetadata,
  adminInventoryUpdateMetadata,
  superAdminUserCreateMetadata,
  superAdminUserUpdateMetadata,
  adminWarehouseCreateMetadata,
  adminWarehouseUpdateMetadata,
  adminProductCreateMetadata,
  adminProductUpdateMetadata,
  adminMutationWarehouseCreateMetadata,
  adminMutationWarehouseUpdateMetadata,
};
