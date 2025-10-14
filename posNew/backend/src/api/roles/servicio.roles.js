import { esquemaCrearRol, esquemaActualizarRol } from './dto.roles.js';
import * as repositorio from './repositorio.roles.js';

async function crearRol(datos) {
  const datosValidados = esquemaCrearRol.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    descripcion: datosValidados.descripcion,
  };
  return await repositorio.crearRol(mappedData);
}

async function obtenerTodosRoles(idEmpresa) {
  return await repositorio.obtenerTodosRoles(idEmpresa);
}

async function obtenerRolPorId(id) {
  const rol = await repositorio.obtenerRolPorId(id);
  if (!rol) {
    throw new Error('Rol no encontrado');
  }
  return rol;
}

async function actualizarRol(id, datos) {
  const datosValidados = esquemaActualizarRol.parse({ id, ...datos });
  return await repositorio.actualizarRol(id, datosValidados);
}

async function eliminarRol(id) {
  await obtenerRolPorId(id); // Verifica existencia
  return await repositorio.eliminarRol(id);
}

export { crearRol, obtenerTodosRoles, obtenerRolPorId, actualizarRol, eliminarRol };