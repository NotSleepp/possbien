import * as servicio from './servicio.compras.js';

async function crearCompra(req, res, next) {
  try {
    const compra = await servicio.crearCompra(req.body);
    res.status(201).json({ mensaje: 'Compra creada exitosamente', datos: compra });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodasCompras(req, res, next) {
  try {
    const { idSucursal } = req.params;
    const compras = await servicio.obtenerTodasCompras(Number(idSucursal));
    res.json(compras);
  } catch (error) {
    next(error);
  }
}

async function obtenerCompraPorId(req, res, next) {
  try {
    const { id } = req.params;
    const compra = await servicio.obtenerCompraPorId(Number(id));
    res.json(compra);
  } catch (error) {
    next(error);
  }
}

async function actualizarCompra(req, res, next) {
  try {
    const { id } = req.params;
    const compra = await servicio.actualizarCompra(Number(id), req.body);
    res.json({ mensaje: 'Compra actualizada exitosamente', datos: compra });
  } catch (error) {
    next(error);
  }
}

async function eliminarCompra(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarCompra(Number(id));
    res.json({ mensaje: 'Compra eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export { crearCompra, obtenerTodasCompras, obtenerCompraPorId, actualizarCompra, eliminarCompra };
