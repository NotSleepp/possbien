import * as servicio from './servicio.clientes.js';

async function crearCliente(req, res, next) {
  try {
    const cliente = await servicio.crearCliente(req.body, req.user);
    res.status(201).json({ mensaje: 'Cliente creado exitosamente', datos: cliente });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosClientes(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const clientes = await servicio.obtenerTodosClientes(Number(idEmpresa), req.user);
    res.json(clientes);
  } catch (error) {
    next(error);
  }
}

async function obtenerClientePorId(req, res, next) {
  try {
    const { id } = req.params;
    const cliente = await servicio.obtenerClientePorId(Number(id));
    res.json(cliente);
  } catch (error) {
    next(error);
  }
}

async function actualizarCliente(req, res, next) {
  try {
    const { id } = req.params;
    const cliente = await servicio.actualizarCliente(Number(id), req.body, req.user);
    res.json({ mensaje: 'Cliente actualizado exitosamente', datos: cliente });
  } catch (error) {
    next(error);
  }
}

async function eliminarCliente(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarCliente(Number(id), req.user);
    res.json({ mensaje: 'Cliente eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearCliente,
  obtenerTodosClientes,
  obtenerClientePorId,
  actualizarCliente,
  eliminarCliente,
};
