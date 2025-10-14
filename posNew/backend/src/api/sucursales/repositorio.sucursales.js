import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasSucursales(idEmpresa) {
  return await clienteBaseDeDatos('sucursales').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerSucursalPorId(id) {
  return await clienteBaseDeDatos('sucursales').where({ id }).first();
}

async function crearSucursal(datos) {
  const [id] = await clienteBaseDeDatos('sucursales').insert(datos);
  return await clienteBaseDeDatos('sucursales').where({ id }).first();
}

async function actualizarSucursal(id, datos) {
  await clienteBaseDeDatos('sucursales').where({ id }).update(datos);
  return await clienteBaseDeDatos('sucursales').where({ id }).first();
}

async function eliminarSucursal(id) {
  await clienteBaseDeDatos('sucursales').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('sucursales').where({ id }).first();
}

export {
  obtenerTodasSucursales,
  obtenerSucursalPorId,
  crearSucursal,
  actualizarSucursal,
  eliminarSucursal,
};
