import * as servicio from './servicio.categorias.js';

async function crearCategoria(req, res, next) {
  try {
    const categoria = await servicio.crearCategoria(req.body);
    res.status(201).json({ mensaje: 'Categor�a creada exitosamente', datos: categoria });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodasCategorias(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const categorias = await servicio.obtenerTodasCategorias(Number(idEmpresa));
    res.json(categorias);
  } catch (error) {
    next(error);
  }
}

async function obtenerCategoriaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const categoria = await servicio.obtenerCategoriaPorId(Number(id));
    res.json(categoria);
  } catch (error) {
    next(error);
  }
}

async function actualizarCategoria(req, res, next) {
  try {
    const { id } = req.params;
    const categoria = await servicio.actualizarCategoria(Number(id), req.body);
    res.json({ mensaje: 'Categor�a actualizada exitosamente', datos: categoria });
  } catch (error) {
    next(error);
  }
}

async function eliminarCategoria(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarCategoria(Number(id));
    res.json({ mensaje: 'Categor�a eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
    crearCategoria,
    obtenerTodasCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
};
