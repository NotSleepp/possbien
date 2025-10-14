import { esquemaCrearMovimientoCaja, esquemaActualizarMovimientoCaja } from './dto.movimientos_caja.js';
import * as repositorio from './repositorio.movimientos_caja.js';

async function crearMovimientoCaja(datos) {
  const datosValidados = esquemaCrearMovimientoCaja.parse(datos);
  const mappedData = {
    id_caja: datosValidados.idCaja,
    id_usuario: datosValidados.idUsuario,
    tipo: datosValidados.tipo,
    monto: datosValidados.monto,
    descripcion: datosValidados.descripcion,
    fecha: datosValidados.fecha ? new Date(datosValidados.fecha) : new Date(),
  };
  return await repositorio.crearMovimientoCaja(mappedData);
}

async function obtenerTodosMovimientosCaja(idCaja) {
  return await repositorio.obtenerTodosMovimientosCaja(idCaja);
}

async function obtenerMovimientoCajaPorId(id) {
  const movimiento = await repositorio.obtenerMovimientoCajaPorId(id);
  if (!movimiento) {
    throw new Error('Movimiento de caja no encontrado');
  }
  return movimiento;
}

async function actualizarMovimientoCaja(id, datos) {
  const datosValidados = esquemaActualizarMovimientoCaja.parse({ id, ...datos });
  return await repositorio.actualizarMovimientoCaja(id, datosValidados);
}

async function eliminarMovimientoCaja(id) {
  await obtenerMovimientoCajaPorId(id);
  return await repositorio.eliminarMovimientoCaja(id);
}

export {
  crearMovimientoCaja,
  obtenerTodosMovimientosCaja,
  obtenerMovimientoCajaPorId,
  actualizarMovimientoCaja,
  eliminarMovimientoCaja,
};
