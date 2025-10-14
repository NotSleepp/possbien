import * as servicio from './servicio.roles.js';

async function crearRol(req, res, next) {
  try {
    const rol = await servicio.crearRol(req.body);
    res.status(201).json({ mensaje: 'Rol creado exitosamente', datos: rol });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosRoles(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const roles = await servicio.obtenerTodosRoles(Number(idEmpresa));
    res.json(roles);
  } catch (error) {
    next(error);
  }
}

async function obtenerRolPorId(req, res, next) {
  try {
    const { id } = req.params;
    const rol = await servicio.obtenerRolPorId(Number(id));
    res.json(rol);
  } catch (error) {
    next(error);
  }
}

async function actualizarRol(req, res, next) {
  try {
    const { id } = req.params;
    const rol = await servicio.actualizarRol(Number(id), req.body);
    res.json({ mensaje: 'Rol actualizado exitosamente', datos: rol });
  } catch (error) {
    next(error);
  }
}

async function eliminarRol(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarRol(Number(id));
    res.json({ mensaje: 'Rol eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export { crearRol, obtenerTodosRoles, obtenerRolPorId, actualizarRol, eliminarRol };