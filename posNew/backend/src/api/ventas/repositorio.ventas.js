import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const TABLA = 'ventas';

async function obtenerTodasVentas(idSucursal) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_sucursal: idSucursal, eliminado: 0 });
}

async function obtenerVentaPorId(id) {
  return await clienteBaseDeDatos(TABLA)
    .where({ id })
    .first();
}

async function crearVenta(datos) {
  const [id] = await clienteBaseDeDatos(TABLA).insert(datos);
  return await obtenerVentaPorId(id);
}

async function actualizarVenta(id, datos) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      id_sucursal: datos.id_sucursal,
      id_cliente: datos.id_cliente,
      fecha_venta: datos.fecha_venta,
      monto_total: datos.monto_total,
      estado: datos.estado,
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerVentaPorId(id);
}

async function eliminarVenta(id) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({ eliminado: 1, fecha_actualizacion: clienteBaseDeDatos.fn.now() });
}

export {
  obtenerTodasVentas,
  obtenerVentaPorId,
  crearVenta,
  actualizarVenta,
  eliminarVenta,
};
