import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const TABLA = 'stock';

async function obtenerStockPorId(id) {
  return await clienteBaseDeDatos(TABLA)
    .where({ id })
    .first();
}

async function obtenerStocksPorProducto(idProducto) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_producto: idProducto });
}

async function obtenerStocksPorAlmacen(idAlmacen) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_almacen: idAlmacen });
}

async function crearStock(datos) {
  const [id] = await clienteBaseDeDatos(TABLA).insert({
    id_empresa: datos.id_empresa,
    id_producto: datos.id_producto,
    id_almacen: datos.id_almacen,
    cantidad_actual: datos.cantidad_actual ?? 0,
    cantidad_reservada: datos.cantidad_reservada ?? 0,
    stock_minimo: datos.stock_minimo ?? 0,
    stock_maximo: datos.stock_maximo ?? 0,
    ubicacion: datos.ubicacion,
  });
  return await obtenerStockPorId(id);
}

async function actualizarStock(id, datos) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      id_empresa: datos.id_empresa,
      id_producto: datos.id_producto,
      id_almacen: datos.id_almacen,
      cantidad_actual: datos.cantidad_actual,
      cantidad_reservada: datos.cantidad_reservada,
      stock_minimo: datos.stock_minimo,
      stock_maximo: datos.stock_maximo,
      ubicacion: datos.ubicacion,
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerStockPorId(id);
}

export {
  obtenerStockPorId,
  obtenerStocksPorProducto,
  obtenerStocksPorAlmacen,
  crearStock,
  actualizarStock,
};