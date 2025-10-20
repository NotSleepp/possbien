import { api } from '../../../shared/api/api';

export const listPrintersByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/impresoras/por-empresa/${idEmpresa}`);
  return data;
};

export const getPrinter = async (id) => {
  const { data } = await api.get(`/impresoras/${id}`);
  return data;
};

export const createPrinter = async (payload) => {
  const { data } = await api.post('/impresoras', payload);
  return data;
};

export const updatePrinter = async (id, payload) => {
  const { data } = await api.put(`/impresoras/${id}`, payload);
  return data;
};

export const deletePrinter = async (id) => {
  const { data } = await api.delete(`/impresoras/${id}`);
  return data;
};