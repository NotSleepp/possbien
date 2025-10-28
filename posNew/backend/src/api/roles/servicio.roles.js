import { esquemaCrearRol, esquemaActualizarRol } from './dto.roles.js';
import * as repositorio from './repositorio.roles.js';
import { UniqueConstraintError, DependencyError } from '../../shared/utils/errorHandler.js';

async function crearRol(datos) {
  const datosValidados = esquemaCrearRol.parse(datos);
  
  // Validar unicidad de nombre por empresa
  const existente = await repositorio.obtenerRolPorNombreYEmpresa(datosValidados.nombre, datosValidados.id_empresa);
  if (existente) {
    throw new UniqueConstraintError('nombre', datosValidados.nombre);
  }
  
  const mappedData = {
    id_empresa: datosValidados.id_empresa,
    nombre: datosValidados.nombre,
    descripcion: datosValidados.descripcion,
    ...(datosValidados.activo !== undefined ? { activo: datosValidados.activo } : {}),
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
  
  // Si se está actualizando el nombre, validar unicidad
  if (datosValidados.nombre) {
    const rolActual = await repositorio.obtenerRolPorId(id);
    if (!rolActual) {
      throw new Error('Rol no encontrado');
    }
    
    // Solo validar si el nombre cambió
    if (datosValidados.nombre !== rolActual.nombre) {
      const existente = await repositorio.obtenerRolPorNombreYEmpresa(datosValidados.nombre, rolActual.id_empresa);
      if (existente && existente.id !== id) {
        throw new UniqueConstraintError('nombre', datosValidados.nombre);
      }
    }
  }
  
  return await repositorio.actualizarRol(id, datosValidados);
}

async function eliminarRol(id) {
  await obtenerRolPorId(id); // Verifica existencia
  
  // Verificar si hay usuarios asignados a este rol
  const usuariosCount = await repositorio.contarUsuariosPorRol(id);
  if (usuariosCount > 0) {
    throw new DependencyError(
      'el rol',
      { usuarios: usuariosCount }
    );
  }
  
  return await repositorio.eliminarRol(id);
}

export { crearRol, obtenerTodosRoles, obtenerRolPorId, actualizarRol, eliminarRol };