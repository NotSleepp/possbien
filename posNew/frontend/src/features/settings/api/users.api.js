import { api } from '../../../shared/api/api';

const log = (...args) => console.log('[users.api]', ...args);

// Helpers para mapear payload a snake_case y limpiar opcionales
const normalizeOptionalString = (v) => (v === '' || v === undefined ? undefined : v);
const normalizeOptionalNumber = (v) => {
  if (v === '' || v === undefined) return undefined;
  if (v === null) return null;
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
};

const toBackendCreatePayload = (p) => ({
  id_empresa: Number(p.idEmpresa),
  id_rol: Number(p.idRol),
  username: p.username,
  password: p.password,
  nombres: p.nombres,
  apellidos: p.apellidos,
  email: normalizeOptionalString(p.email),
  telefono: normalizeOptionalString(p.telefono),
  id_tipodocumento: normalizeOptionalNumber(p.idTipodocumento),
  nro_doc: normalizeOptionalString(p.nroDoc),
  tema: p.tema,
  estado: p.estado,
  activo: p.activo,
});

const toBackendUpdatePayload = (p) => {
  const out = {
    id_rol: p.idRol !== undefined ? Number(p.idRol) : undefined,
    username: normalizeOptionalString(p.username),
    nombres: normalizeOptionalString(p.nombres),
    apellidos: normalizeOptionalString(p.apellidos),
    email: normalizeOptionalString(p.email),
    telefono: normalizeOptionalString(p.telefono),
    id_tipodocumento: normalizeOptionalNumber(p.idTipodocumento),
    nro_doc: normalizeOptionalString(p.nroDoc),
    tema: normalizeOptionalString(p.tema),
    estado: normalizeOptionalString(p.estado),
    activo: p.activo,
  };
  // En update, si password es cadena vacía, NO enviar el campo
  if (p.password && p.password.trim() !== '') {
    out.password = p.password;
  }
  return out;
};

export const listUsersByEmpresa = async (idEmpresa) => {
  log('listUsersByEmpresa: request', { idEmpresa });
  try {
    const { data } = await api.get(`/usuarios/por-empresa/${idEmpresa}`);
    log('listUsersByEmpresa: response', data);
    return data;
  } catch (err) {
    log('listUsersByEmpresa: error', err);
    throw err;
  }
};

export const getUser = async (id) => {
  log('getUser: request', { id });
  try {
    const { data } = await api.get(`/usuarios/${id}`);
    log('getUser: response', data);
    return data;
  } catch (err) {
    log('getUser: error', err);
    throw err;
  }
};

export const createUser = async (payload) => {
  const backendPayload = toBackendCreatePayload(payload);
  log('createUser: request (frontend)', payload);
  log('createUser: request (backend-mapped)', backendPayload);
  try {
    const { data } = await api.post('/usuarios', backendPayload);
    log('createUser: response', data);
    return data;
  } catch (err) {
    log('createUser: error', err);
    throw err;
  }
};

export const updateUser = async (id, payload) => {
  const backendPayload = toBackendUpdatePayload(payload);
  log('updateUser: request (frontend)', { id, payload });
  log('updateUser: request (backend-mapped)', { id, backendPayload });
  try {
    const { data } = await api.put(`/usuarios/${id}`, backendPayload);
    log('updateUser: response', data);
    return data;
  } catch (err) {
    log('updateUser: error', err);
    throw err;
  }
};

export const deleteUser = async (id) => {
  log('deleteUser: request', { id });
  try {
    const { data } = await api.delete(`/usuarios/${id}`);
    log('deleteUser: response', data);
    return data;
  } catch (err) {
    log('deleteUser: error', err);
    throw err;
  }
};

export const resetPassword = async (id, payload) => {
  // Reutilizamos update para resetear contraseña
  const backendPayload = toBackendUpdatePayload(payload);
  log('resetPassword: request (frontend)', { id, payload });
  log('resetPassword: request (backend-mapped)', { id, backendPayload });
  try {
    const { data } = await api.put(`/usuarios/${id}`, backendPayload);
    log('resetPassword: response', data);
    return data;
  } catch (err) {
    log('resetPassword: error', err);
    throw err;
  }
};
