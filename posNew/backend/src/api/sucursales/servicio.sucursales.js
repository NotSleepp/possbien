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

  // Mapear solo campos presentes y convertir a snake_case para columnas de BD
  const datosParaActualizar = {};
  if (datosValidados.codigo !== undefined) datosParaActualizar.codigo = datosValidados.codigo;
  if (datosValidados.nombre !== undefined) datosParaActualizar.nombre = datosValidados.nombre;
  if (datosValidados.direccion !== undefined) datosParaActualizar.direccion = datosValidados.direccion;
  if (datosValidados.direccionFiscal !== undefined) datosParaActualizar.direccion_fiscal = datosValidados.direccionFiscal;
  if (datosValidados.telefono !== undefined) datosParaActualizar.telefono = datosValidados.telefono;
  if (datosValidados.email !== undefined) datosParaActualizar.email = datosValidados.email;
  if (datosValidados.idEmpresa !== undefined) datosParaActualizar.id_empresa = datosValidados.idEmpresa;

  return await repositorio.actualizarSucursal(id, datosParaActualizar);
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
