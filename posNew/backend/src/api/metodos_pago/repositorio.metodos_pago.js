import db from '../../config/baseDeDatos.js';

export async function crearMetodoPago(datos) {
  const [id] = await db('metodos_pago').insert(datos);
  return db('metodos_pago').where({ id }).first();
}

export async function obtenerMetodosPagoPorEmpresa(idEmpresa) {
  return db('metodos_pago').where({ id_empresa: idEmpresa, eliminado: false });
}

export async function obtenerMetodoPagoPorId(id) {
  return db('metodos_pago').where({ id }).first();
}

export async function obtenerMetodoPagoPorCodigoYEmpresa(codigo, idEmpresa) {
  return db('metodos_pago')
    .where({ codigo, id_empresa: idEmpresa, eliminado: false })
    .first();
}

export async function actualizarMetodoPago(id, datos) {
  await db('metodos_pago').where({ id }).update({ ...datos, fecha_actualizacion: db.fn.now() });
  return db('metodos_pago').where({ id }).first();
}

export async function eliminarMetodoPago(id) {
  await db('metodos_pago').where({ id }).update({ eliminado: true, fecha_eliminacion: db.fn.now() });
}

export async function contarTransaccionesPorMetodoPago(idMetodoPago) {
  const result = await db('formas_pago_venta')
    .where({ id_metodo_pago: idMetodoPago })
    .count('* as count')
    .first();
  return result?.count || 0;
}