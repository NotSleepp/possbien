import { api } from '../../../shared/api/api';

export const listCategoriesByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/categorias/por-empresa/${idEmpresa}`);
  return data;
};

export const getCategory = async (id) => {
  const { data } = await api.get(`/categorias/${id}`);
  return data;
};

export const createCategory = async (payload) => {
  const { data } = await api.post('/categorias', payload);
  return data?.datos ?? data; // backend returns { mensaje, datos }
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/categorias/${id}`, payload);
  return data?.datos ?? data;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categorias/${id}`);
  return data;
};