import * as servicio from './servicio.asignaciones_caja.js';

async function crearAsignacionCaja(req, res, next) {
  try {
    const asignacion = await servicio.crearAsignacionCaja(req.body);
    res.status(201).json({ mensaje: 'Asignaci�n de caja creada exitosamente', datos: asignacion });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodasAsignacionesCaja(req, res, next) {
  try {
    const { idCaja } = req.params;
    const asignaciones = await servicio.obtenerTodasAsignacionesCaja(Number(idCaja));
    res.json(asignaciones);
  } catch (error) {
    next(error);
  }
}

async function obtenerAsignacionCajaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const asignacion = await servicio.obtenerAsignacionCajaPorId(Number(id));
    res.json(asignacion);
  } catch (error) {
    next(error);
  }
}

async function actualizarAsignacionCaja(req, res, next) {
  try {
    const { id } = req.params;
    const asignacion = await servicio.actualizarAsignacionCaja(Number(id), req.body);
    res.json({ mensaje: 'Asignaci�n de caja actualizada exitosamente', datos: asignacion });
  } catch (error) {
    next(error);
  }
}

async function eliminarAsignacionCaja(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarAsignacionCaja(Number(id));
    res.json({ mensaje: 'Asignaci�n de caja eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
    crearAsignacionCaja,
    obtenerTodasAsignacionesCaja,
    obtenerAsignacionCajaPorId,
    actualizarAsignacionCaja,
    eliminarAsignacionCaja
};
