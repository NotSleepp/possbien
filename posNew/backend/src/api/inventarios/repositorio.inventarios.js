import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosInventarios(idSucursal) {
  return await clienteBaseDeDatos('inventarios').where({ id_sucursal: idSucursal, eliminado: false });
}

async function obtenerInventarioPorId(id) {
  return await clienteBaseDeDatos('inventarios').where({ id }).first();
}

async function crearInventario(datos) {
  const [id] = await clienteBaseDeDatos('inventarios').insert(datos);
  return await clienteBaseDeDatos('inventarios').where({ id }).first();
}

async function actualizarInventario(id, datos) {
  await clienteBaseDeDatos('inventarios').where({ id }).update(datos);
  return await clienteBaseDeDatos('inventarios').where({ id }).first();
}

async function eliminarInventario(id) {
  await clienteBaseDeDatos('inventarios').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('inventarios').where({ id }).first();
}

export {
  obtenerTodosInventarios,
  obtenerInventarioPorId,
  crearInventario,
  actualizarInventario,
  eliminarInventario,
};
