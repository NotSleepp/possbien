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
    configuracion: d.configuracion ? JSON.stringify(d.configuracion) : null
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
  return repositorio.actualizarImpresora(id, d);
}
export async function eliminarImpresora(id) {
  return repositorio.eliminarImpresora(id);
}