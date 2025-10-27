import { api } from '../../../shared/api/api';

export const listPermissionsByRole = async (idRol) => {
  const { data } = await api.get(`/permisos/por-rol/${idRol}`);
  return data;
};

export const assignPermissions = async (payload) => {
  const { data } = await api.post('/permisos/asignar', payload);
  return data;
};

export const updatePermission = async (id, payload) => {
  const { data } = await api.put(`/permisos/${id}`, payload);
  return data;
};

export const deletePermission = async (id) => {
  const { data } = await api.delete(`/permisos/${id}`);
  return data;
};

// Obtener lista de módulos disponibles
export const listModules = async () => {
  const { data } = await api.get('/modulos');
  return data;
};
