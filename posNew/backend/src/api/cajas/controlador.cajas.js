import * as servicio from './servicio.cajas.js';

async function crearCaja(req, res, next) {
  try {
    const caja = await servicio.crearCaja(req.body);
    res.status(201).json({ mensaje: 'Caja creada exitosamente', datos: caja });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodasCajas(req, res, next) {
  try {
    const { idSucursal } = req.params;
    const cajas = await servicio.obtenerTodasCajas(Number(idSucursal));
    res.json(cajas);
  } catch (error) {
    next(error);
  }
}

async function obtenerCajaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const caja = await servicio.obtenerCajaPorId(Number(id));
    res.json(caja);
  } catch (error) {
    next(error);
  }
}

async function actualizarCaja(req, res, next) {
  try {
    const { id } = req.params;
    const caja = await servicio.actualizarCaja(Number(id), req.body);
    res.json({ mensaje: 'Caja actualizada exitosamente', datos: caja });
  } catch (error) {
    next(error);
  }
}

async function eliminarCaja(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarCaja(Number(id));
    res.json({ mensaje: 'Caja eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
    crearCaja,
    obtenerTodasCajas,
    obtenerCajaPorId,
    actualizarCaja,
    eliminarCaja
};
