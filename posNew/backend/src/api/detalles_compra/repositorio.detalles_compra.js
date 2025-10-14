import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosDetallesCompra(idCompra) {
  return await clienteBaseDeDatos('detalles_compra').where({ id_compra: idCompra, eliminado: false });
}

async function obtenerDetalleCompraPorId(id) {
  return await clienteBaseDeDatos('detalles_compra').where({ id }).first();
}

async function crearDetalleCompra(datos) {
  const [id] = await clienteBaseDeDatos('detalles_compra').insert(datos);
  return await clienteBaseDeDatos('detalles_compra').where({ id }).first();
}

async function actualizarDetalleCompra(id, datos) {
  await clienteBaseDeDatos('detalles_compra').where({ id }).update(datos);
  return await clienteBaseDeDatos('detalles_compra').where({ id }).first();
}

async function eliminarDetalleCompra(id) {
  await clienteBaseDeDatos('detalles_compra').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('detalles_compra').where({ id }).first();
}

export {
  obtenerTodosDetallesCompra,
  obtenerDetalleCompraPorId,
  crearDetalleCompra,
  actualizarDetalleCompra,
  eliminarDetalleCompra,
};
