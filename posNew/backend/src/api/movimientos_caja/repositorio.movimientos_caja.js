import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosMovimientosCaja(idCaja) {
  return await clienteBaseDeDatos('movimientos_caja').where({ id_caja: idCaja, eliminado: false });
}

async function obtenerMovimientoCajaPorId(id) {
  return await clienteBaseDeDatos('movimientos_caja').where({ id }).first();
}

async function crearMovimientoCaja(datos) {
  const [id] = await clienteBaseDeDatos('movimientos_caja').insert(datos);
  return await clienteBaseDeDatos('movimientos_caja').where({ id }).first();
}

async function actualizarMovimientoCaja(id, datos) {
  await clienteBaseDeDatos('movimientos_caja').where({ id }).update(datos);
  return await clienteBaseDeDatos('movimientos_caja').where({ id }).first();
}

async function eliminarMovimientoCaja(id) {
  await clienteBaseDeDatos('movimientos_caja').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('movimientos_caja').where({ id }).first();
}

export {
  obtenerTodosMovimientosCaja,
  obtenerMovimientoCajaPorId,
  crearMovimientoCaja,
  actualizarMovimientoCaja,
  eliminarMovimientoCaja,
};
