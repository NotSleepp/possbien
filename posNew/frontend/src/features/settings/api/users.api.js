import { api } from '../../../shared/api/api';

export const listUsersByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/usuarios/por-empresa/${idEmpresa}`);
  return data;
};

export const getUser = async (id) => {
  const { data } = await api.get(`/usuarios/${id}`);
  return data;
};

export const createUser = async (payload) => {
  const { data } = await api.post('/usuarios', payload);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await api.put(`/usuarios/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
};

export const resetPassword = async (id, payload) => {
  const { data } = await api.post(`/usuarios/${id}/reset-password`, payload);
  return data;
};
