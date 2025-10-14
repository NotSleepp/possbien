import * as servicio from './servicio.detalles_venta.js';

async function crearDetalleVenta(req, res, next) {
  try {
    const detalle = await servicio.crearDetalleVenta(req.body);
    res.status(201).json({ mensaje: 'Detalle de venta creado exitosamente', datos: detalle });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosDetallesVenta(req, res, next) {
  try {
    const { idVenta } = req.params;
    const detalles = await servicio.obtenerTodosDetallesVenta(Number(idVenta));
    res.json(detalles);
  } catch (error) {
    next(error);
  }
}

async function obtenerDetalleVentaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const detalle = await servicio.obtenerDetalleVentaPorId(Number(id));
    res.json(detalle);
  } catch (error) {
    next(error);
  }
}

async function actualizarDetalleVenta(req, res, next) {
  try {
    const { id } = req.params;
    const detalle = await servicio.actualizarDetalleVenta(Number(id), req.body);
    res.json({ mensaje: 'Detalle de venta actualizado exitosamente', datos: detalle });
  } catch (error) {
    next(error);
  }
}

async function eliminarDetalleVenta(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarDetalleVenta(Number(id));
    res.json({ mensaje: 'Detalle de venta eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearDetalleVenta,
  obtenerTodosDetallesVenta,
  obtenerDetalleVentaPorId,
  actualizarDetalleVenta,
  eliminarDetalleVenta,
};
