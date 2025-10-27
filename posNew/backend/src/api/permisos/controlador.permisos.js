import * as servicio from './servicio.permisos.js';
import * as servicioModulos from '../modulos/servicio.modulos.js';

/**
 * Obtiene todos los permisos de un rol específico
 */
async function obtenerPermisosPorRol(req, res, next) {
  try {
    const { idRol } = req.params;
    const permisos = await servicio.obtenerPermisosPorRol(Number(idRol));
    res.json(permisos);
  } catch (error) {
    next(error);
  }
}

/**
 * Obtiene todos los módulos del sistema
 */
async function obtenerModulos(req, res, next) {
  try {
    const modulos = await servicioModulos.obtenerTodos();
    res.json(modulos);
  } catch (error) {
    next(error);
  }
}

/**
 * Actualiza masivamente los permisos de un rol (matriz completa)
 */
async function actualizarPermisosMasivo(req, res, next) {
  try {
    const resultado = await servicio.actualizarPermisosMasivo(req.body);
    res.json({ 
      mensaje: 'Permisos actualizados exitosamente', 
      datos: resultado 
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Asigna un permiso individual (legacy - mantener por compatibilidad)
 */
async function asignarPermiso(req, res, next) {
  try {
    const permiso = await servicio.asignarPermiso(req.body);
    res.status(201).json({ mensaje: 'Permiso asignado exitosamente', datos: permiso });
  } catch (error) {
    next(error);
  }
}

/**
 * Actualiza un permiso individual (legacy - mantener por compatibilidad)
 */
async function actualizarPermiso(req, res, next) {
  try {
    const { id } = req.params;
    const permiso = await servicio.actualizarPermiso(Number(id), req.body);
    res.json({ mensaje: 'Permiso actualizado exitosamente', datos: permiso });
  } catch (error) {
    next(error);
  }
}

/**
 * Elimina un permiso individual (legacy - mantener por compatibilidad)
 */
async function eliminarPermiso(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarPermiso(Number(id));
    res.json({ mensaje: 'Permiso eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export { 
  obtenerPermisosPorRol, 
  obtenerModulos,
  actualizarPermisosMasivo,
  asignarPermiso, 
  actualizarPermiso, 
  eliminarPermiso 
};