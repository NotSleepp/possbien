import { esquemaCrearCategoria, esquemaActualizarCategoria } from './dto.categorias.js';
import * as repositorio from './repositorio.categorias.js';

/**
 * Crea una nueva categoría en la base de datos después de validar los datos.
 * @param {object} datos - Los datos de la categoría a crear.
 * @param {number} datos.idEmpresa - ID de la empresa propietaria de la categoría.
 * @param {string} datos.nombre - Nombre de la categoría.
 * @param {string} [datos.descripcion] - Descripción opcional de la categoría.
 * @returns {Promise<object>} El objeto de la categoría recién creada.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function crearCategoria(datos) {
  const datosValidados = esquemaCrearCategoria.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    descripcion: datosValidados.descripcion,
  };
  return await repositorio.crearCategoria(mappedData);
}

/**
 * Obtiene todas las categorías activas de una empresa específica.
 * @param {number} idEmpresa - ID de la empresa.
 * @returns {Promise<Array>} Lista de categorías de la empresa.
 */
async function obtenerTodasCategorias(idEmpresa) {
  return await repositorio.obtenerTodasCategorias(idEmpresa);
}

/**
 * Obtiene una categoría específica por su ID.
 * @param {number} id - ID de la categoría a buscar.
 * @returns {Promise<object>} La categoría encontrada.
 * @throws {Error} Si la categoría no existe.
 */
async function obtenerCategoriaPorId(id) {
  const categoria = await repositorio.obtenerCategoriaPorId(id);
  if (!categoria) {
    throw new Error('Categoría no encontrada');
  }
  return categoria;
}

/**
 * Actualiza una categoría existente con nuevos datos.
 * @param {number} id - ID de la categoría a actualizar.
 * @param {object} datos - Datos a actualizar de la categoría.
 * @returns {Promise<object>} La categoría actualizada.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function actualizarCategoria(id, datos) {
  const datosValidados = esquemaActualizarCategoria.parse({ id, ...datos });
  return await repositorio.actualizarCategoria(id, datosValidados);
}

/**
 * Elimina una categoría de forma lógica (soft delete).
 * @param {number} id - ID de la categoría a eliminar.
 * @returns {Promise<object>} La categoría marcada como eliminada.
 * @throws {Error} Si la categoría no existe.
 */
async function eliminarCategoria(id) {
  await obtenerCategoriaPorId(id);
  return await repositorio.eliminarCategoria(id);
}

export {
    crearCategoria,
    obtenerTodasCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
};
