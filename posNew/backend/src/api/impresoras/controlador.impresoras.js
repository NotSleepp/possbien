import * as servicio from './servicio.impresoras.js';

export async function crearImpresora(req, res, next) {
  console.log('[controlador.impresoras] crearImpresora - INICIO');
  console.log('[controlador.impresoras] crearImpresora - req.body:', req.body);
  try {
    console.log('[controlador.impresoras] crearImpresora - Llamando a servicio.crearImpresora');
    const r = await servicio.crearImpresora(req.body);
    console.log('[controlador.impresoras] crearImpresora - SUCCESS! Impresora creada:', r);
    res.status(201).json(r);
  } catch (e) {
    console.error('[controlador.impresoras] crearImpresora - ERROR!');
    console.error('[controlador.impresoras] crearImpresora - Error:', e);
    next(e);
  }
}

export async function obtenerImpresorasPorEmpresa(req, res, next) {
  console.log('[controlador.impresoras] obtenerImpresorasPorEmpresa - INICIO');
  console.log('[controlador.impresoras] obtenerImpresorasPorEmpresa - req.params:', req.params);
  try {
    const { idEmpresa } = req.params;
    console.log('[controlador.impresoras] obtenerImpresorasPorEmpresa - idEmpresa:', idEmpresa);
    const r = await servicio.obtenerImpresorasPorEmpresa(Number(idEmpresa));
    console.log('[controlador.impresoras] obtenerImpresorasPorEmpresa - SUCCESS! Impresoras encontradas:', r?.length);
    res.json(r);
  } catch (e) {
    console.error('[controlador.impresoras] obtenerImpresorasPorEmpresa - ERROR:', e);
    next(e);
  }
}

export async function obtenerImpresoraPorId(req, res, next) {
  console.log('[controlador.impresoras] obtenerImpresoraPorId - INICIO');
  try {
    const { id } = req.params;
    console.log('[controlador.impresoras] obtenerImpresoraPorId - id:', id);
    const r = await servicio.obtenerImpresoraPorId(Number(id));
    console.log('[controlador.impresoras] obtenerImpresoraPorId - SUCCESS! Impresora:', r);
    res.json(r);
  } catch (e) {
    console.error('[controlador.impresoras] obtenerImpresoraPorId - ERROR:', e);
    next(e);
  }
}

export async function actualizarImpresora(req, res, next) {
  console.log('[controlador.impresoras] actualizarImpresora - INICIO');
  console.log('[controlador.impresoras] actualizarImpresora - req.params:', req.params);
  console.log('[controlador.impresoras] actualizarImpresora - req.body:', req.body);
  try {
    const { id } = req.params;
    console.log('[controlador.impresoras] actualizarImpresora - id:', id);
    const r = await servicio.actualizarImpresora(Number(id), req.body);
    console.log('[controlador.impresoras] actualizarImpresora - SUCCESS! Impresora actualizada:', r);
    res.json(r);
  } catch (e) {
    console.error('[controlador.impresoras] actualizarImpresora - ERROR!');
    console.error('[controlador.impresoras] actualizarImpresora - Error:', e);
    next(e);
  }
}

export async function eliminarImpresora(req, res, next) {
  console.log('[controlador.impresoras] eliminarImpresora - INICIO');
  try {
    const { id } = req.params;
    console.log('[controlador.impresoras] eliminarImpresora - id:', id);
    await servicio.eliminarImpresora(Number(id));
    console.log('[controlador.impresoras] eliminarImpresora - SUCCESS!');
    res.json({ mensaje: 'Impresora eliminada' });
  } catch (e) {
    console.error('[controlador.impresoras] eliminarImpresora - ERROR:', e);
    next(e);
  }
}