import { esquemaCrearMetodoPago, esquemaActualizarMetodoPago } from './dto.metodos_pago.js';
import * as repositorio from './repositorio.metodos_pago.js';

export async function crearMetodoPago(datos) {
  const d = esquemaCrearMetodoPago.parse(datos);
  const m = {
    id_empresa: d.idEmpresa,
    codigo: d.codigo,
    nombre: d.nombre,
    descripcion: d.descripcion || null,
    imagen: d.imagen || null,
    requiere_referencia: d.requiereReferencia ?? false,
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
  const m = {
    codigo: d.codigo,
    nombre: d.nombre,
    descripcion: d.descripcion,
    imagen: d.imagen,
    requiere_referencia: d.requiereReferencia,
    activo: d.activo
  };
  const updates = Object.fromEntries(Object.entries(m).filter(([_, v]) => v !== undefined));
  return repositorio.actualizarMetodoPago(id, updates);
}

export async function eliminarMetodoPago(id) {
  return repositorio.eliminarMetodoPago(id);
}