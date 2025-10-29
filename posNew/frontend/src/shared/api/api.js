import axios from 'axios';
import { useAuthStore } from '../../store/useAuthStore';
import { ERROR_TYPES } from '../constants';

export const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    console.log('[api.js] ========== REQUEST INTERCEPTOR ==========');
    console.log('[api.js] Method:', config.method?.toUpperCase());
    console.log('[api.js] URL:', config.url);
    console.log('[api.js] Full URL:', config.baseURL + config.url);
    console.log('[api.js] Headers:', config.headers);
    console.log('[api.js] Data:', config.data);
    console.log('[api.js] Data type:', typeof config.data);
    if (config.data) {
      console.log('[api.js] Data stringified:', JSON.stringify(config.data));
    }
    
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('[api.js] Token attached:', token.substring(0, 20) + '...');
    } else {
      console.log('[api.js] No token found');
    }
    
    console.log('[api.js] ========== END REQUEST INTERCEPTOR ==========');
    return config;
  },
  (error) => {
    console.error('[api.js] Request interceptor error:', error);
    return Promise.reject(transformError(error));
  }
);

// Response interceptor: handle errors and authentication
api.interceptors.response.use(
  (response) => {
    console.log('[api.js] ========== RESPONSE INTERCEPTOR SUCCESS ==========');
    console.log('[api.js] Status:', response.status);
    console.log('[api.js] Data:', response.data);
    console.log('[api.js] ========== END RESPONSE INTERCEPTOR ==========');
    return response;
  },
  (error) => {
    console.error('[api.js] ========== RESPONSE INTERCEPTOR ERROR ==========');
    console.error('[api.js] Error:', error);
    console.error('[api.js] Error message:', error.message);
    console.error('[api.js] Response status:', error.response?.status);
    console.error('[api.js] Response data:', error.response?.data);
    console.error('[api.js] Response headers:', error.response?.headers);
    console.error('[api.js] Request config:', error.config);
    
    const transformedError = transformError(error);
    console.error('[api.js] Transformed error:', transformedError);

    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401) {
      console.log('[api.js] Handling 401 - logging out user');
      const authStore = useAuthStore.getState();
      authStore.logout();
      
      // Redirect to login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.log('[api.js] Handling 403 - forbidden');
      transformedError.message = 'No tienes permisos para realizar esta acción';
      transformedError.userMessage = 'Acceso denegado. Contacta con tu administrador si necesitas acceso.';
    }

    console.error('[api.js] ========== END RESPONSE INTERCEPTOR ERROR ==========');
    return Promise.reject(transformedError);
  }
);

/**
 * Transform error into a consistent format for the application
 * @param {Error} error - The error object from axios
 * @returns {Object} Transformed error object
 */
function transformError(error) {
  // Network error (no response from server)
  if (!error.response) {
    return {
      type: ERROR_TYPES.NETWORK_ERROR,
      message: 'Error de conexión. Verifica tu conexión a internet.',
      userMessage: 'No se pudo conectar con el servidor. Por favor, verifica tu conexión a internet.',
      originalError: error,
      status: null,
    };
  }

  const { status, data } = error.response;

  const serverMessage = (
    data?.error?.message ||
    data?.error?.mensaje ||
    data?.mensaje ||
    data?.message ||
    data?.error ||
    error.message ||
    'Ha ocurrido un error'
  );

  // Create base error object
  const transformedError = {
    type: getErrorType(status, data),
    message: serverMessage,
    userMessage: getUserFriendlyMessage(status, data) || serverMessage,
    status,
    data,
    originalError: error,
  };

  return transformedError;
}

/**
 * Get error type based on HTTP status code and backend code
 * @param {number} status - HTTP status code
 * @param {Object} data - Response data
 * @returns {string} Error type
 */
function getErrorType(status, data) {
  const code = data?.error?.codigo;
  if (status === 401) return ERROR_TYPES.AUTHENTICATION_ERROR;
  if (status === 403) return ERROR_TYPES.AUTHORIZATION_ERROR;
  if (code === 'VALIDATION_ERROR') return ERROR_TYPES.VALIDATION_ERROR;
  if (status >= 400 && status < 500) return ERROR_TYPES.VALIDATION_ERROR;
  if (status >= 500) return ERROR_TYPES.SERVER_ERROR;
  return ERROR_TYPES.UNKNOWN_ERROR;
}

/**
 * Get user-friendly error message based on status and response data
 * @param {number} status - HTTP status code
 * @param {Object} data - Response data
 * @returns {string} User-friendly message
 */
function getUserFriendlyMessage(status, data) {
  // Prefer backend error message if provided
  const backendMessage = data?.error?.message || data?.error?.mensaje || data?.mensaje;
  if (backendMessage && typeof backendMessage === 'string') {
    return backendMessage;
  }

  // Default messages based on status code
  switch (status) {
    case 400:
      return 'Los datos enviados no son válidos. Por favor, verifica la información.';
    case 401:
      return 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
    case 403:
      return 'No tienes permisos para realizar esta acción.';
    case 404:
      return 'El recurso solicitado no fue encontrado.';
    case 409:
      return 'Ya existe un registro con estos datos.';
    case 422:
      return 'Los datos enviados no cumplen con los requisitos.';
    case 500:
      return 'Error del servidor. Por favor, intenta nuevamente más tarde.';
    case 503:
      return 'El servicio no está disponible temporalmente. Intenta más tarde.';
    default:
      return 'Ha ocurrido un error inesperado. Por favor, intenta nuevamente.';
  }
}