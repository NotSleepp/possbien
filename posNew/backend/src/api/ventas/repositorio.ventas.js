import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasVentas(idSucursal) {
  return await clienteBaseDeDatos('ventas').where({ id_sucursal: idSucursal, eliminado: false });
}

async function obtenerVentaPorId(id) {
  return await clienteBaseDeDatos('ventas').where({ id }).first();
}

async function crearVenta(datos) {
  const [id] = await clienteBaseDeDatos('ventas').insert(datos);
  return await clienteBaseDeDatos('ventas').where({ id }).first();
}

async function actualizarVenta(id, datos) {
  await clienteBaseDeDatos('ventas').where({ id }).update(datos);
  return await clienteBaseDeDatos('ventas').where({ id }).first();
}

async function eliminarVenta(id) {
  await clienteBaseDeDatos('ventas').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('ventas').where({ id }).first();
}

export {
  obtenerTodasVentas,
  obtenerVentaPorId,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
};
