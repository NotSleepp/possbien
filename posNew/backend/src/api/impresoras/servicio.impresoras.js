import { esquemaCrearImpresora, esquemaActualizarImpresora } from './dto.impresoras.js';
import * as repositorio from './repositorio.impresoras.js';

export async function crearImpresora(datos) {
  const d = esquemaCrearImpresora.parse(datos);
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
    configuracion: d.configuracion != null
      ? (typeof d.configuracion === 'string' ? d.configuracion : JSON.stringify(d.configuracion))
      : null,
  };
  return repositorio.crearImpresora(m);
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
  const d = esquemaActualizarImpresora.parse({ id, ...datos });
  const m = {};
  if (d.name !== undefined) m.name = d.name;
  if (d.nombre !== undefined) m.nombre = d.nombre;
  if (d.tipo !== undefined) m.tipo = d.tipo;
  if (d.puerto !== undefined) m.puerto = d.puerto;
  if (d.pcName !== undefined) m.pc_name = d.pcName;
  if (d.ipLocal !== undefined) m.ip_local = d.ipLocal;
  if (d.state !== undefined) m.state = d.state;
  if ('configuracion' in d) {
    m.configuracion = d.configuracion != null
      ? (typeof d.configuracion === 'string' ? d.configuracion : JSON.stringify(d.configuracion))
      : null;
  }
  return repositorio.actualizarImpresora(id, m);
}
export async function eliminarImpresora(id) {
  return repositorio.eliminarImpresora(id);
}