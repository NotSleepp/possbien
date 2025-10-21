import { esquemaCrearDetalleCompra, esquemaActualizarDetalleCompra } from './dto.detalles_compra.js';
import * as repositorio from './repositorio.detalles_compra.js';

async function crearDetalleCompra(datos) {
  const datosValidados = esquemaCrearDetalleCompra.parse(datos);
  const mappedData = {
    id_compra: datosValidados.idCompra,
    id_producto: datosValidados.idProducto,
    cantidad_pedida: datosValidados.cantidad,
    precio_unitario: datosValidados.precioUnitario,
    descuento: datosValidados.descuento ?? 0,
  };
  return await repositorio.crearDetalleCompra(mappedData);
}

async function obtenerTodosDetallesCompra(idCompra) {
  return await repositorio.obtenerTodosDetallesCompra(idCompra);
}

async function obtenerDetalleCompraPorId(id) {
  const detalle = await repositorio.obtenerDetalleCompraPorId(id);
  if (!detalle) {
    throw new Error('Detalle de compra no encontrado');
  }
  return detalle;
}

async function actualizarDetalleCompra(id, datos) {
  const datosValidados = esquemaActualizarDetalleCompra.parse({ id, ...datos });
  const mappedData = {
    id_compra: datosValidados.idCompra,
    id_producto: datosValidados.idProducto,
    cantidad_pedida: datosValidados.cantidad,
    precio_unitario: datosValidados.precioUnitario,
    descuento: datosValidados.descuento,
  };
  return await repositorio.actualizarDetalleCompra(id, mappedData);
}

async function eliminarDetalleCompra(id) {
  await obtenerDetalleCompraPorId(id);
  return await repositorio.eliminarDetalleCompra(id);
}

export {
  crearDetalleCompra,
  obtenerTodosDetallesCompra,
  obtenerDetalleCompraPorId,
  actualizarDetalleCompra,
  eliminarDetalleCompra,
};
