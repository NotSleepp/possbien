import * as servicio from './servicio.audit_trails.js';

async function crearAuditTrail(req, res, next) {
  try {
    const audit = await servicio.crearAuditTrail(req.body);
    res.status(201).json({ mensaje: 'Audit trail creado exitosamente', datos: audit });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosAuditTrails(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const audits = await servicio.obtenerTodosAuditTrails(Number(idEmpresa));
    res.json(audits);
  } catch (error) {
    next(error);
  }
}

async function obtenerAuditTrailPorId(req, res, next) {
  try {
    const { id } = req.params;
    const audit = await servicio.obtenerAuditTrailPorId(Number(id));
    res.json(audit);
  } catch (error) {
    next(error);
  }
}

async function actualizarAuditTrail(req, res, next) {
  try {
    const { id } = req.params;
    const audit = await servicio.actualizarAuditTrail(Number(id), req.body);
    res.json({ mensaje: 'Audit trail actualizado exitosamente', datos: audit });
  } catch (error) {
    next(error);
  }
}

async function eliminarAuditTrail(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarAuditTrail(Number(id));
    res.json({ mensaje: 'Audit trail eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
    crearAuditTrail,
    obtenerTodosAuditTrails,
    obtenerAuditTrailPorId,
    actualizarAuditTrail,
    eliminarAuditTrail
};
