import * as servicio from './servicio.ventas.js';

async function crearVenta(req, res, next) {
  try {
    const venta = await servicio.crearVenta(req.body, req.usuario);
    res.status(201).json({ mensaje: 'Venta creada exitosamente', datos: venta });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodasVentas(req, res, next) {
  try {
    const { idSucursal } = req.params;
    const ventas = await servicio.obtenerTodasVentas(Number(idSucursal), req.usuario);
    res.json(ventas);
  } catch (error) {
    next(error);
  }
}

async function obtenerVentaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const venta = await servicio.obtenerVentaPorId(Number(id));
    res.json(venta);
  } catch (error) {
    next(error);
  }
}

async function actualizarVenta(req, res, next) {
  try {
    const { id } = req.params;
    const venta = await servicio.actualizarVenta(Number(id), req.body, req.usuario);
    res.json({ mensaje: 'Venta actualizada exitosamente', datos: venta });
  } catch (error) {
    next(error);
  }
}

async function eliminarVenta(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarVenta(Number(id));
    res.json({ mensaje: 'Venta eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearVenta,
  obtenerTodasVentas,
  obtenerVentaPorId,
  actualizarVenta,
  eliminarVenta,
};
