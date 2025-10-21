import * as servicio from './servicio.stocks.js';

async function crearStock(req, res, next) {
  try {
    const stock = await servicio.crearStock(req.body);
    res.status(201).json({ mensaje: 'Stock creado exitosamente', datos: stock });
  } catch (error) {
    next(error);
  }
}

async function obtenerStockPorId(req, res, next) {
  try {
    const { id } = req.params;
    const stock = await servicio.obtenerStockPorId(Number(id));
    res.json(stock);
  } catch (error) {
    next(error);
  }
}

async function obtenerStocksPorProducto(req, res, next) {
  try {
    const { idProducto } = req.params;
    const stocks = await servicio.obtenerStocksPorProducto(Number(idProducto));
    res.json(stocks);
  } catch (error) {
    next(error);
  }
}

async function obtenerStocksPorAlmacen(req, res, next) {
  try {
    const { idAlmacen } = req.params;
    const stocks = await servicio.obtenerStocksPorAlmacen(Number(idAlmacen));
    res.json(stocks);
  } catch (error) {
    next(error);
  }
}

async function actualizarStock(req, res, next) {
  try {
    const { id } = req.params;
    const stock = await servicio.actualizarStock(Number(id), req.body);
    res.json({ mensaje: 'Stock actualizado exitosamente', datos: stock });
  } catch (error) {
    next(error);
  }
}

export {
  crearStock,
  obtenerStockPorId,
  obtenerStocksPorProducto,
  obtenerStocksPorAlmacen,
  actualizarStock,
};