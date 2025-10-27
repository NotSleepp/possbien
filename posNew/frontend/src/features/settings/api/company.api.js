import { api } from '../../../shared/api/api';

/**
 * API calls para gestión de empresas
 */

export const getCompany = async (id) => {
  const { data } = await api.get(`/empresas/${id}`);
  return data;
};

export const updateCompany = async (id, payload) => {
  const { data } = await api.put(`/empresas/${id}`, payload);
  return data?.datos ?? data;
};

export const listCompanies = async () => {
  const { data } = await api.get('/empresas');
  return data;
};

export const createCompany = async (payload) => {
  const { data } = await api.post('/empresas', payload);
  return data?.datos ?? data;
};
