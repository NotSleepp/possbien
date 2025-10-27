import { esquemaCrearMetodoPago, esquemaActualizarMetodoPago } from './dto.metodos_pago.js';
import * as repositorio from './repositorio.metodos_pago.js';
import { UniqueConstraintError } from '../../shared/utils/errorHandler.js';

export async function crearMetodoPago(datos) {
  const d = esquemaCrearMetodoPago.parse(datos);
  
  // Validar unicidad de código por empresa
  const existente = await repositorio.obtenerMetodoPagoPorCodigoYEmpresa(d.codigo, d.id_empresa);
  if (existente) {
    throw new UniqueConstraintError('código', d.codigo);
  }
  
  const m = {
    id_empresa: d.id_empresa,
    codigo: d.codigo,
    nombre: d.nombre,
    descripcion: d.descripcion || null,
    imagen: d.imagen || null,
    requiere_referencia: d.requiere_referencia ?? false,
    activo: d.activo ?? true
  };
  return repositorio.crearMetodoPago(m);
}

export async function obtenerMetodosPagoPorEmpresa(idEmpresa) {
  return repositorio.obtenerMetodosPagoPorEmpresa(idEmpresa);
}

export async function obtenerMetodoPagoPorId(id) {
  const mp = await repositorio.obtenerMetodoPagoPorId(id);
  if (!mp) throw new Error('Método de pago no encontrado');
  return mp;
}

export async function actualizarMetodoPago(id, datos) {
  const d = esquemaActualizarMetodoPago.parse({ id, ...datos });
  
  // Si se está actualizando el código, validar unicidad
  if (d.codigo) {
    const metodoActual = await repositorio.obtenerMetodoPagoPorId(id);
    if (!metodoActual) {
      throw new Error('Método de pago no encontrado');
    }
    
    // Solo validar si el código cambió
    if (d.codigo !== metodoActual.codigo) {
      const existente = await repositorio.obtenerMetodoPagoPorCodigoYEmpresa(d.codigo, metodoActual.id_empresa);
      if (existente && existente.id !== id) {
        throw new UniqueConstraintError('código', d.codigo);
      }
    }
  }
  
  const m = {
    codigo: d.codigo,
    nombre: d.nombre,
    descripcion: d.descripcion,
    imagen: d.imagen,
    requiere_referencia: d.requiere_referencia,
    activo: d.activo
  };
  const updates = Object.fromEntries(Object.entries(m).filter(([_, v]) => v !== undefined));
  return repositorio.actualizarMetodoPago(id, updates);
}

export async function eliminarMetodoPago(id) {
  return repositorio.eliminarMetodoPago(id);
}