import { api } from '../../../shared/api/api';
import { toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

// NOTE: A diferencia de otros módulos (roles, impresoras, etc.),
// el backend de productos actualmente espera campos en camelCase.
// Por eso NO usamos toSnakeCase aquí. Nos aseguramos, eso sí,
// de normalizar tipos y limpiar cadenas antes de enviar.

const normalizeOptionalString = (v) => (v === '' || v === undefined ? undefined : String(v));
const normalizeRequiredString = (v) => (v == null ? '' : String(v).trim());
const normalizeOptionalNumber = (v) => {
  if (v === '' || v === undefined) return undefined;
  if (v === null) return null;
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : undefined;
};
const normalizeRequiredNumber = (v) => {
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : 0;
};
const normalizeOptionalBoolean = (v) => (v === undefined ? undefined : Boolean(v));

// Construye el payload esperado por el backend (camelCase) para crear
const toBackendCreatePayload = (p = {}) => ({
  idEmpresa: normalizeRequiredNumber(p.idEmpresa),
  idCategoria: normalizeRequiredNumber(p.idCategoria),
  codigo: normalizeRequiredString(p.codigo),
  codigoBarras: normalizeOptionalString(p.codigoBarras),
  codigoInterno: normalizeOptionalString(p.codigoInterno),
  nombre: normalizeRequiredString(p.nombre),
  descripcion: normalizeOptionalString(p.descripcion),
  precioCompra: normalizeRequiredNumber(p.precioCompra),
  precioVenta: normalizeRequiredNumber(p.precioVenta),
  stockActual: normalizeRequiredNumber(p.stockActual),
  stockMinimo: normalizeRequiredNumber(p.stockMinimo),
  unidadMedida: normalizeOptionalString(p.unidadMedida),
  sevendePor: normalizeOptionalString(p.sevendePor),
  manejaInventarios: normalizeOptionalBoolean(p.manejaInventarios),
  manejaMultiprecios: normalizeOptionalBoolean(p.manejaMultiprecios),
  imagenUrl: normalizeOptionalString(p.imagenUrl),
});

// Construye el payload esperado por el backend (camelCase) para actualizar
const toBackendUpdatePayload = (p = {}) => ({
  // id se envía por URL, aquí solo campos editables/opcionales
  idCategoria: normalizeOptionalNumber(p.idCategoria),
  codigo: p.codigo !== undefined ? normalizeRequiredString(p.codigo) : undefined,
  codigoBarras: p.codigoBarras !== undefined ? normalizeOptionalString(p.codigoBarras) : undefined,
  codigoInterno: p.codigoInterno !== undefined ? normalizeOptionalString(p.codigoInterno) : undefined,
  nombre: p.nombre !== undefined ? normalizeRequiredString(p.nombre) : undefined,
  descripcion: p.descripcion !== undefined ? normalizeOptionalString(p.descripcion) : undefined,
  precioCompra: normalizeOptionalNumber(p.precioCompra),
  precioVenta: normalizeOptionalNumber(p.precioVenta),
  stockActual: normalizeOptionalNumber(p.stockActual),
  stockMinimo: normalizeOptionalNumber(p.stockMinimo),
  unidadMedida: p.unidadMedida !== undefined ? normalizeOptionalString(p.unidadMedida) : undefined,
  sevendePor: p.sevendePor !== undefined ? normalizeOptionalString(p.sevendePor) : undefined,
  manejaInventarios: normalizeOptionalBoolean(p.manejaInventarios),
  manejaMultiprecios: normalizeOptionalBoolean(p.manejaMultiprecios),
  imagenUrl: p.imagenUrl !== undefined ? normalizeOptionalString(p.imagenUrl) : undefined,
});

// Create product
export const createProduct = async (payload) => {
  try {
    console.group('[products.api] CREATE');
    console.log('[products.api] CREATE start - payload (frontend camelCase):', payload);
    const backendPayload = toBackendCreatePayload(payload);
    console.log('[products.api] CREATE payload (normalized camelCase):', backendPayload);
    const { data, status } = await api.post('/productos', backendPayload);
    console.log('[products.api] CREATE response status:', status);
    const result = toCamelCase(data?.datos ?? data);
    console.log('[products.api] CREATE result (camelCase):', result);
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('[products.api] CREATE error:', error);
    console.groupEnd?.();
    throw handleApiError(error, 'createProduct');
  }
};

// Update product
export const updateProduct = async (id, payload) => {
  try {
    console.group('[products.api] UPDATE');
    console.log('[products.api] UPDATE start - id:', id, 'payload (frontend camelCase):', payload);
    const backendPayload = toBackendUpdatePayload(payload);
    console.log('[products.api] UPDATE payload (normalized camelCase):', backendPayload);
    const { data, status } = await api.put(`/productos/${id}`, backendPayload);
    console.log('[products.api] UPDATE response status:', status);
    const result = toCamelCase(data?.datos ?? data);
    console.log('[products.api] UPDATE result (camelCase):', result);
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('[products.api] UPDATE error:', error);
    console.groupEnd?.();
    throw handleApiError(error, 'updateProduct');
  }
};