import { api } from '../../../shared/api/api';
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

// Helper para construir payload de asignación masiva al backend (snake_case)
const toBackendAssignPayload = (payload) => {
  const permisosLimpios = Array.isArray(payload?.permisos)
    ? payload.permisos.map((p) => ({
        idEmpresa: p?.idEmpresa != null ? Number(p.idEmpresa) : undefined,
        idRol: p?.idRol != null ? Number(p.idRol) : undefined,
        idModulo: p?.idModulo != null ? Number(p.idModulo) : undefined,
        puedeVer: Boolean(p?.puedeVer),
        puedeCrear: Boolean(p?.puedeCrear),
        puedeEditar: Boolean(p?.puedeEditar),
        puedeEliminar: Boolean(p?.puedeEliminar),
      }))
    : [];

  const cleaned = {
    idEmpresa: payload?.idEmpresa != null ? Number(payload.idEmpresa) : undefined,
    idRol: payload?.idRol != null ? Number(payload.idRol) : undefined,
    permisos: permisosLimpios,
  };
  return toSnakeCase(cleaned);
};

export const listPermissionsByRole = async (idRol) => {
  console.log('[permissions.api] listPermissionsByRole - idRol:', idRol);
  try {
    const { data } = await api.get(`/permisos/por-rol/${idRol}`);
    console.log('[permissions.api] listPermissionsByRole - SUCCESS, raw data:', data);
    const transformed = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    console.log('[permissions.api] listPermissionsByRole - Transformed (camelCase):', transformed);
    return transformed;
  } catch (error) {
    console.error('[permissions.api] listPermissionsByRole - ERROR:', error);
    throw handleApiError(error, 'listPermissionsByRole');
  }
};

export const assignPermissions = async (payload) => {
  console.group('[permissions.api] assignPermissions');
  console.log('[permissions.api] assignPermissions - payload (frontend camelCase):', payload);
  const backendPayload = toBackendAssignPayload(payload);
  console.log('[permissions.api] assignPermissions - payload (backend snake_case, masivo):', backendPayload);
  try {
    const { data } = await api.post('/permisos/actualizar-masivo', backendPayload);
    console.log('[permissions.api] assignPermissions - SUCCESS, raw data:', data);
    const transformed = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    console.log('[permissions.api] assignPermissions - Transformed (camelCase):', transformed);
    console.groupEnd();
    return transformed;
  } catch (error) {
    console.error('[permissions.api] assignPermissions - ERROR:', error);
    console.groupEnd();
    throw handleApiError(error, 'assignPermissions');
  }
};

export const updatePermission = async (id, payload) => {
  console.group('[permissions.api] updatePermission');
  console.log('[permissions.api] updatePermission - id:', id);
  console.log('[permissions.api] updatePermission - payload (frontend camelCase):', payload);
  try {
    const { data } = await api.put(`/permisos/${id}`, payload);
    console.log('[permissions.api] updatePermission - SUCCESS, raw data:', data);
    const transformed = toCamelCase(data);
    console.log('[permissions.api] updatePermission - Transformed (camelCase):', transformed);
    console.groupEnd();
    return transformed;
  } catch (error) {
    console.error('[permissions.api] updatePermission - ERROR:', error);
    console.groupEnd();
    throw handleApiError(error, 'updatePermission');
  }
};

export const deletePermission = async (id) => {
  console.log('[permissions.api] deletePermission - id:', id);
  try {
    const { data } = await api.delete(`/permisos/${id}`);
    console.log('[permissions.api] deletePermission - SUCCESS, raw data:', data);
    return data;
  } catch (error) {
    console.error('[permissions.api] deletePermission - ERROR:', error);
    throw handleApiError(error, 'deletePermission');
  }
};

// Obtener lista de módulos disponibles
export const listModules = async () => {
  console.log('[permissions.api] listModules - fetching');
  try {
    const { data } = await api.get('/modulos');
    console.log('[permissions.api] listModules - SUCCESS, raw data:', data);
    const transformed = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    console.log('[permissions.api] listModules - Transformed (camelCase):', transformed);
    return transformed;
  } catch (error) {
    console.error('[permissions.api] listModules - ERROR:', error);
    throw handleApiError(error, 'listModules');
  }
};
