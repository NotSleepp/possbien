import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

// Helpers de mapeo para backend (snake_case)
const toBackendCreatePayload = (payload) => {
  const cleaned = {
    idEmpresa: payload?.idEmpresa != null ? Number(payload.idEmpresa) : undefined,
    nombre: payload?.nombre?.trim(),
    ...(payload?.descripcion && payload.descripcion.trim() ? { descripcion: payload.descripcion.trim() } : {}),
    ...(payload?.activo !== undefined ? { activo: Boolean(payload.activo) } : {}),
  };
  return toSnakeCase(cleaned);
};

const toBackendUpdatePayload = (payload) => {
  const cleaned = {
    nombre: payload?.nombre?.trim(),
    ...(payload?.descripcion && payload.descripcion.trim() ? { descripcion: payload.descripcion.trim() } : {}),
    ...(payload?.activo !== undefined ? { activo: Boolean(payload.activo) } : {}),
  };
  return toSnakeCase(cleaned);
};

export const listRolesByEmpresa = async (idEmpresa) => {
  console.log('[roles.api] listRolesByEmpresa - idEmpresa:', idEmpresa);
  try {
    const { data } = await api.get(`/roles/por-empresa/${idEmpresa}`);
    console.log('[roles.api] listRolesByEmpresa - SUCCESS, raw data:', data);
    const transformed = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    console.log('[roles.api] listRolesByEmpresa - Transformed (camelCase):', transformed);
    return transformed;
  } catch (error) {
    console.error('[roles.api] listRolesByEmpresa - ERROR:', error);
    throw handleApiError(error, 'listRolesByEmpresa');
  }
};

export const getRole = async (id) => {
  console.log('[roles.api] getRole - id:', id);
  try {
    const { data } = await api.get(`/roles/${id}`);
    console.log('[roles.api] getRole - SUCCESS, raw data:', data);
    return toCamelCase(data);
  } catch (error) {
    console.error('[roles.api] getRole - ERROR:', error);
    throw handleApiError(error, 'getRole');
  }
};

export const createRole = async (payload) => {
  console.group('[roles.api] createRole');
  console.log('[roles.api] createRole - payload (frontend camelCase):', payload);
  const backendPayload = toBackendCreatePayload(payload);
  console.log('[roles.api] createRole - payload (backend snake_case):', backendPayload);
  try {
    const { data } = await api.post('/roles', backendPayload);
    console.log('[roles.api] createRole - SUCCESS, raw data:', data);
    const transformed = toCamelCase(data);
    console.log('[roles.api] createRole - Transformed (camelCase):', transformed);
    console.groupEnd();
    return transformed;
  } catch (error) {
    console.error('[roles.api] createRole - ERROR:', error);
    console.groupEnd();
    throw handleApiError(error, 'createRole');
  }
};

export const updateRole = async (id, payload) => {
  console.group('[roles.api] updateRole');
  console.log('[roles.api] updateRole - id:', id);
  console.log('[roles.api] updateRole - payload (frontend camelCase):', payload);
  const backendPayload = toBackendUpdatePayload(payload);
  console.log('[roles.api] updateRole - payload (backend snake_case):', backendPayload);
  try {
    const { data } = await api.put(`/roles/${id}`, backendPayload);
    console.log('[roles.api] updateRole - SUCCESS, raw data:', data);
    const transformed = toCamelCase(data);
    console.log('[roles.api] updateRole - Transformed (camelCase):', transformed);
    console.groupEnd();
    return transformed;
  } catch (error) {
    console.error('[roles.api] updateRole - ERROR:', error);
    console.groupEnd();
    throw handleApiError(error, 'updateRole');
  }
};

export const deleteRole = async (id) => {
  console.log('[roles.api] deleteRole - id:', id);
  try {
    const { data } = await api.delete(`/roles/${id}`);
    console.log('[roles.api] deleteRole - SUCCESS, raw data:', data);
    return data;
  } catch (error) {
    console.error('[roles.api] deleteRole - ERROR:', error);
    throw handleApiError(error, 'deleteRole');
  }
};
