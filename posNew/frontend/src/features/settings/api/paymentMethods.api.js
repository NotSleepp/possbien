import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

const log = (...args) => console.log('[paymentMethods.api]', ...args);

export const listPaymentMethodsByEmpresa = async (idEmpresa) => {
  try {
    log('listPaymentMethodsByEmpresa: request', { idEmpresa });
    const { data } = await api.get(`/metodos_pago/por-empresa/${idEmpresa}`);
    // Transformar respuesta de snake_case a camelCase
    const result = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    log('listPaymentMethodsByEmpresa: response', { raw: data, mapped: result });
    return result;
  } catch (error) {
    log('listPaymentMethodsByEmpresa: error', error);
    throw handleApiError(error, 'listPaymentMethodsByEmpresa');
  }
};

export const getPaymentMethod = async (id) => {
  try {
    log('getPaymentMethod: request', { id });
    const { data } = await api.get(`/metodos_pago/${id}`);
    // Transformar respuesta de snake_case a camelCase
    const result = toCamelCase(data);
    log('getPaymentMethod: response', { raw: data, mapped: result });
    return result;
  } catch (error) {
    log('getPaymentMethod: error', error);
    throw handleApiError(error, 'getPaymentMethod');
  }
};

export const createPaymentMethod = async (payload) => {
  try {
    // Transformar payload de camelCase a snake_case para el backend
    const transformedPayload = toSnakeCase(payload);
    log('createPaymentMethod: request (frontend)', payload);
    log('createPaymentMethod: request (backend-mapped)', transformedPayload);
    const { data } = await api.post('/metodos_pago', transformedPayload);
    // Transformar respuesta de snake_case a camelCase
    const result = toCamelCase(data);
    log('createPaymentMethod: response', { raw: data, mapped: result });
    return result;
  } catch (error) {
    log('createPaymentMethod: error', error);
    throw handleApiError(error, 'createPaymentMethod');
  }
};

export const updatePaymentMethod = async (id, payload) => {
  try {
    // Transformar payload de camelCase a snake_case para el backend
    const transformedPayload = toSnakeCase(payload);
    log('updatePaymentMethod: request (frontend)', { id, payload });
    log('updatePaymentMethod: request (backend-mapped)', { id, transformedPayload });
    const { data } = await api.put(`/metodos_pago/${id}`, transformedPayload);
    // Transformar respuesta de snake_case a camelCase
    const result = toCamelCase(data);
    log('updatePaymentMethod: response', { raw: data, mapped: result });
    return result;
  } catch (error) {
    log('updatePaymentMethod: error', error);
    throw handleApiError(error, 'updatePaymentMethod');
  }
};

export const deletePaymentMethod = async (id) => {
  try {
    log('deletePaymentMethod: request', { id });
    const { data } = await api.delete(`/metodos_pago/${id}`);
    log('deletePaymentMethod: response', data);
    return data;
  } catch (error) {
    log('deletePaymentMethod: error', error);
    throw handleApiError(error, 'deletePaymentMethod');
  }
};