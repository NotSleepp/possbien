import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasCompras(idSucursal) {
  return await clienteBaseDeDatos('compra').where({ id_sucursal: idSucursal, eliminado: false });
}

async function obtenerCompraPorId(id) {
  return await clienteBaseDeDatos('compra').where({ id }).first();
}

async function crearCompra(datos) {
  const [id] = await clienteBaseDeDatos('compra').insert(datos);
  return await clienteBaseDeDatos('compra').where({ id }).first();
}

async function actualizarCompra(id, datos) {
  await clienteBaseDeDatos('compra').where({ id }).update(datos);
  return await clienteBaseDeDatos('compra').where({ id }).first();
}

async function eliminarCompra(id) {
  await clienteBaseDeDatos('compra').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('compra').where({ id }).first();
}

export { obtenerTodasCompras, obtenerCompraPorId, crearCompra, actualizarCompra, eliminarCompra };
