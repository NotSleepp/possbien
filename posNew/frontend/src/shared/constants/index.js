/**
 * Application Constants
 * Centralized constants for the application
 */

// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  MANAGER: 3,
  CASHIER: 4,
  EMPLOYEE: 5,
};

// Role Names
export const ROLE_NAMES = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Administrador',
  [USER_ROLES.ADMIN]: 'Administrador',
  [USER_ROLES.MANAGER]: 'Gerente',
  [USER_ROLES.CASHIER]: 'Cajero',
  [USER_ROLES.EMPLOYEE]: 'Empleado',
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/usuarios/login',
    GOOGLE: '/auth/google',
    GOOGLE_CALLBACK: '/auth/google/callback',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
  },
  USERS: '/usuarios',
  PRODUCTS: '/productos',
  SALES: '/ventas',
  REPORTS: '/reportes',
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_DATA: 'user_data',
  THEME: 'theme',
  SIDEBAR_STATE: 'sidebar_state',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// Error Types
export const ERROR_TYPES = {
  AUTHENTICATION_ERROR: 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR: 'AUTHORIZATION_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NETWORK_ERROR: 'NETWORK_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
};

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Ha ocurrido un error. Por favor, intenta de nuevo.',
  NETWORK: 'Error de conexión. Verifica tu conexión a internet.',
  UNAUTHORIZED: 'No tienes autorización para realizar esta acción.',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  INVALID_CREDENTIALS: 'Credenciales inválidas. Verifica tu usuario y contraseña.',
  REQUIRED_FIELD: 'Este campo es requerido.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Inicio de sesión exitoso',
  LOGOUT: 'Sesión cerrada correctamente',
  SAVE: 'Guardado exitosamente',
  UPDATE: 'Actualizado exitosamente',
  DELETE: 'Eliminado exitosamente',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100],
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'DD/MM/YYYY',
  DISPLAY_WITH_TIME: 'DD/MM/YYYY HH:mm',
  API: 'YYYY-MM-DD',
  API_WITH_TIME: 'YYYY-MM-DDTHH:mm:ss',
};

export default {
  USER_ROLES,
  ROLE_NAMES,
  API_ENDPOINTS,
  STORAGE_KEYS,
  HTTP_STATUS,
  ERROR_TYPES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  DATE_FORMATS,
};