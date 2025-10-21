import { esquemaCrearTipoComprobante, esquemaActualizarTipoComprobante } from './dto.tipos_comprobante.js';
import * as repositorio from './repositorio.tipos_comprobante.js';

async function crearTipoComprobante(datos) {
  const v = esquemaCrearTipoComprobante.parse(datos);
  const mapped = {
    id_empresa: v.idEmpresa,
    codigo: v.codigo,
    nombre: v.nombre,
    descripcion: v.descripcion,
    destino: v.destino,
    activo: v.activo,
  };
  return await repositorio.crearTipoComprobante(mapped);
}

async function obtenerTodosTiposComprobante() {
  return await repositorio.obtenerTodosTiposComprobante();
}

async function obtenerTipoComprobantePorId(id) {
  const t = await repositorio.obtenerTipoComprobantePorId(id);
  if (!t) throw new Error('Tipo de comprobante no encontrado');
  return t;
}

async function actualizarTipoComprobante(id, datos) {
  const v = esquemaActualizarTipoComprobante.parse({ id, ...datos });
  const mapped = {
    id_empresa: v.idEmpresa,
    codigo: v.codigo,
    nombre: v.nombre,
    descripcion: v.descripcion,
    destino: v.destino,
    activo: v.activo,
  };
  return await repositorio.actualizarTipoComprobante(id, mapped);
}

async function eliminarTipoComprobante(id) {
  return await repositorio.eliminarTipoComprobante(id);
}

export {
  crearTipoComprobante,
  obtenerTodosTiposComprobante,
  obtenerTipoComprobantePorId,
  actualizarTipoComprobante,
  eliminarTipoComprobante,
};