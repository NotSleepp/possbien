import { esquemaCrearAuditTrail, esquemaActualizarAuditTrail } from './dto.audit_trails.js';
import * as repositorio from './repositorio.audit_trails.js';

async function crearAuditTrail(datos) {
  const datosValidados = esquemaCrearAuditTrail.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    id_usuario: datosValidados.idUsuario,
    entidad: datosValidados.entidad,
    accion: datosValidados.accion,
    datos_anteriores: datosValidados.datosAnteriores,
    datos_nuevos: datosValidados.datosNuevos,
    fecha: datosValidados.fecha ? new Date(datosValidados.fecha) : new Date(),
  };
  return await repositorio.crearAuditTrail(mappedData);
}

async function obtenerTodosAuditTrails(idEmpresa) {
  return await repositorio.obtenerTodosAuditTrails(idEmpresa);
}

async function obtenerAuditTrailPorId(id) {
  const audit = await repositorio.obtenerAuditTrailPorId(id);
  if (!audit) {
    throw new Error('Audit trail no encontrado');
  }
  return audit;
}

async function actualizarAuditTrail(id, datos) {
  const datosValidados = esquemaActualizarAuditTrail.parse({ id, ...datos });
  return await repositorio.actualizarAuditTrail(id, datosValidados);
}

async function eliminarAuditTrail(id) {
  await obtenerAuditTrailPorId(id);
  return await repositorio.eliminarAuditTrail(id);
}

export {
    crearAuditTrail,
    obtenerTodosAuditTrails,
    obtenerAuditTrailPorId,
    actualizarAuditTrail,
    eliminarAuditTrail
};
