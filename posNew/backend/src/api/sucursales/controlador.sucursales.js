import * as servicio from './servicio.sucursales.js';

async function crearSucursal(req, res, next) {
  try {
    const sucursal = await servicio.crearSucursal(req.body);
    res.status(201).json({ mensaje: 'Sucursal creada exitosamente', datos: sucursal });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodasSucursales(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const sucursales = await servicio.obtenerTodasSucursales(Number(idEmpresa));
    res.json(sucursales);
  } catch (error) {
    next(error);
  }
}

async function obtenerSucursalPorId(req, res, next) {
  try {
    const { id } = req.params;
    const sucursal = await servicio.obtenerSucursalPorId(Number(id));
    res.json(sucursal);
  } catch (error) {
    next(error);
  }
}

async function actualizarSucursal(req, res, next) {
  try {
    const { id } = req.params;
    const sucursal = await servicio.actualizarSucursal(Number(id), req.body);
    res.json({ mensaje: 'Sucursal actualizada exitosamente', datos: sucursal });
  } catch (error) {
    next(error);
  }
}

async function eliminarSucursal(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarSucursal(Number(id));
    res.json({ mensaje: 'Sucursal eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
  crearSucursal,
  obtenerTodasSucursales,
  obtenerSucursalPorId,
  actualizarSucursal,
  eliminarSucursal,
};
