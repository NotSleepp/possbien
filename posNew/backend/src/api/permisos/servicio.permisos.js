import clienteBaseDeDatos from '../../config/baseDeDatos.js';
const knex = clienteBaseDeDatos;

/**
 * Obtiene todos los permisos de un rol con información del módulo
 */
async function obtenerPermisosPorRol(idRol) {
  return await knex('permisos')
    .select(
      'permisos.*',
      'modulos.nombre as nombre_modulo',
      'modulos.descripcion as descripcion_modulo',
      'modulos.icono as icono_modulo'
    )
    .leftJoin('modulos', 'permisos.id_modulo', 'modulos.id')
    .where({ 
      'permisos.id_rol': idRol, 
      'permisos.eliminado': false 
    })
    .orderBy('modulos.orden', 'asc');
}

/**
 * Actualiza masivamente los permisos de un rol
 * Elimina los permisos existentes e inserta los nuevos en una transacción
 */
async function actualizarPermisosMasivo(datos) {
  const { id_empresa, id_rol, permisos } = datos;

  return await knex.transaction(async (trx) => {
    // Eliminar permisos existentes del rol (eliminación lógica)
    await trx('permisos')
      .where({ id_rol, id_empresa })
      .update({ 
        eliminado: true, 
        fecha_eliminacion: trx.fn.now() 
      });

    // Insertar nuevos permisos
    const permisosParaInsertar = permisos.map(permiso => ({
      id_empresa: permiso.id_empresa,
      id_rol: permiso.id_rol,
      id_modulo: permiso.id_modulo,
      puede_ver: permiso.puede_ver || false,
      puede_crear: permiso.puede_crear || false,
      puede_editar: permiso.puede_editar || false,
      puede_eliminar: permiso.puede_eliminar || false,
      eliminado: false,
      fecha_creacion: trx.fn.now()
    }));

    // Filtrar solo los permisos que tienen al menos un permiso activo
    const permisosActivos = permisosParaInsertar.filter(p => 
      p.puede_ver || p.puede_crear || p.puede_editar || p.puede_eliminar
    );

    if (permisosActivos.length > 0) {
      await trx('permisos').insert(permisosActivos);
    }

    // Retornar los permisos actualizados
    return await trx('permisos')
      .select(
        'permisos.*',
        'modulos.nombre as nombre_modulo'
      )
      .leftJoin('modulos', 'permisos.id_modulo', 'modulos.id')
      .where({ 
        'permisos.id_rol': id_rol, 
        'permisos.eliminado': false 
      });
  });
}

/**
 * Asigna un permiso individual (legacy - mantener por compatibilidad)
 */
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

/**
 * Actualiza un permiso individual (legacy - mantener por compatibilidad)
 */
async function actualizarPermiso(id, datos) {
  await knex('permisos').where('id', id).update({
    puede_ver: datos.puedeVer,
    puede_crear: datos.puedeCrear,
    puede_editar: datos.puedeEditar,
    puede_eliminar: datos.puedeEliminar
  });
  return await knex('permisos').where('id', id).first();
}

/**
 * Elimina un permiso individual (legacy - mantener por compatibilidad)
 */
async function eliminarPermiso(id) {
  await knex('permisos').where('id', id).update({ eliminado: true, fecha_eliminacion: knex.fn.now() });
}

export { 
  obtenerPermisosPorRol, 
  actualizarPermisosMasivo,
  asignarPermiso, 
  actualizarPermiso, 
  eliminarPermiso 
};