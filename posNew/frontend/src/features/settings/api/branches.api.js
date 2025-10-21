import { api } from '../../../shared/api/api';

export const listBranchesByEmpresa = async (idEmpresa) => {
  const { data } = await api.get(`/sucursales/por-empresa/${idEmpresa}`);
  return data;
};