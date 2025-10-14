import * as servicio from './servicio.inventarios.js';

async function crearInventario(req, res, next) {
  try {
    const inventario = await servicio.crearInventario(req.body);
    res.status(201).json({ mensaje: 'Inventario creado exitosamente', datos: inventario });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosInventarios(req, res, next) {
  try {
    const { idSucursal } = req.params;
    const inventarios = await servicio.obtenerTodosInventarios(Number(idSucursal));
    res.json(inventarios);
  } catch (error) {
    next(error);
  }
}

async function obtenerInventarioPorId(req, res, next) {
  try {
    const { id } = req.params;
    const inventario = await servicio.obtenerInventarioPorId(Number(id));
    res.json(inventario);
  } catch (error) {
    next(error);
  }
}

async function actualizarInventario(req, res, next) {
  try {
    const { id } = req.params;
    const inventario = await servicio.actualizarInventario(Number(id), req.body);
    res.json({ mensaje: 'Inventario actualizado exitosamente', datos: inventario });
  } catch (error) {
    next(error);
  }
}

async function eliminarInventario(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarInventario(Number(id));
    res.json({ mensaje: 'Inventario eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearInventario,
  obtenerTodosInventarios,
  obtenerInventarioPorId,
  actualizarInventario,
  eliminarInventario,
};
