import * as servicio from './servicio.productos.js';

async function crearProducto(req, res, next) {
  try {
    const producto = await servicio.crearProducto(req.body, req.usuario);
    res.status(201).json({ mensaje: 'Producto creado exitosamente', datos: producto });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosProductos(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const productos = await servicio.obtenerTodosProductos(Number(idEmpresa), req.usuario);
    res.json(productos);
  } catch (error) {
    next(error);
  }
}

async function obtenerProductoPorId(req, res, next) {
  try {
    const { id } = req.params;
    const producto = await servicio.obtenerProductoPorId(Number(id));
    res.json(producto);
  } catch (error) {
    next(error);
  }
}

async function actualizarProducto(req, res, next) {
  try {
    const { id } = req.params;
    const producto = await servicio.actualizarProducto(Number(id), req.body, req.usuario);
    res.json({ mensaje: 'Producto actualizado exitosamente', datos: producto });
  } catch (error) {
    next(error);
  }
}

async function eliminarProducto(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarProducto(Number(id));
    res.json({ mensaje: 'Producto eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearProducto,
  obtenerTodosProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};
