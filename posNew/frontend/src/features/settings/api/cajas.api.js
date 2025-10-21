import { api } from '../../../shared/api/api';

export const listCajasBySucursal = async (idSucursal) => {
  const { data } = await api.get(`/cajas/por-sucursal/${idSucursal}`);
  return data;
};

export const getCaja = async (id) => {
  const { data } = await api.get(`/cajas/${id}`);
  return data;
};

export const createCaja = async (payload) => {
  const { data } = await api.post('/cajas', payload);
  return data?.datos ?? data; // backend returns { mensaje, datos }
};

export const updateCaja = async (id, payload) => {
  const { data } = await api.put(`/cajas/${id}`, payload);
  return data?.datos ?? data;
};

export const deleteCaja = async (id) => {
  const { data } = await api.delete(`/cajas/${id}`);
  return data;
};