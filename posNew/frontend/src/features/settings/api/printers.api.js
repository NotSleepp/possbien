import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';

export const listPrintersByEmpresa = async (idEmpresa) => {
  console.log('[printers.api] listPrintersByEmpresa - idEmpresa:', idEmpresa);
  try {
    const { data } = await api.get(`/impresoras/por-empresa/${idEmpresa}`);
    console.log('[printers.api] listPrintersByEmpresa - SUCCESS, data:', data);
    // Transformar respuesta de snake_case a camelCase
    const transformedData = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    return transformedData;
  } catch (error) {
    console.error('[printers.api] listPrintersByEmpresa - ERROR:', error);
    throw error;
  }
};

export const getPrinter = async (id) => {
  console.log('[printers.api] getPrinter - id:', id);
  try {
    const { data } = await api.get(`/impresoras/${id}`);
    console.log('[printers.api] getPrinter - SUCCESS, data:', data);
    // Transformar respuesta de snake_case a camelCase
    return toCamelCase(data);
  } catch (error) {
    console.error('[printers.api] getPrinter - ERROR:', error);
    throw error;
  }
};

export const createPrinter = async (payload) => {
  console.log('[printers.api] createPrinter - STARTING');
  console.log('[printers.api] createPrinter - payload (camelCase):', payload);
  
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  console.log('[printers.api] createPrinter - transformedPayload (snake_case):', transformedPayload);
  
  try {
    console.log('[printers.api] createPrinter - Making POST request to /impresoras');
    const { data } = await api.post('/impresoras', transformedPayload);
    console.log('[printers.api] createPrinter - SUCCESS! Response data:', data);
    // Transformar respuesta de snake_case a camelCase
    return toCamelCase(data);
  } catch (error) {
    console.error('[printers.api] createPrinter - ERROR occurred!');
    console.error('[printers.api] createPrinter - Error:', error);
    console.error('[printers.api] createPrinter - Error response:', error?.response);
    console.error('[printers.api] createPrinter - Error response data:', error?.response?.data);
    throw error;
  }
};

export const updatePrinter = async (id, payload) => {
  console.log('[printers.api] updatePrinter - STARTING');
  console.log('[printers.api] updatePrinter - id:', id);
  console.log('[printers.api] updatePrinter - payload (camelCase):', payload);
  
  // Transformar payload de camelCase a snake_case para el backend
  const transformedPayload = toSnakeCase(payload);
  console.log('[printers.api] updatePrinter - transformedPayload (snake_case):', transformedPayload);
  
  try {
    console.log('[printers.api] updatePrinter - Making PUT request to /impresoras/' + id);
    const { data } = await api.put(`/impresoras/${id}`, transformedPayload);
    console.log('[printers.api] updatePrinter - SUCCESS! Response data:', data);
    // Transformar respuesta de snake_case a camelCase
    return toCamelCase(data);
  } catch (error) {
    console.error('[printers.api] updatePrinter - ERROR occurred!');
    console.error('[printers.api] updatePrinter - Error:', error);
    console.error('[printers.api] updatePrinter - Error response:', error?.response);
    throw error;
  }
};

export const deletePrinter = async (id) => {
  console.log('[printers.api] deletePrinter - id:', id);
  try {
    const { data } = await api.delete(`/impresoras/${id}`);
    console.log('[printers.api] deletePrinter - SUCCESS, data:', data);
    return data;
  } catch (error) {
    console.error('[printers.api] deletePrinter - ERROR:', error);
    throw error;
  }
};

export const testPrinter = async (id) => {
  console.log('[printers.api] testPrinter - id:', id);
  try {
    const { data } = await api.post(`/impresoras/${id}/test`);
    console.log('[printers.api] testPrinter - SUCCESS, data:', data);
    return data;
  } catch (error) {
    console.error('[printers.api] testPrinter - ERROR:', error);
    throw error;
  }
};