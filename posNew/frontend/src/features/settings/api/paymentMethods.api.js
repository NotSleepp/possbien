import { api } from '../../../shared/api/api';

export const listPaymentMethodsByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/metodos_pago/por-empresa/${idEmpresa}`);
  return data;
};

export const getPaymentMethod = async (id) => {
  const { data } = await api.get(`/metodos_pago/${id}`);
  return data;
};

export const createPaymentMethod = async (payload) => {
  const { data } = await api.post('/metodos_pago', payload);
  return data;
};

export const updatePaymentMethod = async (id, payload) => {
  const { data } = await api.put(`/metodos_pago/${id}`, payload);
  return data;
};

export const deletePaymentMethod = async (id) => {
  const { data } = await api.delete(`/metodos_pago/${id}`);
  return data;
};