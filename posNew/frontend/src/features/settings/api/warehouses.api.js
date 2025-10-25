import { api } from '../../../shared/api/api';

export const listWarehousesByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/almacenes/por-empresa/${idEmpresa}`);
  return data;
};

export const getWarehouse = async (id) => {
  const { data } = await api.get(`/almacenes/${id}`);
  return data;
};

export const createWarehouse = async (payload) => {
  const { data } = await api.post('/almacenes', payload);
  return data?.datos ?? data; // backend may return { mensaje, datos }
};

export const updateWarehouse = async (id, payload) => {
  const { data } = await api.put(`/almacenes/${id}`, payload);
  return data?.datos ?? data;
};

export const deleteWarehouse = async (id) => {
  const { data } = await api.delete(`/almacenes/${id}`);
  return data;
};