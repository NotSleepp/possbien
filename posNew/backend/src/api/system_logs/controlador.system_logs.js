import * as servicio from './servicio.system_logs.js';

async function crearSystemLog(req, res, next) {
  try {
    const log = await servicio.crearSystemLog(req.body);
    res.status(201).json({ mensaje: 'System log creado exitosamente', datos: log });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosSystemLogs(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const logs = await servicio.obtenerTodosSystemLogs(Number(idEmpresa));
    res.json(logs);
  } catch (error) {
    next(error);
  }
}

async function obtenerSystemLogPorId(req, res, next) {
  try {
    const { id } = req.params;
    const log = await servicio.obtenerSystemLogPorId(Number(id));
    res.json(log);
  } catch (error) {
    next(error);
  }
}

async function actualizarSystemLog(req, res, next) {
  try {
    const { id } = req.params;
    const log = await servicio.actualizarSystemLog(Number(id), req.body);
    res.json({ mensaje: 'System log actualizado exitosamente', datos: log });
  } catch (error) {
    next(error);
  }
}

async function eliminarSystemLog(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarSystemLog(Number(id));
    res.json({ mensaje: 'System log eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearSystemLog,
  obtenerTodosSystemLogs,
  obtenerSystemLogPorId,
  actualizarSystemLog,
  eliminarSystemLog,
};
