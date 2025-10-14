import { esquemaCrearCaja, esquemaActualizarCaja } from './dto.cajas.js';
import * as repositorio from './repositorio.cajas.js';

async function crearCaja(datos) {
  const datosValidados = esquemaCrearCaja.parse(datos);
  const mappedData = {
    id_sucursal: datosValidados.idSucursal,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    saldo_inicial: datosValidados.saldoInicial,
    saldo_actual: datosValidados.saldoInicial,
  };
  return await repositorio.crearCaja(mappedData);
}

async function obtenerTodasCajas(idSucursal) {
  return await repositorio.obtenerTodasCajas(idSucursal);
}

async function obtenerCajaPorId(id) {
  const caja = await repositorio.obtenerCajaPorId(id);
  if (!caja) {
    throw new Error('Caja no encontrada');
  }
  return caja;
}

async function actualizarCaja(id, datos) {
  const datosValidados = esquemaActualizarCaja.parse({ id, ...datos });
  return await repositorio.actualizarCaja(id, datosValidados);
}

async function eliminarCaja(id) {
  await obtenerCajaPorId(id);
  return await repositorio.eliminarCaja(id);
}

export {
    crearCaja,
    obtenerTodasCajas,
    obtenerCajaPorId,
    actualizarCaja,
    eliminarCaja
};
