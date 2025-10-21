import { esquemaCrearStock, esquemaActualizarStock } from './dto.stocks.js';
import * as repositorio from './repositorio.stocks.js';

async function crearStock(datos) {
  const datosValidados = esquemaCrearStock.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    id_producto: datosValidados.idProducto,
    id_almacen: datosValidados.idAlmacen,
    cantidad_actual: datosValidados.cantidadActual,
    cantidad_reservada: datosValidados.cantidadReservada,
    stock_minimo: datosValidados.stockMinimo,
    stock_maximo: datosValidados.stockMaximo,
    ubicacion: datosValidados.ubicacion,
  };
  return await repositorio.crearStock(mappedData);
}

async function obtenerStockPorId(id) {
  const stock = await repositorio.obtenerStockPorId(id);
  if (!stock) {
    throw new Error('Stock no encontrado');
  }
  return stock;
}

async function obtenerStocksPorProducto(idProducto) {
  return await repositorio.obtenerStocksPorProducto(idProducto);
}

async function obtenerStocksPorAlmacen(idAlmacen) {
  return await repositorio.obtenerStocksPorAlmacen(idAlmacen);
}

async function actualizarStock(id, datos) {
  const datosValidados = esquemaActualizarStock.parse({ id, ...datos });
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    id_producto: datosValidados.idProducto,
    id_almacen: datosValidados.idAlmacen,
    cantidad_actual: datosValidados.cantidadActual,
    cantidad_reservada: datosValidados.cantidadReservada,
    stock_minimo: datosValidados.stockMinimo,
    stock_maximo: datosValidados.stockMaximo,
    ubicacion: datosValidados.ubicacion,
  };
  return await repositorio.actualizarStock(id, mappedData);
}

export {
  crearStock,
  obtenerStockPorId,
  obtenerStocksPorProducto,
  obtenerStocksPorAlmacen,
  actualizarStock,
};