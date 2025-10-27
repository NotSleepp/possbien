import clienteBaseDeDatos from '../../config/baseDeDatos.js';
const knex = clienteBaseDeDatos;

/**
 * Obtiene todos los módulos del sistema ordenados por orden
 */
async function obtenerTodos() {
  return await knex('modulos')
    .where({ eliminado: false })
    .orderBy('orden', 'asc');
}

/**
 * Obtiene un módulo por ID
 */
async function obtenerPorId(id) {
  return await knex('modulos')
    .where({ id, eliminado: false })
    .first();
}

export { 
  obtenerTodos,
  obtenerPorId
};
