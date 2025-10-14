import * as servicio from './servicio.movimientos_caja.js';

async function crearMovimientoCaja(req, res, next) {
  try {
    const movimiento = await servicio.crearMovimientoCaja(req.body);
    res.status(201).json({ mensaje: 'Movimiento de caja creado exitosamente', datos: movimiento });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosMovimientosCaja(req, res, next) {
  try {
    const { idCaja } = req.params;
    const movimientos = await servicio.obtenerTodosMovimientosCaja(Number(idCaja));
    res.json(movimientos);
  } catch (error) {
    next(error);
  }
}

async function obtenerMovimientoCajaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const movimiento = await servicio.obtenerMovimientoCajaPorId(Number(id));
    res.json(movimiento);
  } catch (error) {
    next(error);
  }
}

async function actualizarMovimientoCaja(req, res, next) {
  try {
    const { id } = req.params;
    const movimiento = await servicio.actualizarMovimientoCaja(Number(id), req.body);
    res.json({ mensaje: 'Movimiento de caja actualizado exitosamente', datos: movimiento });
  } catch (error) {
    next(error);
  }
}

async function eliminarMovimientoCaja(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarMovimientoCaja(Number(id));
    res.json({ mensaje: 'Movimiento de caja eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearMovimientoCaja,
  obtenerTodosMovimientosCaja,
  obtenerMovimientoCajaPorId,
  actualizarMovimientoCaja,
  eliminarMovimientoCaja,
};
