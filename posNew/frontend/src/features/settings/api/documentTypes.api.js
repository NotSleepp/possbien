import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';

export const listDocumentTypesByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/tipos-comprobante/por-empresa/${idEmpresa}`);
  // Transformar respuesta de snake_case a camelCase
  return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
};

export const getDocumentType = async (id) => {
  const { data } = await api.get(`/tipos-comprobante/${id}`);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const createDocumentType = async (payload) => {
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  const { data } = await api.post('/tipos-comprobante', transformedPayload);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const updateDocumentType = async (id, payload) => {
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  const { data } = await api.put(`/tipos-comprobante/${id}`, transformedPayload);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const deleteDocumentType = async (id) => {
  const { data } = await api.delete(`/tipos-comprobante/${id}`);
  return data;
};
