import * as servicio from './servicio.empresas.js';

async function crearEmpresa(req, res, next) {
  try {
    const empresa = await servicio.crearEmpresa(req.body);
    res.status(201).json({ mensaje: 'Empresa creada exitosamente', datos: empresa });
  } catch (error) {
    next(error);
  }
}

async function obtenerTodasEmpresas(req, res, next) {
  try {
    const empresas = await servicio.obtenerTodasEmpresas();
    res.json(empresas);
  } catch (error) {
    next(error);
  }
}

async function obtenerEmpresaPorId(req, res, next) {
  try {
    const { id } = req.params;
    const empresa = await servicio.obtenerEmpresaPorId(Number(id));
    res.json(empresa);
  } catch (error) {
    next(error);
  }
}

async function actualizarEmpresa(req, res, next) {
  try {
    const { id } = req.params;
    const empresa = await servicio.actualizarEmpresa(Number(id), req.body);
    res.json({ mensaje: 'Empresa actualizada exitosamente', datos: empresa });
  } catch (error) {
    next(error);
  }
}

async function eliminarEmpresa(req, res, next) {
  try {
    const { id } = req.params;
    await servicio.eliminarEmpresa(Number(id));
    res.json({ mensaje: 'Empresa eliminada exitosamente' });
  } catch (error) {
    next(error);
  }
}

export { crearEmpresa, obtenerTodasEmpresas, obtenerEmpresaPorId, actualizarEmpresa, eliminarEmpresa };