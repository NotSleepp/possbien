import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasCajas(idSucursal) {
  return await clienteBaseDeDatos('caja').where({ id_sucursal: idSucursal, eliminado: false });
}

async function obtenerCajaPorId(id) {
  return await clienteBaseDeDatos('caja').where({ id }).first();
}

async function crearCaja(datos) {
  const [id] = await clienteBaseDeDatos('caja').insert(datos);
  return await clienteBaseDeDatos('caja').where({ id }).first();
}

async function actualizarCaja(id, datos) {
  await clienteBaseDeDatos('caja').where({ id }).update(datos);
  return await clienteBaseDeDatos('caja').where({ id }).first();
}

async function eliminarCaja(id) {
  await clienteBaseDeDatos('caja').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('caja').where({ id }).first();
}

export {
    crearCaja,
    obtenerTodasCajas,
    obtenerCajaPorId,
    actualizarCaja,
    eliminarCaja
};
