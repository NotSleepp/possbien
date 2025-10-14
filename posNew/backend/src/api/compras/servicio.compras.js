import { esquemaCrearCompra, esquemaActualizarCompra } from './dto.compras.js';
import * as repositorio from './repositorio.compras.js';

async function crearCompra(datos) {
  const datosValidados = esquemaCrearCompra.parse(datos);
  const mappedData = {
    id_sucursal: datosValidados.idSucursal,
    id_proveedor: datosValidados.idProveedor,
    fecha_compra: datosValidados.fechaCompra ? new Date(datosValidados.fechaCompra) : new Date(),
    total: datosValidados.total,
    estado: datosValidados.estado,
  };
  return await repositorio.crearCompra(mappedData);
}

async function obtenerTodasCompras(idSucursal) {
  return await repositorio.obtenerTodasCompras(idSucursal);
}

async function obtenerCompraPorId(id) {
  const compra = await repositorio.obtenerCompraPorId(id);
  if (!compra) {
    throw new Error('Compra no encontrada');
  }
  return compra;
}

async function actualizarCompra(id, datos) {
  const datosValidados = esquemaActualizarCompra.parse({ id, ...datos });
  return await repositorio.actualizarCompra(id, datosValidados);
}

async function eliminarCompra(id) {
  await obtenerCompraPorId(id);
  return await repositorio.eliminarCompra(id);
}

export { crearCompra, obtenerTodasCompras, obtenerCompraPorId, actualizarCompra, eliminarCompra };
