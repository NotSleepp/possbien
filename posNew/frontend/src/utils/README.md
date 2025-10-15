# Utilities

This directory contains utility functions and constants used throughout the application.

## Files

### constants.js
Centralized constants for the application including:
- User roles and role names
- API endpoints
- Storage keys
- HTTP status codes
- Error types
- Error and success messages
- Pagination defaults
- Date formats

### errorHandler.js
Error handling utilities for consistent error management across the application.

#### Usage Examples

```javascript
import { api } from '../features/auth/api/api';
import { getErrorMessage, isValidationError, getValidationErrors, handleApiError } from '../utils/errorHandler';

// Example 1: Basic error handling
async function fetchProducts() {
  try {
    const response = await api.get('/productos');
    return response.data;
  } catch (error) {
    // Get user-friendly error message
    const message = getErrorMessage(error);
    console.error(message);
    throw error;
  }
}

// Example 2: Form validation errors
async function createProduct(productData) {
  try {
    const response = await api.post('/productos', productData);
    return response.data;
  } catch (error) {
    if (isValidationError(error)) {
      // Extract field-specific validation errors
      const validationErrors = getValidationErrors(error);
      // validationErrors = { nombre: 'El nombre es requerido', precio: 'El precio debe ser mayor a 0' }
      return { success: false, errors: validationErrors };
    }
    throw error;
  }
}

// Example 3: Using handleApiError with callback
async function deleteProduct(id) {
  try {
    await api.delete(`/productos/${id}`);
    return { success: true };
  } catch (error) {
    handleApiError(error, 'deleteProduct', (err) => {
      // Custom error handling
      if (err.status === 404) {
        console.log('Product not found');
      }
    });
    return { success: false };
  }
}
```

## API Client

The API client (`src/features/auth/api/api.js`) is configured with interceptors that:

1. **Request Interceptor**: Automatically attaches JWT token to all requests
2. **Response Interceptor**: 
   - Handles 401 errors with automatic logout and redirect to login
   - Handles 403 errors with appropriate messaging
   - Transforms all errors into a consistent format

### Error Object Structure

All API errors are transformed into the following structure:

```javascript
{
  type: 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'VALIDATION_ERROR' | 'NETWORK_ERROR' | 'SERVER_ERROR' | 'UNKNOWN_ERROR',
  message: 'Technical error message',
  userMessage: 'User-friendly error message',
  status: 401, // HTTP status code or null for network errors
  data: {}, // Response data from server
  originalError: Error // Original axios error object
}
```

### Automatic Error Handling

The API client automatically handles:
- **401 Unauthorized**: Logs out user and redirects to login page
- **403 Forbidden**: Adds user-friendly message about insufficient permissions
- **Network errors**: Provides clear message about connection issues
- **All other errors**: Transforms into consistent format with user-friendly messages
