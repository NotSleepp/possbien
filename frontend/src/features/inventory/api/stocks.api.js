import { api } from '../../../shared/api/api';
import { toCamelCase, toSnakeCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

// Create stock record (initial or manual)
export const createStock = async (payload) => {
  try {
    const backendPayload = toSnakeCase(payload);
    const { data, status } = await api.post('/stocks', backendPayload);
    const result = toCamelCase(data?.datos ?? data);
    return result;
  } catch (error) {
    throw handleApiError(error, 'createStock');
  }
};

// Get stocks by product id
export const getStocksByProduct = async (idProducto) => {
  try {
    const { data } = await api.get(`/stocks/por-producto/${idProducto}`);
    return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'getStocksByProduct');
  }
};

// Get stocks by warehouse id
export const getStocksByWarehouse = async (idAlmacen) => {
  try {
    const { data } = await api.get(`/stocks/por-almacen/${idAlmacen}`);
    return Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'getStocksByWarehouse');
  }
};

// Update stock by id
export const updateStock = async (id, payload) => {
  try {
    const backendPayload = toSnakeCase(payload);
    const { data } = await api.put(`/stocks/${id}`, backendPayload);
    return toCamelCase(data?.datos ?? data);
  } catch (error) {
    throw handleApiError(error, 'updateStock');
  }
};

export default {
  createStock,
  getStocksByProduct,
  getStocksByWarehouse,
  updateStock,
};

// EOF