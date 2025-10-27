import { api } from '../../../shared/api/api';

export const listRolesByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/roles/por-empresa/${idEmpresa}`);
  return data;
};

export const getRole = async (id) => {
  const { data } = await api.get(`/roles/${id}`);
  return data;
};

export const createRole = async (payload) => {
  const { data } = await api.post('/roles', payload);
  return data;
};

export const updateRole = async (id, payload) => {
  const { data } = await api.put(`/roles/${id}`, payload);
  return data;
};

export const deleteRole = async (id) => {
  const { data } = await api.delete(`/roles/${id}`);
  return data;
};
