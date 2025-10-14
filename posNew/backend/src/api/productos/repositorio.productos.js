import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosProductos(idEmpresa) {
  return await clienteBaseDeDatos('productos').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerProductoPorId(id) {
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

async function obtenerPorCodigo(codigo, idEmpresa) {
  return await clienteBaseDeDatos('productos').where({ codigo, id_empresa: idEmpresa, eliminado: false }).first();
}

async function crearProducto(datos) {
  const [id] = await clienteBaseDeDatos('productos').insert(datos);
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

async function actualizarProducto(id, datos) {
  await clienteBaseDeDatos('productos').where({ id }).update(datos);
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

async function eliminarProducto(id) {
  await clienteBaseDeDatos('productos').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

export {
  obtenerTodosProductos,
  obtenerProductoPorId,
  obtenerPorCodigo,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
