import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosDetallesVenta(idVenta) {
  return await clienteBaseDeDatos('detalles_venta').where({ id_venta: idVenta, eliminado: false });
}

async function obtenerDetalleVentaPorId(id) {
  return await clienteBaseDeDatos('detalles_venta').where({ id }).first();
}

async function crearDetalleVenta(datos) {
  const [id] = await clienteBaseDeDatos('detalles_venta').insert(datos);
  return await clienteBaseDeDatos('detalles_venta').where({ id }).first();
}

async function actualizarDetalleVenta(id, datos) {
  await clienteBaseDeDatos('detalles_venta').where({ id }).update(datos);
  return await clienteBaseDeDatos('detalles_venta').where({ id }).first();
}

async function eliminarDetalleVenta(id) {
  await clienteBaseDeDatos('detalles_venta').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('detalles_venta').where({ id }).first();
}

export {
  obtenerTodosDetallesVenta,
  obtenerDetalleVentaPorId,
  crearDetalleVenta,
  actualizarDetalleVenta,
  eliminarDetalleVenta,
};
