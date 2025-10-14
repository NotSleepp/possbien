import * as servicio from './servicio.proveedores.js';

async function crearProveedor(req, res, next) {
  try {
    const proveedor = await servicio.crearProveedor(req.body);
    res.status(201).json({ mensaje: 'Proveedor creado exitosamente', datos: proveedor });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodosProveedores(req, res, next) {
  try {
    const { idEmpresa } = req.params;
    const proveedores = await servicio.obtenerTodosProveedores(Number(idEmpresa));
    res.json(proveedores);
  } catch (error) {
    next(error);
  }
}

async function obtenerProveedorPorId(req, res, next) {
  try {
    const { id } = req.params;
    const proveedor = await servicio.obtenerProveedorPorId(Number(id));
    res.json(proveedor);
  } catch (error) {
    next(error);
  }
}

async function actualizarProveedor(req, res, next) {
  try {
    const { id } = req.params;
    const proveedor = await servicio.actualizarProveedor(Number(id), req.body);
    res.json({ mensaje: 'Proveedor actualizado exitosamente', datos: proveedor });
  } catch (error) {
    next(error);
  }
}

async function eliminarProveedor(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarProveedor(Number(id));
    res.json({ mensaje: 'Proveedor eliminado exitosamente' });
  } catch (error) {
    next(error);
  }
}

export {
    crearProveedor,
    obtenerTodosProveedores,
    obtenerProveedorPorId,
    actualizarProveedor,
    eliminarProveedor
};
