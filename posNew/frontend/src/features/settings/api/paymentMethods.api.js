import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

export const listPaymentMethodsByEmpresa = async (idEmpresa) => {
  try {
    const { data } = await api.get(`/metodos_pago/por-empresa/${idEmpresa}`);
    // Transformar respuesta de snake_case a camelCase
    return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'listPaymentMethodsByEmpresa');
  }
};

export const getPaymentMethod = async (id) => {
  try {
    const { data } = await api.get(`/metodos_pago/${id}`);
    // Transformar respuesta de snake_case a camelCase
    return toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'getPaymentMethod');
  }
};

export const createPaymentMethod = async (payload) => {
  try {
    // Transformar payload de camelCase a snake_case para el backend
    const transformedPayload = toSnakeCase(payload);
    const { data } = await api.post('/metodos_pago', transformedPayload);
    // Transformar respuesta de snake_case a camelCase
    return toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'createPaymentMethod');
  }
};

export const updatePaymentMethod = async (id, payload) => {
  try {
    // Transformar payload de camelCase a snake_case para el backend
    const transformedPayload = toSnakeCase(payload);
    const { data } = await api.put(`/metodos_pago/${id}`, transformedPayload);
    // Transformar respuesta de snake_case a camelCase
    return toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'updatePaymentMethod');
  }
};

export const deletePaymentMethod = async (id) => {
  try {
    const { data } = await api.delete(`/metodos_pago/${id}`);
    return data;
  } catch (error) {
    throw handleApiError(error, 'deletePaymentMethod');
  }
};