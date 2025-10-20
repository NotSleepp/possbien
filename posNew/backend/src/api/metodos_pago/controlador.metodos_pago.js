import * as servicio from './servicio.metodos_pago.js';

export async function crearMetodoPago(req, res, next) {
  try { const r = await servicio.crearMetodoPago(req.body); res.status(201).json(r); } catch (e) { next(e); }
}
export async function obtenerMetodosPagoPorEmpresa(req, res, next) {
  try { const { idEmpresa } = req.params; const r = await servicio.obtenerMetodosPagoPorEmpresa(Number(idEmpresa)); res.json(r); } catch (e) { next(e); }
}
export async function obtenerMetodoPagoPorId(req, res, next) {
  try { const { id } = req.params; const r = await servicio.obtenerMetodoPagoPorId(Number(id)); res.json(r); } catch (e) { next(e); }
}
export async function actualizarMetodoPago(req, res, next) {
  try { const { id } = req.params; const r = await servicio.actualizarMetodoPago(Number(id), req.body); res.json(r); } catch (e) { next(e); }
}
export async function eliminarMetodoPago(req, res, next) {
  try { const { id } = req.params; await servicio.eliminarMetodoPago(Number(id)); res.json({ mensaje: 'Método de pago eliminado' }); } catch (e) { next(e); }
}