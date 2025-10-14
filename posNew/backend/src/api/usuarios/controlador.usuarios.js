import * as servicio from './servicio.usuarios.js';

async function crearUsuario(req, res, next) {
  try {
    const usuario = await servicio.crearUsuario(req.body);
    res.status(201).json({ mensaje: 'Usuario creado exitosamente', datos: usuario });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosUsuarios(req, res, next) {
  try {
    const { idEmpresa } = req.params; // Asumiendo que idEmpresa viene en params o auth
    const usuarios = await servicio.obtenerTodosUsuarios(Number(idEmpresa));
    res.json(usuarios);
  } catch (error) {
    next(error);
  }
}

async function obtenerUsuarioPorId(req, res, next) {
  try {
    const { id } = req.params;
    const usuario = await servicio.obtenerUsuarioPorId(Number(id));
    res.json(usuario);
  } catch (error) {
    next(error);
  }
}

async function actualizarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    const usuario = await servicio.actualizarUsuario(Number(id), req.body);
    res.json({ mensaje: 'Usuario actualizado exitosamente', datos: usuario });
  } catch (error) {
    next(error);
  }
}

async function eliminarUsuario(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarUsuario(Number(id));
    res.json({ mensaje: 'Usuario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const resultado = await servicio.login(req.body);
    res.json({ mensaje: 'Login exitoso', ...resultado });
  } catch (error) {
    next(error);
  }
}

async function crearUsuarioPorAdmin(req, res, next) {
  try {
    const usuario = await servicio.crearUsuarioPorAdmin(req.body, req.user);
    res.status(201).json({ mensaje: 'Usuario creado exitosamente por admin', datos: usuario });
  } catch (error) {
    next(error);
  }
}

export { crearUsuario, obtenerTodosUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario, login, crearUsuarioPorAdmin };