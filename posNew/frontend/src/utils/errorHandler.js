/**
 * Error Handler Utilities
 * Helper functions for consistent error handling across the application
 */

import { ERROR_TYPES } from './constants';

/**
 * Check if error is an authentication error
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export function isAuthError(error) {
  return error?.type === ERROR_TYPES.AUTHENTICATION_ERROR || error?.status === 401;
}

/**
 * Check if error is an authorization error
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export function isAuthorizationError(error) {
  return error?.type === ERROR_TYPES.AUTHORIZATION_ERROR || error?.status === 403;
}

/**
 * Check if error is a validation error
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export function isValidationError(error) {
  return error?.type === ERROR_TYPES.VALIDATION_ERROR || (error?.status >= 400 && error?.status < 500);
}

/**
 * Check if error is a network error
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export function isNetworkError(error) {
  return error?.type === ERROR_TYPES.NETWORK_ERROR || !error?.status;
}

/**
 * Check if error is a server error
 * @param {Object} error - Error object
 * @returns {boolean}
 */
export function isServerError(error) {
  return error?.type === ERROR_TYPES.SERVER_ERROR || (error?.status >= 500);
}

/**
 * Get user-friendly error message from error object
 * @param {Object} error - Error object
 * @returns {string} User-friendly message
 */
export function getErrorMessage(error) {
  return error?.userMessage || error?.message || 'Ha ocurrido un error inesperado';
}

/**
 * Extract validation errors from error response
 * Useful for form validation
 * @param {Object} error - Error object
 * @returns {Object} Object with field names as keys and error messages as values
 */
export function getValidationErrors(error) {
  if (!isValidationError(error)) {
    return {};
  }

  const errors = {};
  
  // Formatos soportados: { errors: [{ field, message }] }, { errors: { field: message } }
  if (error.data?.errors && Array.isArray(error.data.errors)) {
    error.data.errors.forEach((err) => {
      if (err.field && err.message) {
        errors[err.field] = err.message;
      }
    });
  } else if (error.data?.errors && typeof error.data.errors === 'object') {
    Object.assign(errors, error.data.errors);
  }

  // Formato backend: { error: { codigo: 'VALIDATION_ERROR', ... }, detalles: { errores: [{ campo, mensaje }] } }
  const detalles = error.data?.error ? error.data : error.data; // compatible
  const erroresBackend = error.data?.detalles?.errores || detalles?.detalles?.errores;
  if (Array.isArray(erroresBackend)) {
    erroresBackend.forEach((err) => {
      const field = err.campo || err.field;
      const message = err.mensaje || err.message;
      if (field && message) {
        errors[field] = message;
      }
    });
  }

  return errors;
}

/**
 * Log error to console in development or to error tracking service in production
 * @param {Object} error - Error object
 * @param {string} context - Context where error occurred
 */
export function logError(error, context = '') {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error${context ? ` - ${context}` : ''}]:`, {
      type: error?.type,
      message: error?.message,
      status: error?.status,
      data: error?.data,
      originalError: error?.originalError,
    });
  } else {
    // In production, send to error tracking service (e.g., Sentry)
    // Sentry.captureException(error.originalError || error, { extra: { context } });
  }
}

/**
 * Handle API error with consistent logging and optional callback
 * @param {Object} error - Error object
 * @param {string} context - Context where error occurred
 * @param {Function} onError - Optional callback function
 */
export function handleApiError(error, context = '', onError = null) {
  logError(error, context);
  
  if (onError && typeof onError === 'function') {
    onError(error);
  }
  
  return error;
}

export default {
  isAuthError,
  isAuthorizationError,
  isValidationError,
  isNetworkError,
  isServerError,
  getErrorMessage,
  getValidationErrors,
  logError,
  handleApiError,
};
