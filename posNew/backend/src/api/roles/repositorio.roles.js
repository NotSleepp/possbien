import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosRoles(idEmpresa) {
  return await clienteBaseDeDatos('roles').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerRolPorId(id) {
  return await clienteBaseDeDatos('roles').where({ id }).first();
}

async function crearRol(datos) {
  const [id] = await clienteBaseDeDatos('roles').insert(datos);
  return await clienteBaseDeDatos('roles').where({ id }).first();
}

async function actualizarRol(id, datos) {
  await clienteBaseDeDatos('roles').where({ id }).update(datos);
  return await clienteBaseDeDatos('roles').where({ id }).first();
}

async function eliminarRol(id) {
  await clienteBaseDeDatos('roles').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('roles').where({ id }).first();
}

async function obtenerRolPorNombreYEmpresa(nombre, idEmpresa) {
  return await clienteBaseDeDatos('roles')
    .where({ nombre, id_empresa: idEmpresa, eliminado: false })
    .first();
}

async function contarUsuariosPorRol(idRol) {
  const result = await clienteBaseDeDatos('usuarios')
    .where({ id_rol: idRol, eliminado: false })
    .count('* as count')
    .first();
  return result?.count || 0;
}

export { 
  obtenerTodosRoles, 
  obtenerRolPorId, 
  crearRol, 
  actualizarRol, 
  eliminarRol,
  obtenerRolPorNombreYEmpresa,
  contarUsuariosPorRol
};