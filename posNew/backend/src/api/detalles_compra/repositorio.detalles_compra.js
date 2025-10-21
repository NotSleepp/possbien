import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const TABLA = 'detalle_compra';

async function obtenerTodosDetallesCompra(idCompra) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_compra: idCompra, eliminado: 0 });
}

async function obtenerDetalleCompraPorId(id) {
  return await clienteBaseDeDatos(TABLA)
    .where({ id })
    .first();
}

async function crearDetalleCompra(datos) {
  const [id] = await clienteBaseDeDatos(TABLA).insert({
    id_compra: datos.id_compra,
    id_producto: datos.id_producto,
    cantidad_pedida: datos.cantidad_pedida,
    precio_unitario: datos.precio_unitario,
    descuento: datos.descuento ?? 0,
  });
  return await obtenerDetalleCompraPorId(id);
}

async function actualizarDetalleCompra(id, datos) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      id_compra: datos.id_compra,
      id_producto: datos.id_producto,
      cantidad_pedida: datos.cantidad_pedida,
      precio_unitario: datos.precio_unitario,
      descuento: datos.descuento,
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerDetalleCompraPorId(id);
}

async function eliminarDetalleCompra(id) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({ eliminado: 1, fecha_actualizacion: clienteBaseDeDatos.fn.now() });
}

export {
  obtenerTodosDetallesCompra,
  obtenerDetalleCompraPorId,
  crearDetalleCompra,
  actualizarDetalleCompra,
  eliminarDetalleCompra,
};
