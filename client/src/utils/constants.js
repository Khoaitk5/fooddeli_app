// Roles
export const ROLES = {
  ADMIN: 'admin',
  SHOP: 'shop',
  CUSTOMER: 'customer',
  SHIPPER: 'shipper',
};

// API Endpoints (tương đối, vì baseURL đã set trong api.js)
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  PRODUCTS: '/products',
  ORDERS: '/orders',
  USERS: '/users',
  CART: '/cart',
  NOTIFICATIONS: '/notifications',
};

// Other constants
export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
};