import { esquemaCrearTipoComprobante, esquemaActualizarTipoComprobante } from './dto.tipos_comprobante.js';
import * as repositorio from './repositorio.tipos_comprobante.js';
import { UniqueConstraintError, DependencyError } from '../../shared/utils/errorHandler.js';

async function crearTipoComprobante(datos) {
  const v = esquemaCrearTipoComprobante.parse(datos);
  
  // Validar unicidad de código por empresa
  const existente = await repositorio.obtenerTipoComprobantePorCodigoYEmpresa(v.codigo, v.id_empresa);
  if (existente) {
    throw new UniqueConstraintError('código', v.codigo);
  }
  
  const mapped = {
    id_empresa: v.id_empresa,
    codigo: v.codigo,
    nombre: v.nombre,
    descripcion: v.descripcion,
    destino: v.destino,
    activo: v.activo,
  };
  return await repositorio.crearTipoComprobante(mapped);
}

async function obtenerTodosTiposComprobante() {
  return await repositorio.obtenerTodosTiposComprobante();
}

async function obtenerTiposComprobantePorEmpresa(idEmpresa) {
  return await repositorio.obtenerTiposComprobantePorEmpresa(idEmpresa);
}

async function obtenerTipoComprobantePorId(id) {
  const t = await repositorio.obtenerTipoComprobantePorId(id);
  if (!t) throw new Error('Tipo de comprobante no encontrado');
  return t;
}

async function actualizarTipoComprobante(id, datos) {
  const v = esquemaActualizarTipoComprobante.parse({ id, ...datos });
  
  // Si se está actualizando el código, validar unicidad
  if (v.codigo) {
    const tipoActual = await repositorio.obtenerTipoComprobantePorId(id);
    if (!tipoActual) {
      throw new Error('Tipo de comprobante no encontrado');
    }
    
    // Solo validar si el código cambió
    if (v.codigo !== tipoActual.codigo) {
      const existente = await repositorio.obtenerTipoComprobantePorCodigoYEmpresa(v.codigo, tipoActual.id_empresa);
      if (existente && existente.id !== id) {
        throw new UniqueConstraintError('código', v.codigo);
      }
    }
  }
  
  const mapped = {
    codigo: v.codigo,
    nombre: v.nombre,
    descripcion: v.descripcion,
    destino: v.destino,
    activo: v.activo,
  };
  const updates = Object.fromEntries(Object.entries(mapped).filter(([_, val]) => val !== undefined));
  return await repositorio.actualizarTipoComprobante(id, updates);
}

async function eliminarTipoComprobante(id) {
  // Verificar si hay ventas asociadas
  const ventasCount = await repositorio.contarVentasPorTipoComprobante(id);
  if (ventasCount > 0) {
    throw new DependencyError(
      'el tipo de comprobante',
      { ventas: ventasCount }
    );
  }
  
  return await repositorio.eliminarTipoComprobante(id);
}

export {
  crearTipoComprobante,
  obtenerTodosTiposComprobante,
  obtenerTiposComprobantePorEmpresa,
  obtenerTipoComprobantePorId,
  actualizarTipoComprobante,
  eliminarTipoComprobante,
};