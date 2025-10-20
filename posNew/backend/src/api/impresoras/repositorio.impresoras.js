import db from '../../config/baseDeDatos.js';

export async function crearImpresora(datos) {
  const [id] = await db('impresoras').insert(datos);
  return db('impresoras').where({ id }).first();
}
export async function obtenerImpresorasPorEmpresa(idEmpresa) {
  return db('impresoras').where({ id_empresa: idEmpresa, eliminado: false });
}
export async function obtenerImpresoraPorId(id) {
  return db('impresoras').where({ id }).first();
}
export async function actualizarImpresora(id, datos) {
  await db('impresoras').where({ id }).update({ ...datos, fecha_actualizacion: db.fn.now() });
  return db('impresoras').where({ id }).first();
}
export async function eliminarImpresora(id) {
  await db('impresoras').where({ id }).update({ eliminado: true, fecha_eliminacion: db.fn.now() });
}