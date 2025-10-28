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
    // Normalizar payload
    const normalizados = (permisos || []).map((permiso) => ({
      id_empresa,
      id_rol,
      id_modulo: Number(permiso.id_modulo),
      puede_ver: !!permiso.puede_ver,
      puede_crear: !!permiso.puede_crear,
      puede_editar: !!permiso.puede_editar,
      puede_eliminar: !!permiso.puede_eliminar,
    }));

    const activos = normalizados.filter(
      (p) => p.puede_ver || p.puede_crear || p.puede_editar || p.puede_eliminar
    );
    const idsActivos = activos.map((p) => p.id_modulo);
    const idsTodos = normalizados.map((p) => p.id_modulo);

    // Caso: si no se envían permisos, desactivar todos los existentes del rol
    if (normalizados.length === 0) {
      await trx('permisos')
        .where({ id_rol, id_empresa })
        .update({
          eliminado: true,
          fecha_eliminacion: trx.fn.now(),
          puede_ver: false,
          puede_crear: false,
          puede_editar: false,
          puede_eliminar: false,
        });
    } else {
      // Upsert de permisos activos (evita conflicto UNIQUE(id_rol, id_modulo))
      if (activos.length > 0) {
        await trx('permisos')
          .insert(
            activos.map((p) => ({
              id_empresa: p.id_empresa,
              id_rol: p.id_rol,
              id_modulo: p.id_modulo,
              puede_ver: p.puede_ver,
              puede_crear: p.puede_crear,
              puede_editar: p.puede_editar,
              puede_eliminar: p.puede_eliminar,
              eliminado: false,
            }))
          )
          .onConflict(['id_rol', 'id_modulo'])
          .merge(['puede_ver', 'puede_crear', 'puede_editar', 'puede_eliminar', 'eliminado']);
      }

      // Desactivar permisos no activos o no incluidos (soft delete sin crear duplicados)
      await trx('permisos')
        .where({ id_rol, id_empresa })
        .andWhere((qb) => {
          if (idsActivos.length > 0) {
            qb.whereNotIn('id_modulo', idsActivos);
          } else if (idsTodos.length > 0) {
            qb.whereNotIn('id_modulo', idsTodos);
          }
        })
        .update({
          eliminado: true,
          fecha_eliminacion: trx.fn.now(),
          puede_ver: false,
          puede_crear: false,
          puede_editar: false,
          puede_eliminar: false,
        });

      // Si se incluyeron módulos con todos los permisos en false explícitamente, marcarlos como eliminados
      const idsInactivosExplícitos = normalizados
        .filter((p) => !p.puede_ver && !p.puede_crear && !p.puede_editar && !p.puede_eliminar)
        .map((p) => p.id_modulo);
      if (idsInactivosExplícitos.length > 0) {
        await trx('permisos')
          .where({ id_rol, id_empresa })
          .whereIn('id_modulo', idsInactivosExplícitos)
          .update({
            eliminado: true,
            fecha_eliminacion: trx.fn.now(),
            puede_ver: false,
            puede_crear: false,
            puede_editar: false,
            puede_eliminar: false,
          });
      }
    }

    // Retornar los permisos activos actualizados
    return await trx('permisos')
      .select('permisos.*', 'modulos.nombre as nombre_modulo')
      .leftJoin('modulos', 'permisos.id_modulo', 'modulos.id')
      .where({ 'permisos.id_rol': id_rol, 'permisos.id_empresa': id_empresa, 'permisos.eliminado': false });
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