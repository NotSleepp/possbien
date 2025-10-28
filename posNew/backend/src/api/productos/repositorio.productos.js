import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosProductos(idEmpresa) {
  return await clienteBaseDeDatos('productos').where({ id_empresa: idEmpresa, eliminado: false });
}

// Productos por empresa con stock agregado (subconsulta para evitar GROUP BY estricto)
async function obtenerProductosConStockPorEmpresa(idEmpresa) {
  return await clienteBaseDeDatos({ p: 'productos' })
    .select(
      'p.*',
      clienteBaseDeDatos.raw(
        `(
          SELECT COALESCE(SUM(COALESCE(st.stock, st.cantidad_actual, 0)), 0)
          FROM stock st
          WHERE st.id_producto = p.id AND st.id_empresa = p.id_empresa
        ) AS stock_actual`
      )
    )
    .where({ 'p.id_empresa': idEmpresa, 'p.eliminado': false });
}

// Búsqueda de productos por empresa con texto libre en nombre/códigos
async function buscarProductosPorEmpresa(idEmpresa, q) {
  const termino = `%${q}%`;
  return await clienteBaseDeDatos({ p: 'productos' })
    .select(
      'p.*',
      clienteBaseDeDatos.raw(
        `(
          SELECT COALESCE(SUM(COALESCE(st.stock, st.cantidad_actual, 0)), 0)
          FROM stock st
          WHERE st.id_producto = p.id AND st.id_empresa = p.id_empresa
        ) AS stock_actual`
      )
    )
    .where({ 'p.id_empresa': idEmpresa, 'p.eliminado': false })
    .andWhere(function() {
      this.where('p.nombre', 'like', termino)
        .orWhere('p.codigo', 'like', termino)
        .orWhere('p.codigo_barras', 'like', termino)
        .orWhere('p.codigo_interno', 'like', termino);
    });
}

async function obtenerProductoPorId(id) {
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

async function obtenerPorCodigo(codigo, idEmpresa) {
  return await clienteBaseDeDatos('productos').where({ codigo, id_empresa: idEmpresa, eliminado: false }).first();
}

async function crearProducto(datos) {
  const [id] = await clienteBaseDeDatos('productos').insert(datos);
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

async function actualizarProducto(id, datos) {
  await clienteBaseDeDatos('productos').where({ id }).update(datos);
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

async function eliminarProducto(id) {
  await clienteBaseDeDatos('productos').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('productos').where({ id }).first();
}

export {
  obtenerTodosProductos,
  obtenerProductosConStockPorEmpresa,
  buscarProductosPorEmpresa,
  obtenerProductoPorId,
  obtenerPorCodigo,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
};
