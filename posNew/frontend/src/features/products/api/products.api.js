import { api } from '../../../shared/api/api';
import { toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

// Create product
export const createProduct = async (payload) => {
  try {
    console.log('[products.api] CREATE start - payload:', payload);
    const { data, status } = await api.post('/productos', payload);
    console.log('[products.api] CREATE response status:', status);
    const result = toCamelCase(data?.datos ?? data);
    console.log('[products.api] CREATE result (camelCase):', result);
    return result;
  } catch (error) {
    console.error('[products.api] CREATE error:', error);
    throw handleApiError(error, 'createProduct');
  }
};

// Update product
export const updateProduct = async (id, payload) => {
  try {
    console.log('[products.api] UPDATE start - id:', id, 'payload:', payload);
    const { data, status } = await api.put(`/productos/${id}`, payload);
    console.log('[products.api] UPDATE response status:', status);
    const result = toCamelCase(data?.datos ?? data);
    console.log('[products.api] UPDATE result (camelCase):', result);
    return result;
  } catch (error) {
    console.error('[products.api] UPDATE error:', error);
    throw handleApiError(error, 'updateProduct');
  }
};