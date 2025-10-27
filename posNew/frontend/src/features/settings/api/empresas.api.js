import { api } from '../../../shared/api/api';

export const getEmpresa = async (id) => {
  const { data } = await api.get(`/empresas/${id}`);
  return data;
};
