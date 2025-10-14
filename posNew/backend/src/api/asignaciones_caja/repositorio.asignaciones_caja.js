import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasAsignacionesCaja(idCaja) {
  return await clienteBaseDeDatos('asignaciones_caja').where({ id_caja: idCaja, eliminado: false });
}

async function obtenerAsignacionCajaPorId(id) {
  return await clienteBaseDeDatos('asignaciones_caja').where({ id }).first();
}

async function crearAsignacionCaja(datos) {
  const [id] = await clienteBaseDeDatos('asignaciones_caja').insert(datos);
  return await clienteBaseDeDatos('asignaciones_caja').where({ id }).first();
}

async function actualizarAsignacionCaja(id, datos) {
  await clienteBaseDeDatos('asignaciones_caja').where({ id }).update(datos);
  return await clienteBaseDeDatos('asignaciones_caja').where({ id }).first();
}

async function eliminarAsignacionCaja(id) {
  await clienteBaseDeDatos('asignaciones_caja').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('asignaciones_caja').where({ id }).first();
}

export {
    crearAsignacionCaja,
    obtenerTodasAsignacionesCaja,
    obtenerAsignacionCajaPorId,
    actualizarAsignacionCaja,
    eliminarAsignacionCaja
};
