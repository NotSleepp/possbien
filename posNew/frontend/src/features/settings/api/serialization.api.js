import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';

export const listSerializationsByBranch = async (idSucursal) => {
  const { data } = await api.get(`/serializacion-comprobantes/por-sucursal/${idSucursal}`);
  // Transformar respuesta de snake_case a camelCase
  return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
};

export const listSerializationsByType = async (idTipoComprobante) => {
  const { data } = await api.get(`/serializacion-comprobantes/por-tipo/${idTipoComprobante}`);
  // Transformar respuesta de snake_case a camelCase
  return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
};

export const getSerialization = async (id) => {
  const { data } = await api.get(`/serializacion-comprobantes/${id}`);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const createSerialization = async (payload) => {
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  const { data } = await api.post('/serializacion-comprobantes', transformedPayload);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const updateSerialization = async (id, payload) => {
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  const { data } = await api.put(`/serializacion-comprobantes/${id}`, transformedPayload);
  // Transformar respuesta de snake_case a camelCase
  return toCamelCase(data);
};

export const deleteSerialization = async (id) => {
  const { data } = await api.delete(`/serializacion-comprobantes/${id}`);
  return data;
};
