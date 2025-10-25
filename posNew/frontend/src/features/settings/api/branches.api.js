import { api } from '../../../shared/api/api';

export const listBranchesByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/sucursales/por-empresa/${idEmpresa}`);
  return data;
};

export const getBranch = async (id) => {
  const { data } = await api.get(`/sucursales/${id}`);
  return data;
};

export const createBranch = async (payload) => {
  const { data } = await api.post('/sucursales', payload);
  return data?.datos ?? data; // backend returns { mensaje, datos }
};

export const updateBranch = async (id, payload) => {
  const { data } = await api.put(`/sucursales/${id}`, payload);
  return data?.datos ?? data;
};

export const deleteBranch = async (id) => {
  const { data } = await api.delete(`/sucursales/${id}`);
  return data;
};