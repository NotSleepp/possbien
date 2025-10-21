import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const TABLA = 'detalle_venta';

async function obtenerTodosDetallesVenta(idVenta) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_venta: idVenta, eliminado: 0 });
}

async function obtenerDetalleVentaPorId(id) {
  return await clienteBaseDeDatos(TABLA)
    .where({ id })
    .first();
}

async function crearDetalleVenta(datos) {
  const [id] = await clienteBaseDeDatos(TABLA).insert({
    id_venta: datos.id_venta,
    id_producto: datos.id_producto,
    cantidad: datos.cantidad,
    precio_venta: datos.precio_venta,
    descuento: datos.descuento ?? 0,
  });
  return await obtenerDetalleVentaPorId(id);
}

async function actualizarDetalleVenta(id, datos) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      id_venta: datos.id_venta,
      id_producto: datos.id_producto,
      cantidad: datos.cantidad,
      precio_venta: datos.precio_venta,
      descuento: datos.descuento,
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerDetalleVentaPorId(id);
}

async function eliminarDetalleVenta(id) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({ eliminado: 1, fecha_actualizacion: clienteBaseDeDatos.fn.now() });
}

export {
  obtenerTodosDetallesVenta,
  obtenerDetalleVentaPorId,
  crearDetalleVenta,
  actualizarDetalleVenta,
  eliminarDetalleVenta,
};
