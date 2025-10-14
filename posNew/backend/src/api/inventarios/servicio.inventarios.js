import { esquemaCrearInventario, esquemaActualizarInventario } from './dto.inventarios.js';
import * as repositorio from './repositorio.inventarios.js';

async function crearInventario(datos) {
  const datosValidados = esquemaCrearInventario.parse(datos);
  const mappedData = {
    id_producto: datosValidados.idProducto,
    id_sucursal: datosValidados.idSucursal,
    cantidad_actual: datosValidados.cantidadActual,
    stock_minimo: datosValidados.stockMinimo,
    stock_maximo: datosValidados.stockMaximo,
  };
  return await repositorio.crearInventario(mappedData);
}

async function obtenerTodosInventarios(idSucursal) {
  return await repositorio.obtenerTodosInventarios(idSucursal);
}

async function obtenerInventarioPorId(id) {
  const inventario = await repositorio.obtenerInventarioPorId(id);
  if (!inventario) {
    throw new Error('Inventario no encontrado');
  }
  return inventario;
}

async function actualizarInventario(id, datos) {
  const datosValidados = esquemaActualizarInventario.parse({ id, ...datos });
  return await repositorio.actualizarInventario(id, datosValidados);
}

async function eliminarInventario(id) {
  await obtenerInventarioPorId(id);
  return await repositorio.eliminarInventario(id);
}

export {
  crearInventario,
  obtenerTodosInventarios,
  obtenerInventarioPorId,
  actualizarInventario,
  eliminarInventario,
};
