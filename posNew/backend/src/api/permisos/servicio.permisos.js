import clienteBaseDeDatos from '../../config/baseDeDatos.js';
const knex = clienteBaseDeDatos;

async function obtenerPermisosPorRol(idRol) {
  return await knex('permisos').where({ id_rol: idRol, eliminado: false });
}

async function asignarPermiso(datos) {
  const [id] = await knex('permisos').insert({
    id_empresa: datos.idEmpresa,
    id_rol: datos.idRol,
    id_modulo: datos.idModulo,
    puede_ver: datos.puedeVer || false,
    puede_crear: datos.puedeCrear || false,
    puede_editar: datos.puedeEditar || false,
    puede_eliminar: datos.puedeEliminar || false
  });
  return await knex('permisos').where('id', id).first();
}

async function actualizarPermiso(id, datos) {
  await knex('permisos').where('id', id).update({
    puede_ver: datos.puedeVer,
    puede_crear: datos.puedeCrear,
    puede_editar: datos.puedeEditar,
    puede_eliminar: datos.puedeEliminar
  });
  return await knex('permisos').where('id', id).first();
}

async function eliminarPermiso(id) {
  await knex('permisos').where('id', id).update({ eliminado: true, fecha_eliminacion: knex.fn.now() });
}

export { obtenerPermisosPorRol, asignarPermiso, actualizarPermiso, eliminarPermiso };