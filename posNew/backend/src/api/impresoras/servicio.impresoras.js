import { esquemaCrearImpresora, esquemaActualizarImpresora } from './dto.impresoras.js';
import * as repositorio from './repositorio.impresoras.js';

export async function crearImpresora(datos) {
  console.log('[servicio.impresoras] crearImpresora - INICIO');
  console.log('[servicio.impresoras] crearImpresora - datos recibidos:', datos);
  
  console.log('[servicio.impresoras] crearImpresora - Validando con esquemaCrearImpresora...');
  let d;
  try {
    d = esquemaCrearImpresora.parse(datos);
    console.log('[servicio.impresoras] crearImpresora - Validación SUCCESS! datosValidados:', d);
  } catch (error) {
    console.error('[servicio.impresoras] crearImpresora - Validación FAILED!');
    console.error('[servicio.impresoras] crearImpresora - Error de validación:', error);
    throw error;
  }
  
  const m = {
    id_empresa: d.idEmpresa,
    id_sucursal: d.idSucursal,
    id_caja: d.idCaja || null,
    name: d.name,
    nombre: d.nombre || null,
    tipo: d.tipo,
    puerto: d.puerto || null,
    pc_name: d.pcName || null,
    ip_local: d.ipLocal || null,
    state: d.state ?? true,
    configuracion: d.configuracion != null && d.configuracion !== ''
      ? (typeof d.configuracion === 'string' ? d.configuracion : JSON.stringify(d.configuracion))
      : null,
  };
  console.log('[servicio.impresoras] crearImpresora - datosParaInsertar:', m);
  
  console.log('[servicio.impresoras] crearImpresora - Llamando a repositorio.crearImpresora...');
  const resultado = await repositorio.crearImpresora(m);
  console.log('[servicio.impresoras] crearImpresora - SUCCESS! Resultado:', resultado);
  return resultado;
}
export async function obtenerImpresorasPorEmpresa(idEmpresa) {
  return repositorio.obtenerImpresorasPorEmpresa(idEmpresa);
}
export async function obtenerImpresoraPorId(id) {
  const imp = await repositorio.obtenerImpresoraPorId(id);
  if (!imp) throw new Error('Impresora no encontrada');
  return imp;
}
export async function actualizarImpresora(id, datos) {
  console.log('[servicio.impresoras] actualizarImpresora - INICIO');
  console.log('[servicio.impresoras] actualizarImpresora - id:', id);
  console.log('[servicio.impresoras] actualizarImpresora - datos recibidos:', datos);
  
  console.log('[servicio.impresoras] actualizarImpresora - Validando con esquemaActualizarImpresora...');
  let d;
  try {
    d = esquemaActualizarImpresora.parse({ id, ...datos });
    console.log('[servicio.impresoras] actualizarImpresora - Validación SUCCESS! datosValidados:', d);
  } catch (error) {
    console.error('[servicio.impresoras] actualizarImpresora - Validación FAILED!');
    console.error('[servicio.impresoras] actualizarImpresora - Error de validación:', error);
    throw error;
  }
  
  const m = {};
  // Actualización de relaciones
  if (d.idSucursal !== undefined) m.id_sucursal = d.idSucursal || null;
  if ('idCaja' in d) m.id_caja = d.idCaja ?? null;
  // Campos de configuración
  if (d.name !== undefined) m.name = d.name;
  if (d.nombre !== undefined) m.nombre = d.nombre;
  if (d.tipo !== undefined) m.tipo = d.tipo;
  if (d.puerto !== undefined) m.puerto = d.puerto;
  if (d.pcName !== undefined) m.pc_name = d.pcName;
  if (d.ipLocal !== undefined) m.ip_local = d.ipLocal;
  if (d.state !== undefined) m.state = d.state;
  if ('configuracion' in d) {
    m.configuracion = d.configuracion != null && d.configuracion !== ''
      ? (typeof d.configuracion === 'string' ? d.configuracion : JSON.stringify(d.configuracion))
      : null;
  }
  console.log('[servicio.impresoras] actualizarImpresora - datosParaActualizar:', m);
  
  console.log('[servicio.impresoras] actualizarImpresora - Llamando a repositorio.actualizarImpresora...');
  const resultado = await repositorio.actualizarImpresora(id, m);
  console.log('[servicio.impresoras] actualizarImpresora - SUCCESS! Resultado:', resultado);
  return resultado;
}
export async function eliminarImpresora(id) {
  return repositorio.eliminarImpresora(id);
}