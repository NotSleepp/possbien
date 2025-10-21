import * as servicio from './servicio.tipos_comprobante.js';

async function crearTipoComprobante(req, res, next) {
  try {
    const t = await servicio.crearTipoComprobante(req.body);
    res.status(201).json({ mensaje: 'Tipo de comprobante creado', datos: t });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodos(req, res, next) {
  try {
    const lista = await servicio.obtenerTodosTiposComprobante();
    res.json(lista);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const { id } = req.params;
    const t = await servicio.obtenerTipoComprobantePorId(Number(id));
    res.json(t);
  } catch (error) {
    next(error);
  }
}

async function actualizarTipoComprobante(req, res, next) {
  try {
    const { id } = req.params;
    const t = await servicio.actualizarTipoComprobante(Number(id), req.body);
    res.json({ mensaje: 'Tipo de comprobante actualizado', datos: t });
  } catch (error) {
    next(error);
  }
}

async function eliminarTipoComprobante(req, res, next) {
  try {
    const { id } = req.params;
    const t = await servicio.eliminarTipoComprobante(Number(id));
    res.json({ mensaje: 'Tipo de comprobante eliminado', datos: t });
  } catch (error) {
    next(error);
  }
}

export {
  crearTipoComprobante,
  obtenerTodos,
  obtenerPorId,
  actualizarTipoComprobante,
  eliminarTipoComprobante,
};