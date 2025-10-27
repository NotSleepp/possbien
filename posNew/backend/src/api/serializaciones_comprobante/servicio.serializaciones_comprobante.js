import { esquemaCrearSerializacion, esquemaActualizarSerializacion } from './dto.serializaciones_comprobante.js';
import * as repositorio from './repositorio.serializaciones_comprobante.js';
import { UniqueConstraintError } from '../../shared/utils/errorHandler.js';

async function crearSerializacion(datos) {
  const v = esquemaCrearSerializacion.parse(datos);
  
  // Validar unicidad de serie por sucursal y tipo de comprobante
  const existente = await repositorio.obtenerSerializacionPorSerieSucursalTipo(
    v.serie,
    v.id_sucursal,
    v.id_tipo_comprobante
  );
  if (existente) {
    throw new UniqueConstraintError('serie', v.serie);
  }
  
  // Si es por defecto, desactivar otras series por defecto para la misma sucursal y tipo
  if (v.por_default) {
    await repositorio.desactivarSeriesPorDefecto(v.id_sucursal, v.id_tipo_comprobante);
  }
  
  const mapped = {
    id_empresa: v.id_empresa,
    id_sucursal: v.id_sucursal,
    id_tipo_comprobante: v.id_tipo_comprobante,
    serie: v.serie,
    numero_inicial: v.numero_inicial,
    numero_actual: v.numero_actual,
    numero_final: v.numero_final,
    cantidad_numeros: v.cantidad_numeros,
    por_default: v.por_default,
    activo: v.activo,
  };
  return await repositorio.crearSerializacion(mapped);
}

async function obtenerTodasSerializaciones() {
  return await repositorio.obtenerTodasSerializaciones();
}

async function obtenerSerializacionPorId(id) {
  const s = await repositorio.obtenerSerializacionPorId(id);
  if (!s) throw new Error('Serialización no encontrada');
  return s;
}

async function obtenerSerializacionesPorSucursal(idSucursal) {
  return await repositorio.obtenerSerializacionesPorSucursal(idSucursal);
}

async function obtenerSerializacionesPorTipo(idTipoComprobante) {
  return await repositorio.obtenerSerializacionesPorTipo(idTipoComprobante);
}

async function actualizarSerializacion(id, datos) {
  const v = esquemaActualizarSerializacion.parse({ id, ...datos });
  
  const serializacionActual = await repositorio.obtenerSerializacionPorId(id);
  if (!serializacionActual) {
    throw new Error('Serialización no encontrada');
  }
  
  // Si se está actualizando la serie, validar unicidad
  if (v.serie && v.serie !== serializacionActual.serie) {
    const existente = await repositorio.obtenerSerializacionPorSerieSucursalTipo(
      v.serie,
      serializacionActual.id_sucursal,
      serializacionActual.id_tipo_comprobante
    );
    if (existente && existente.id !== id) {
      throw new UniqueConstraintError('serie', v.serie);
    }
  }
  
  // Si se está marcando como por defecto, desactivar otras series por defecto
  if (v.por_default === true) {
    await repositorio.desactivarSeriesPorDefecto(
      serializacionActual.id_sucursal,
      serializacionActual.id_tipo_comprobante,
      id
    );
  }
  
  const mapped = {
    id_sucursal: v.id_sucursal,
    id_tipo_comprobante: v.id_tipo_comprobante,
    serie: v.serie,
    numero_inicial: v.numero_inicial,
    numero_actual: v.numero_actual,
    numero_final: v.numero_final,
    cantidad_numeros: v.cantidad_numeros,
    por_default: v.por_default,
    activo: v.activo,
  };
  const updates = Object.fromEntries(Object.entries(mapped).filter(([_, val]) => val !== undefined));
  return await repositorio.actualizarSerializacion(id, updates);
}

async function eliminarSerializacion(id) {
  return await repositorio.eliminarSerializacion(id);
}

export {
  crearSerializacion,
  obtenerTodasSerializaciones,
  obtenerSerializacionPorId,
  obtenerSerializacionesPorSucursal,
  obtenerSerializacionesPorTipo,
  actualizarSerializacion,
  eliminarSerializacion,
};