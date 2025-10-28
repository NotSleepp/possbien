import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

// Create product
export const createProduct = async (payload) => {
  try {
    const backendPayload = toSnakeCase(payload);
    const { data } = await api.post('/productos', backendPayload);
    return toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'createProduct');
  }
};

// Update product
export const updateProduct = async (id, payload) => {
  try {
    const backendPayload = toSnakeCase(payload);
    const { data } = await api.put(`/productos/${id}`, backendPayload);
    return toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'updateProduct');
  }
};