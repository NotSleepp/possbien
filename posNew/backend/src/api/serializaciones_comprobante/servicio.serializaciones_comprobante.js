import { esquemaCrearSerializacion, esquemaActualizarSerializacion } from './dto.serializaciones_comprobante.js';
import * as repositorio from './repositorio.serializaciones_comprobante.js';

async function crearSerializacion(datos) {
  const v = esquemaCrearSerializacion.parse(datos);
  const mapped = {
    id_empresa: v.idEmpresa,
    id_sucursal: v.idSucursal,
    id_tipo_comprobante: v.idTipoComprobante,
    serie: v.serie,
    numero_inicial: v.numeroInicial,
    numero_actual: v.numeroActual,
    numero_final: v.numeroFinal,
    cantidad_numeros: v.cantidadNumeros,
    por_default: v.porDefault,
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
  const mapped = {
    id_empresa: v.idEmpresa,
    id_sucursal: v.idSucursal,
    id_tipo_comprobante: v.idTipoComprobante,
    serie: v.serie,
    numero_inicial: v.numeroInicial,
    numero_actual: v.numeroActual,
    numero_final: v.numeroFinal,
    cantidad_numeros: v.cantidadNumeros,
    por_default: v.porDefault,
    activo: v.activo,
  };
  return await repositorio.actualizarSerializacion(id, mapped);
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