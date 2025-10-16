// src/data/url.js

// URL cơ bản của API
export const BASE_URL_IMG = 'https://adminlt.tungocvan.com';
export const BASE_URL = 'https://adminlt.tungocvan.com/api';

// Các endpoint
const URLS = {
  LOGIN: `${BASE_URL}/login`,
  REGISTER: `${BASE_URL}/register`,
  LOGOUT: `${BASE_URL}/auth/logout`,
  PROFILE: `${BASE_URL}/user/profile`,
  USER: `${BASE_URL}/user`,
  USERS: `${BASE_URL}/users`,
  ROLES: `${BASE_URL}/roles`,
  PERMISSIONS: `${BASE_URL}/permissions`,
  PRODUCTS: `${BASE_URL}/products`,
  ORDERS: `${BASE_URL}/orders`,
  VERIFY: `${BASE_URL}/auth/google/verify`,
  // Thêm các url khác ở đây
};

// Nếu muốn export riêng lẻ từng URL
export const {
  LOGIN,
  REGISTER,
  LOGOUT,
  PROFILE,
  USER,
  USERS,
  ROLES,
  PERMISSIONS,
  PRODUCTS,
  ORDERS,
  VERIFY,
} = URLS;

// Export toàn bộ object
export default URLS;
