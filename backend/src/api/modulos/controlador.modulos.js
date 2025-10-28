import * as servicio from './servicio.modulos.js';

async function obtenerTodosModulos(req, res, next) {
  try {
    const modulos = await servicio.obtenerTodos();
    res.json(modulos);
  } catch (error) {
    next(error);
  }
}

async function obtenerModuloPorId(req, res, next) {
  try {
    const { id } = req.params;
    const modulo = await servicio.obtenerPorId(Number(id));
    if (!modulo) {
      return res.status(404).json({ mensaje: 'Módulo no encontrado' });
    }
    res.json(modulo);
  } catch (error) {
    next(error);
  }
}

export { obtenerTodosModulos, obtenerModuloPorId };