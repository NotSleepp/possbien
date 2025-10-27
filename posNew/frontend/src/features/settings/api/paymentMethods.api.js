import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';

export const listPaymentMethodsByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/metodos_pago/por-empresa/${idEmpresa}`);
  // Transformar respuesta de snake_case a camelCase
  return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
};

export const getPaymentMethod = async (id) => {
  const { data } = await api.get(`/metodos_pago/${id}`);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const createPaymentMethod = async (payload) => {
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  const { data } = await api.post('/metodos_pago', transformedPayload);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const updatePaymentMethod = async (id, payload) => {
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  const { data } = await api.put(`/metodos_pago/${id}`, transformedPayload);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const deletePaymentMethod = async (id) => {
  const { data } = await api.delete(`/metodos_pago/${id}`);
  return data;
};