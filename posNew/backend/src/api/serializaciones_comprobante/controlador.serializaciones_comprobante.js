import * as servicio from './servicio.serializaciones_comprobante.js';

async function crearSerializacion(req, res, next) {
  try {
    const s = await servicio.crearSerializacion(req.body);
    res.status(201).json({ mensaje: 'Serialización creada', datos: s });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodas(req, res, next) {
  try {
    const lista = await servicio.obtenerTodasSerializaciones();
    res.json(lista);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorId(req, res, next) {
  try {
    const { id } = req.params;
    const s = await servicio.obtenerSerializacionPorId(Number(id));
    res.json(s);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorSucursal(req, res, next) {
  try {
    const { idSucursal } = req.params;
    const lista = await servicio.obtenerSerializacionesPorSucursal(Number(idSucursal));
    res.json(lista);
  } catch (error) {
    next(error);
  }
}

async function obtenerPorTipo(req, res, next) {
  try {
    const { idTipoComprobante } = req.params;
    const lista = await servicio.obtenerSerializacionesPorTipo(Number(idTipoComprobante));
    res.json(lista);
  } catch (error) {
    next(error);
  }
}

async function actualizarSerializacion(req, res, next) {
  try {
    const { id } = req.params;
    const s = await servicio.actualizarSerializacion(Number(id), req.body);
    res.json({ mensaje: 'Serialización actualizada', datos: s });
  } catch (error) {
    next(error);
  }
}

async function eliminarSerializacion(req, res, next) {
  try {
    const { id } = req.params;
    const s = await servicio.eliminarSerializacion(Number(id));
    res.json({ mensaje: 'Serialización eliminada', datos: s });
  } catch (error) {
    next(error);
  }
}

export {
  crearSerializacion,
  obtenerTodas,
  obtenerPorId,
  obtenerPorSucursal,
  obtenerPorTipo,
  actualizarSerializacion,
  eliminarSerializacion,
};