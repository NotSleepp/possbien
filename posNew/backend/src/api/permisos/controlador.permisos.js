import * as servicio from './servicio.permisos.js';

async function obtenerPermisosPorRol(req, res, next) {
  try {
    const { idRol } = req.params;
    const permisos = await servicio.obtenerPermisosPorRol(Number(idRol));
    res.json(permisos);
  } catch (error) {
    next(error);
  }
}

async function asignarPermiso(req, res, next) {
  try {
    const permiso = await servicio.asignarPermiso(req.body);
    res.status(201).json({ mensaje: 'Permiso asignado exitosamente', datos: permiso });
  } catch (error) {
    next(error);
  }
}

async function actualizarPermiso(req, res, next) {
  try {
    const { id } = req.params;
    const permiso = await servicio.actualizarPermiso(Number(id), req.body);
    res.json({ mensaje: 'Permiso actualizado exitosamente', datos: permiso });
  } catch (error) {
    next(error);
  }
}

async function eliminarPermiso(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarPermiso(Number(id));
    res.json({ mensaje: 'Permiso eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export { obtenerPermisosPorRol, asignarPermiso, actualizarPermiso, eliminarPermiso };