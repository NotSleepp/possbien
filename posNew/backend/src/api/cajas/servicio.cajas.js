import * as repositorio from './repositorio.cajas.js';
import { esquemaCrearCaja, esquemaActualizarCaja } from './dto.cajas.js';
import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function crearCaja(datos) {
  // Capturar posible empresaId del cuerpo original antes del parseo
  const empresaIdCrudo = datos?.empresaId ?? datos?.idEmpresa;

  const datosValidados = esquemaCrearCaja.parse(datos);

  // Resolver id_empresa: usar idEmpresa del DTO o empresaId del cuerpo, y si no existe, derivar desde la sucursal
  let idEmpresaFinal = datosValidados.idEmpresa ?? empresaIdCrudo;
  if (!idEmpresaFinal && datosValidados.idSucursal) {
    const suc = await clienteBaseDeDatos('sucursales')
      .where({ id: datosValidados.idSucursal })
      .select('id_empresa')
      .first();
    idEmpresaFinal = suc?.id_empresa;
  }

  const datosParaInsertar = {
    id_empresa: idEmpresaFinal,
    id_sucursal: datosValidados.idSucursal,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    monto_inicial: datosValidados.saldoInicial ?? 0,
    eliminado: false,
    fecha_creacion: new Date(),
  };

  return await repositorio.crearCaja(datosParaInsertar);
}

async function actualizarCaja(id, datos) {
  // Incluir el id en el parseo para cumplir el esquema de actualización
  const datosValidados = esquemaActualizarCaja.parse({ id, ...datos });

  // Construir el payload de actualización mapeando a columnas de BD
  const datosParaActualizar = {};

  if (datosValidados.idSucursal !== undefined) {
    datosParaActualizar.id_sucursal = datosValidados.idSucursal;
  }
  if (datosValidados.codigo !== undefined) {
    datosParaActualizar.codigo = datosValidados.codigo;
  }
  if (datosValidados.nombre !== undefined) {
    datosParaActualizar.nombre = datosValidados.nombre;
  }
  if (datosValidados.saldoInicial !== undefined) {
    datosParaActualizar.monto_inicial = datosValidados.saldoInicial;
  }

  // Permitir actualizar empresa si viene en la petición (aunque es raro)
  const empresaIdCrudo = datos?.empresaId ?? datos?.idEmpresa;
  if (datosValidados.idEmpresa !== undefined || empresaIdCrudo !== undefined) {
    datosParaActualizar.id_empresa = datosValidados.idEmpresa ?? empresaIdCrudo;
  }

  return await repositorio.actualizarCaja(id, datosParaActualizar);
}

async function obtenerTodasCajas(idSucursal) {
  return await repositorio.obtenerTodasCajas(idSucursal);
}

async function obtenerCajaPorId(id) {
  return await repositorio.obtenerCajaPorId(id);
}

async function eliminarCaja(id) {
  return await repositorio.eliminarCaja(id);
}

export {
  crearCaja,
  actualizarCaja,
  obtenerTodasCajas,
  obtenerCajaPorId,
  eliminarCaja,
};
