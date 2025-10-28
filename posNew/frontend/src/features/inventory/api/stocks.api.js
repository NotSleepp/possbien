import { api } from '../../../shared/api/api';
import { toCamelCase } from '../../../shared/utils/fieldTransform';
import { handleApiError } from '../../../utils/errorHandler';

// El backend de stocks espera campos en camelCase (ver dto.stocks.js)
// Por eso NO usamos toSnakeCase aquí. Normalizamos tipos antes de enviar.
const normalizeRequiredNumber = (v) => {
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : 0;
};
const normalizeOptionalNumber = (v, fallback) => {
  if (v === undefined) return fallback;
  const n = typeof v === 'string' ? Number(v) : v;
  return Number.isFinite(n) ? n : fallback;
};

const toBackendCreatePayload = (p = {}) => ({
  idEmpresa: normalizeRequiredNumber(p.idEmpresa),
  idProducto: normalizeRequiredNumber(p.idProducto),
  idAlmacen: normalizeRequiredNumber(p.idAlmacen),
  cantidadActual: normalizeOptionalNumber(p.cantidadActual, 0),
  cantidadReservada: normalizeOptionalNumber(p.cantidadReservada, 0),
  stockMinimo: normalizeOptionalNumber(p.stockMinimo, 0),
  stockMaximo: normalizeOptionalNumber(p.stockMaximo, 0),
  ubicacion: p.ubicacion === '' ? undefined : p.ubicacion,
});

const toBackendUpdatePayload = (p = {}) => ({
  idEmpresa: p.idEmpresa !== undefined ? normalizeRequiredNumber(p.idEmpresa) : undefined,
  idProducto: p.idProducto !== undefined ? normalizeRequiredNumber(p.idProducto) : undefined,
  idAlmacen: p.idAlmacen !== undefined ? normalizeRequiredNumber(p.idAlmacen) : undefined,
  cantidadActual: p.cantidadActual !== undefined ? normalizeRequiredNumber(p.cantidadActual) : undefined,
  cantidadReservada: p.cantidadReservada !== undefined ? normalizeRequiredNumber(p.cantidadReservada) : undefined,
  stockMinimo: p.stockMinimo !== undefined ? normalizeRequiredNumber(p.stockMinimo) : undefined,
  stockMaximo: p.stockMaximo !== undefined ? normalizeRequiredNumber(p.stockMaximo) : undefined,
  ubicacion: p.ubicacion !== undefined ? (p.ubicacion === '' ? undefined : p.ubicacion) : undefined,
});

// Crear registro de stock
export const createStock = async (payload) => {
  try {
    console.group('[stocks.api] CREATE');
    console.log('[stocks.api] payload (frontend camelCase):', payload);
    const backendPayload = toBackendCreatePayload(payload);
    console.log('[stocks.api] payload (normalized camelCase):', backendPayload);
    const { data, status } = await api.post('/stocks', backendPayload);
    console.log('[stocks.api] response status:', status);
    const result = toCamelCase(data?.datos ?? data);
    console.log('[stocks.api] result (camelCase):', result);
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('[stocks.api] CREATE error:', error);
    console.groupEnd?.();
    throw handleApiError(error, 'createStock');
  }
};

// Obtener stocks por producto
export const getStocksByProduct = async (idProducto) => {
  try {
    console.group('[stocks.api] GET by product');
    console.log('[stocks.api] idProducto:', idProducto);
    const { data, status } = await api.get(`/stocks/por-producto/${idProducto}`);
    console.log('[stocks.api] response status:', status);
    const result = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    console.log('[stocks.api] result length:', Array.isArray(result) ? result.length : 'n/a');
    if (Array.isArray(result) && result.length > 0) {
      console.log('[stocks.api] first item keys:', Object.keys(result[0]));
    }
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('[stocks.api] GET by product error:', error);
    console.groupEnd?.();
    throw handleApiError(error, 'getStocksByProduct');
  }
};

// Obtener stocks por almacén
export const getStocksByWarehouse = async (idAlmacen) => {
  try {
    console.group('[stocks.api] GET by warehouse');
    console.log('[stocks.api] idAlmacen:', idAlmacen);
    const { data, status } = await api.get(`/stocks/por-almacen/${idAlmacen}`);
    console.log('[stocks.api] response status:', status);
    const result = Array.isArray(data) ? data.map(toCamelCase) : toCamelCase(data);
    console.log('[stocks.api] result length:', Array.isArray(result) ? result.length : 'n/a');
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('[stocks.api] GET by warehouse error:', error);
    console.groupEnd?.();
    throw handleApiError(error, 'getStocksByWarehouse');
  }
};

// Actualizar stock por id
export const updateStock = async (id, payload) => {
  try {
    console.group('[stocks.api] UPDATE');
    console.log('[stocks.api] id:', id);
    console.log('[stocks.api] payload (frontend camelCase):', payload);
    const backendPayload = toBackendUpdatePayload(payload);
    console.log('[stocks.api] payload (normalized camelCase):', backendPayload);
    const { data, status } = await api.put(`/stocks/${id}`, backendPayload);
    console.log('[stocks.api] response status:', status);
    const result = toCamelCase(data?.datos ?? data);
    console.log('[stocks.api] result (camelCase):', result);
    console.groupEnd();
    return result;
  } catch (error) {
    console.error('[stocks.api] UPDATE error:', error);
    console.groupEnd?.();
    throw handleApiError(error, 'updateStock');
  }
};

export default {
  createStock,
  getStocksByProduct,
  getStocksByWarehouse,
  updateStock,
};