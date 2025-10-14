import { esquemaCrearSucursal, esquemaActualizarSucursal } from './dto.sucursales.js';
import * as repositorio from './repositorio.sucursales.js';

async function crearSucursal(datos) {
  const datosValidados = esquemaCrearSucursal.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    direccion: datosValidados.direccion,
    direccion_fiscal: datosValidados.direccionFiscal,
    telefono: datosValidados.telefono,
    email: datosValidados.email,
  };
  return await repositorio.crearSucursal(mappedData);
}

async function obtenerTodasSucursales(idEmpresa) {
  return await repositorio.obtenerTodasSucursales(idEmpresa);
}

async function obtenerSucursalPorId(id) {
  const sucursal = await repositorio.obtenerSucursalPorId(id);
  if (!sucursal) {
    throw new Error('Sucursal no encontrada');
  }
  return sucursal;
}

async function actualizarSucursal(id, datos) {
  const datosValidados = esquemaActualizarSucursal.parse({ id, ...datos });
  return await repositorio.actualizarSucursal(id, datosValidados);
}

async function eliminarSucursal(id) {
  await obtenerSucursalPorId(id);
  return await repositorio.eliminarSucursal(id);
}

export {
  crearSucursal,
  obtenerTodasSucursales,
  obtenerSucursalPorId,
  actualizarSucursal,
  eliminarSucursal,
};
