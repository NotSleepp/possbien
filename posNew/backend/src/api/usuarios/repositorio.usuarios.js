import clienteBaseDeDatos from '../../config/baseDeDatos.js';
import bcrypt from 'bcryptjs';

async function obtenerTodosUsuarios(idEmpresa) {
  return await clienteBaseDeDatos('usuarios').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerUsuarioPorId(id) {
  return await clienteBaseDeDatos('usuarios').where({ id }).first();
}

async function crearUsuario(datos) {
  if (datos.password) {
    datos.password = await bcrypt.hash(datos.password, 10);
  }
  const [id] = await clienteBaseDeDatos('usuarios').insert(datos);
  return await clienteBaseDeDatos('usuarios').where({ id }).first();
}

async function actualizarUsuario(id, datos) {
  if (datos.password) {
    datos.password = await bcrypt.hash(datos.password, 10);
  }
  await clienteBaseDeDatos('usuarios').where({ id }).update(datos);
  return await clienteBaseDeDatos('usuarios').where({ id }).first();
}

async function eliminarUsuario(id) {
  await clienteBaseDeDatos('usuarios').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('usuarios').where({ id }).first();
}

async function obtenerUsuarioPorUsername(username) {
  return await clienteBaseDeDatos({ u: 'usuarios' })
    .leftJoin({ a: 'asignacion_sucursal' }, 'a.id_usuario', 'u.id')
    .select('u.*', 'a.id_sucursal as id_sucursal', 'a.id_caja as id_caja')
    .where({ 'u.username': username, 'u.eliminado': false })
    .orderBy('a.fecha_asignacion', 'desc')
    .first();
}

async function obtenerUsuarioPorEmpresaYUsername(idEmpresa, username) {
  return await clienteBaseDeDatos('usuarios')
    .where({ id_empresa: idEmpresa, username, eliminado: false })
    .first();
}

async function contarSesionesActivasPorUsuario(idUsuario) {
  const result = await clienteBaseDeDatos('sesiones')
    .where({ id_usuario: idUsuario, activo: true })
    .count('* as count')
    .first();
  return result?.count || 0;
}

async function contarVentasPorUsuario(idUsuario) {
  const result = await clienteBaseDeDatos('ventas')
    .where({ id_usuario: idUsuario, eliminado: false })
    .count('* as count')
    .first();
  return result?.count || 0;
}

export { 
  obtenerTodosUsuarios, 
  obtenerUsuarioPorId, 
  crearUsuario, 
  actualizarUsuario, 
  eliminarUsuario, 
  obtenerUsuarioPorUsername,
  obtenerUsuarioPorEmpresaYUsername,
  contarSesionesActivasPorUsuario,
  contarVentasPorUsuario
};