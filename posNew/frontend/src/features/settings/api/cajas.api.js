import { api } from '../../../shared/api/api';
import { toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

export const listCajasBySucursal = async (idSucursal) => {
  try {
    const { data } = await api.get(`/cajas/por-sucursal/${idSucursal}`);
    // Transformar respuesta de snake_case a camelCase
    return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'listCajasBySucursal');
  }
};

export const getCaja = async (id) => {
  try {
    const { data } = await api.get(`/cajas/${id}`);
    return toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'getCaja');
  }
};

export const createCaja = async (payload) => {
  try {
    // Backend espera camelCase según DTO (esquemaCrearCaja)
    const { data } = await api.post('/cajas', payload);
    return toCamelCase(data?.datos ?? data);
  } catch (error) {
    throw handleApiError(error, 'createCaja');
  }
};

export const updateCaja = async (id, payload) => {
  try {
    // Backend espera camelCase según DTO (esquemaActualizarCaja)
    const { data } = await api.put(`/cajas/${id}`, payload);
    return toCamelCase(data?.datos ?? data);
  } catch (error) {
    throw handleApiError(error, 'updateCaja');
  }
};

export const deleteCaja = async (id) => {
  try {
    const { data } = await api.delete(`/cajas/${id}`);
    return data;
  } catch (error) {
    throw handleApiError(error, 'deleteCaja');
  }
};