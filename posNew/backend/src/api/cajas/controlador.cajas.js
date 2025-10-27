import * as servicio from './servicio.cajas.js';

async function crearCaja(req, res, next) {
  console.log('[controlador.cajas] crearCaja - INICIO');
  console.log('[controlador.cajas] crearCaja - req.body:', req.body);
  console.log('[controlador.cajas] crearCaja - req.body types:', {
    idEmpresa: typeof req.body.idEmpresa,
    idSucursal: typeof req.body.idSucursal,
    codigo: typeof req.body.codigo,
    nombre: typeof req.body.nombre,
    descripcion: typeof req.body.descripcion,
    saldoInicial: typeof req.body.saldoInicial,
    print: typeof req.body.print,
  });
  try {
    console.log('[controlador.cajas] crearCaja - Llamando a servicio.crearCaja');
    const caja = await servicio.crearCaja(req.body);
    console.log('[controlador.cajas] crearCaja - SUCCESS! Caja creada:', caja);
    res.status(201).json({ mensaje: 'Caja creada exitosamente', datos: caja });
  } catch (error) {
    console.error('[controlador.cajas] crearCaja - ERROR!');
    console.error('[controlador.cajas] crearCaja - Error:', error);
    console.error('[controlador.cajas] crearCaja - Error message:', error?.message);
    console.error('[controlador.cajas] crearCaja - Error stack:', error?.stack);
    next(error);
  }
}

async function obtenerTodasCajas(req, res, next) {
  console.log('[controlador.cajas] obtenerTodasCajas - INICIO');
  console.log('[controlador.cajas] obtenerTodasCajas - req.params:', req.params);
  try {
    const { idSucursal } = req.params;
    console.log('[controlador.cajas] obtenerTodasCajas - idSucursal:', idSucursal);
    const cajas = await servicio.obtenerTodasCajas(Number(idSucursal));
    console.log('[controlador.cajas] obtenerTodasCajas - SUCCESS! Cajas encontradas:', cajas?.length);
    res.json(cajas);
  } catch (error) {
    console.error('[controlador.cajas] obtenerTodasCajas - ERROR:', error);
    next(error);
  }
}

async function obtenerCajaPorId(req, res, next) {
  console.log('[controlador.cajas] obtenerCajaPorId - INICIO');
  console.log('[controlador.cajas] obtenerCajaPorId - req.params:', req.params);
  try {
    const { id } = req.params;
    console.log('[controlador.cajas] obtenerCajaPorId - id:', id);
    const caja = await servicio.obtenerCajaPorId(Number(id));
    console.log('[controlador.cajas] obtenerCajaPorId - SUCCESS! Caja:', caja);
    res.json(caja);
  } catch (error) {
    console.error('[controlador.cajas] obtenerCajaPorId - ERROR:', error);
    next(error);
  }
}

async function actualizarCaja(req, res, next) {
  console.log('[controlador.cajas] actualizarCaja - INICIO');
  console.log('[controlador.cajas] actualizarCaja - req.params:', req.params);
  console.log('[controlador.cajas] actualizarCaja - req.body:', req.body);
  console.log('[controlador.cajas] actualizarCaja - req.body types:', {
    idEmpresa: typeof req.body.idEmpresa,
    idSucursal: typeof req.body.idSucursal,
    codigo: typeof req.body.codigo,
    nombre: typeof req.body.nombre,
    descripcion: typeof req.body.descripcion,
    saldoInicial: typeof req.body.saldoInicial,
    print: typeof req.body.print,
  });
  try {
    const { id } = req.params;
    console.log('[controlador.cajas] actualizarCaja - id:', id);
    console.log('[controlador.cajas] actualizarCaja - Llamando a servicio.actualizarCaja');
    const caja = await servicio.actualizarCaja(Number(id), req.body);
    console.log('[controlador.cajas] actualizarCaja - SUCCESS! Caja actualizada:', caja);
    res.json({ mensaje: 'Caja actualizada exitosamente', datos: caja });
  } catch (error) {
    console.error('[controlador.cajas] actualizarCaja - ERROR!');
    console.error('[controlador.cajas] actualizarCaja - Error:', error);
    console.error('[controlador.cajas] actualizarCaja - Error message:', error?.message);
    console.error('[controlador.cajas] actualizarCaja - Error stack:', error?.stack);
    next(error);
  }
}

async function eliminarCaja(req, res, next) {
  console.log('[controlador.cajas] eliminarCaja - INICIO');
  console.log('[controlador.cajas] eliminarCaja - req.params:', req.params);
  try {
    const { id } = req.params;
    console.log('[controlador.cajas] eliminarCaja - id:', id);
    await servicio.eliminarCaja(Number(id));
    console.log('[controlador.cajas] eliminarCaja - SUCCESS!');
    res.json({ mensaje: 'Caja eliminada exitosamente' });
  } catch (error) {
    console.error('[controlador.cajas] eliminarCaja - ERROR:', error);
    next(error);
  }
}

export {
    crearCaja,
    obtenerTodasCajas,
    obtenerCajaPorId,
    actualizarCaja,
    eliminarCaja
};
