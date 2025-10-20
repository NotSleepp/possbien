import * as servicio from './servicio.impresoras.js';

export async function crearImpresora(req, res, next) {
  try { const r = await servicio.crearImpresora(req.body); res.status(201).json(r); } catch (e) { next(e); }
}
export async function obtenerImpresorasPorEmpresa(req, res, next) {
  try { const { idEmpresa } = req.params; const r = await servicio.obtenerImpresorasPorEmpresa(Number(idEmpresa)); res.json(r); } catch (e) { next(e); }
}
export async function obtenerImpresoraPorId(req, res, next) {
  try { const { id } = req.params; const r = await servicio.obtenerImpresoraPorId(Number(id)); res.json(r); } catch (e) { next(e); }
}
export async function actualizarImpresora(req, res, next) {
  try { const { id } = req.params; const r = await servicio.actualizarImpresora(Number(id), req.body); res.json(r); } catch (e) { next(e); }
}
export async function eliminarImpresora(req, res, next) {
  try { const { id } = req.params; await servicio.eliminarImpresora(Number(id)); res.json({ mensaje: 'Impresora eliminada' }); } catch (e) { next(e); }
}