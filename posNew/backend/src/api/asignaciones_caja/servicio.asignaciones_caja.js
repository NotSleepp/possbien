import { esquemaCrearAsignacionCaja, esquemaActualizarAsignacionCaja } from './dto.asignaciones_caja.js';
import * as repositorio from './repositorio.asignaciones_caja.js';

async function crearAsignacionCaja(datos) {
  const datosValidados = esquemaCrearAsignacionCaja.parse(datos);
  const mappedData = {
    id_caja: datosValidados.idCaja,
    id_usuario: datosValidados.idUsuario,
    fecha_asignacion: datosValidados.fechaAsignacion ? new Date(datosValidados.fechaAsignacion) : new Date(),
    estado: datosValidados.estado,
  };
  return await repositorio.crearAsignacionCaja(mappedData);
}

async function obtenerTodasAsignacionesCaja(idCaja) {
  return await repositorio.obtenerTodasAsignacionesCaja(idCaja);
}

async function obtenerAsignacionCajaPorId(id) {
  const asignacion = await repositorio.obtenerAsignacionCajaPorId(id);
  if (!asignacion) {
    throw new Error('Asignaci�n de caja no encontrada');
  }
  return asignacion;
}

async function actualizarAsignacionCaja(id, datos) {
  const datosValidados = esquemaActualizarAsignacionCaja.parse({ id, ...datos });
  return await repositorio.actualizarAsignacionCaja(id, datosValidados);
}

async function eliminarAsignacionCaja(id) {
  await obtenerAsignacionCajaPorId(id);
  return await repositorio.eliminarAsignacionCaja(id);
}

export {
    crearAsignacionCaja,
    obtenerTodasAsignacionesCaja,
    obtenerAsignacionCajaPorId,
    actualizarAsignacionCaja,
    eliminarAsignacionCaja
};
