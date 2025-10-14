import * as servicio from './servicio.detalles_compra.js';

async function crearDetalleCompra(req, res, next) {
  try {
    const detalle = await servicio.crearDetalleCompra(req.body);
    res.status(201).json({ mensaje: 'Detalle de compra creado exitosamente', datos: detalle });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosDetallesCompra(req, res, next) {
  try {
    const { idCompra } = req.params;
    const detalles = await servicio.obtenerTodosDetallesCompra(Number(idCompra));
    res.json(detalles);
  } catch (error) {
    next(error);
  }
}

async function obtenerDetalleCompraPorId(req, res, next) {
  try {
    const { id } = req.params;
    const detalle = await servicio.obtenerDetalleCompraPorId(Number(id));
    res.json(detalle);
  } catch (error) {
    next(error);
  }
}

async function actualizarDetalleCompra(req, res, next) {
  try {
    const { id } = req.params;
    const detalle = await servicio.actualizarDetalleCompra(Number(id), req.body);
    res.json({ mensaje: 'Detalle de compra actualizado exitosamente', datos: detalle });
  } catch (error) {
    next(error);
  }
}

async function eliminarDetalleCompra(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarDetalleCompra(Number(id));
    res.json({ mensaje: 'Detalle de compra eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearDetalleCompra,
  obtenerTodosDetallesCompra,
  obtenerDetalleCompraPorId,
  actualizarDetalleCompra,
  eliminarDetalleCompra,
};
