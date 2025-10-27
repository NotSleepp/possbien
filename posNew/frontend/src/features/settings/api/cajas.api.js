import { api } from '../../../shared/api/api';

export const listCajasBySucursal = async (idSucursal) => {
  console.log('[cajas.api] listCajasBySucursal - idSucursal:', idSucursal);
  try {
    const { data } = await api.get(`/cajas/por-sucursal/${idSucursal}`);
    console.log('[cajas.api] listCajasBySucursal - SUCCESS, data:', data);
    return data;
  } catch (error) {
    console.error('[cajas.api] listCajasBySucursal - ERROR:', error);
    console.error('[cajas.api] listCajasBySucursal - Error response:', error?.response);
    throw error;
  }
};

export const getCaja = async (id) => {
  console.log('[cajas.api] getCaja - id:', id);
  try {
    const { data } = await api.get(`/cajas/${id}`);
    console.log('[cajas.api] getCaja - SUCCESS, data:', data);
    return data;
  } catch (error) {
    console.error('[cajas.api] getCaja - ERROR:', error);
    console.error('[cajas.api] getCaja - Error response:', error?.response);
    throw error;
  }
};

export const createCaja = async (payload) => {
  console.log('[cajas.api] createCaja - STARTING');
  console.log('[cajas.api] createCaja - payload:', payload);
  console.log('[cajas.api] createCaja - payload types:', {
    idEmpresa: typeof payload.idEmpresa,
    idSucursal: typeof payload.idSucursal,
    codigo: typeof payload.codigo,
    nombre: typeof payload.nombre,
    descripcion: typeof payload.descripcion,
    saldoInicial: typeof payload.saldoInicial,
    print: typeof payload.print,
  });
  try {
    console.log('[cajas.api] createCaja - Making POST request to /cajas');
    const { data } = await api.post('/cajas', payload);
    console.log('[cajas.api] createCaja - SUCCESS! Response data:', data);
    const result = data?.datos ?? data;
    console.log('[cajas.api] createCaja - Returning:', result);
    return result;
  } catch (error) {
    console.error('[cajas.api] createCaja - ERROR occurred!');
    console.error('[cajas.api] createCaja - Error object:', error);
    console.error('[cajas.api] createCaja - Error message:', error?.message);
    console.error('[cajas.api] createCaja - Error response:', error?.response);
    console.error('[cajas.api] createCaja - Error response data:', error?.response?.data);
    console.error('[cajas.api] createCaja - Error response status:', error?.response?.status);
    throw error;
  }
};

export const updateCaja = async (id, payload) => {
  console.log('[cajas.api] updateCaja - STARTING');
  console.log('[cajas.api] updateCaja - id:', id);
  console.log('[cajas.api] updateCaja - payload:', payload);
  console.log('[cajas.api] updateCaja - payload types:', {
    idEmpresa: typeof payload.idEmpresa,
    idSucursal: typeof payload.idSucursal,
    codigo: typeof payload.codigo,
    nombre: typeof payload.nombre,
    descripcion: typeof payload.descripcion,
    saldoInicial: typeof payload.saldoInicial,
    print: typeof payload.print,
  });
  try {
    console.log('[cajas.api] updateCaja - Making PUT request to /cajas/' + id);
    const { data } = await api.put(`/cajas/${id}`, payload);
    console.log('[cajas.api] updateCaja - SUCCESS! Response data:', data);
    const result = data?.datos ?? data;
    console.log('[cajas.api] updateCaja - Returning:', result);
    return result;
  } catch (error) {
    console.error('[cajas.api] updateCaja - ERROR occurred!');
    console.error('[cajas.api] updateCaja - Error object:', error);
    console.error('[cajas.api] updateCaja - Error message:', error?.message);
    console.error('[cajas.api] updateCaja - Error response:', error?.response);
    console.error('[cajas.api] updateCaja - Error response data:', error?.response?.data);
    console.error('[cajas.api] updateCaja - Error response status:', error?.response?.status);
    throw error;
  }
};

export const deleteCaja = async (id) => {
  console.log('[cajas.api] deleteCaja - id:', id);
  try {
    const { data } = await api.delete(`/cajas/${id}`);
    console.log('[cajas.api] deleteCaja - SUCCESS, data:', data);
    return data;
  } catch (error) {
    console.error('[cajas.api] deleteCaja - ERROR:', error);
    console.error('[cajas.api] deleteCaja - Error response:', error?.response);
    throw error;
  }
};