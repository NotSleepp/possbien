import { esquemaCrearDetalleVenta, esquemaActualizarDetalleVenta } from './dto.detalles_venta.js';
import * as repositorio from './repositorio.detalles_venta.js';

async function crearDetalleVenta(datos) {
  const datosValidados = esquemaCrearDetalleVenta.parse(datos);
  const mappedData = {
    id_venta: datosValidados.idVenta,
    id_producto: datosValidados.idProducto,
    cantidad: datosValidados.cantidad,
    precio_venta: datosValidados.precioVenta,
    descuento: datosValidados.descuento ?? 0,
  };
  return await repositorio.crearDetalleVenta(mappedData);
}

async function obtenerTodosDetallesVenta(idVenta) {
  return await repositorio.obtenerTodosDetallesVenta(idVenta);
}

async function obtenerDetalleVentaPorId(id) {
  const detalle = await repositorio.obtenerDetalleVentaPorId(id);
  if (!detalle) {
    throw new Error('Detalle de venta no encontrado');
  }
  return detalle;
}

async function actualizarDetalleVenta(id, datos) {
  const datosValidados = esquemaActualizarDetalleVenta.parse({ id, ...datos });
  const mappedData = {
    id_venta: datosValidados.idVenta,
    id_producto: datosValidados.idProducto,
    cantidad: datosValidados.cantidad,
    precio_venta: datosValidados.precioVenta,
    descuento: datosValidados.descuento,
  };
  return await repositorio.actualizarDetalleVenta(id, mappedData);
}

async function eliminarDetalleVenta(id) {
  await obtenerDetalleVentaPorId(id);
  return await repositorio.eliminarDetalleVenta(id);
}

export {
  crearDetalleVenta,
  obtenerTodosDetallesVenta,
  obtenerDetalleVentaPorId,
  actualizarDetalleVenta,
  eliminarDetalleVenta,
};
