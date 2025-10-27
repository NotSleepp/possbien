import * as repositorio from './repositorio.cajas.js';
import { esquemaCrearCaja, esquemaActualizarCaja } from './dto.cajas.js';
import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function crearCaja(datos) {
  console.log('[servicio.cajas] crearCaja - INICIO');
  console.log('[servicio.cajas] crearCaja - datos recibidos:', datos);
  
  // Capturar posible empresaId del cuerpo original antes del parseo
  const empresaIdCrudo = datos?.empresaId ?? datos?.idEmpresa;
  console.log('[servicio.cajas] crearCaja - empresaIdCrudo:', empresaIdCrudo);

  console.log('[servicio.cajas] crearCaja - Validando con esquemaCrearCaja...');
  let datosValidados;
  try {
    datosValidados = esquemaCrearCaja.parse(datos);
    console.log('[servicio.cajas] crearCaja - Validación SUCCESS! datosValidados:', datosValidados);
  } catch (error) {
    console.error('[servicio.cajas] crearCaja - Validación FAILED!');
    console.error('[servicio.cajas] crearCaja - Error de validación:', error);
    throw error;
  }

  // Resolver id_empresa: usar idEmpresa del DTO o empresaId del cuerpo, y si no existe, derivar desde la sucursal
  let idEmpresaFinal = datosValidados.idEmpresa ?? empresaIdCrudo;
  console.log('[servicio.cajas] crearCaja - idEmpresaFinal (antes de derivar):', idEmpresaFinal);
  
  if (!idEmpresaFinal && datosValidados.idSucursal) {
    console.log('[servicio.cajas] crearCaja - No hay idEmpresa, derivando desde sucursal:', datosValidados.idSucursal);
    const suc = await clienteBaseDeDatos('sucursales')
      .where({ id: datosValidados.idSucursal })
      .select('id_empresa')
      .first();
    console.log('[servicio.cajas] crearCaja - Sucursal encontrada:', suc);
    idEmpresaFinal = suc?.id_empresa;
    console.log('[servicio.cajas] crearCaja - idEmpresaFinal (derivado):', idEmpresaFinal);
  }

  const datosParaInsertar = {
    id_empresa: idEmpresaFinal,
    id_sucursal: datosValidados.idSucursal,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    descripcion: datosValidados.descripcion,
    monto_inicial: datosValidados.saldoInicial ?? 0,
    eliminado: false,
    fecha_creacion: new Date(),
  };
  console.log('[servicio.cajas] crearCaja - datosParaInsertar:', datosParaInsertar);

  console.log('[servicio.cajas] crearCaja - Llamando a repositorio.crearCaja...');
  const resultado = await repositorio.crearCaja(datosParaInsertar);
  console.log('[servicio.cajas] crearCaja - SUCCESS! Resultado:', resultado);
  return resultado;
}

async function actualizarCaja(id, datos) {
  console.log('[servicio.cajas] actualizarCaja - INICIO');
  console.log('[servicio.cajas] actualizarCaja - id:', id);
  console.log('[servicio.cajas] actualizarCaja - datos recibidos:', datos);
  
  // Incluir el id en el parseo para cumplir el esquema de actualización
  console.log('[servicio.cajas] actualizarCaja - Validando con esquemaActualizarCaja...');
  let datosValidados;
  try {
    datosValidados = esquemaActualizarCaja.parse({ id, ...datos });
    console.log('[servicio.cajas] actualizarCaja - Validación SUCCESS! datosValidados:', datosValidados);
  } catch (error) {
    console.error('[servicio.cajas] actualizarCaja - Validación FAILED!');
    console.error('[servicio.cajas] actualizarCaja - Error de validación:', error);
    throw error;
  }

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
  if (datosValidados.descripcion !== undefined) {
    datosParaActualizar.descripcion = datosValidados.descripcion;
  }
  if (datosValidados.saldoInicial !== undefined) {
    datosParaActualizar.monto_inicial = datosValidados.saldoInicial;
  }

  // Permitir actualizar empresa si viene en la petición (aunque es raro)
  const empresaIdCrudo = datos?.empresaId ?? datos?.idEmpresa;
  if (datosValidados.idEmpresa !== undefined || empresaIdCrudo !== undefined) {
    datosParaActualizar.id_empresa = datosValidados.idEmpresa ?? empresaIdCrudo;
  }

  console.log('[servicio.cajas] actualizarCaja - datosParaActualizar:', datosParaActualizar);
  console.log('[servicio.cajas] actualizarCaja - Llamando a repositorio.actualizarCaja...');
  const resultado = await repositorio.actualizarCaja(id, datosParaActualizar);
  console.log('[servicio.cajas] actualizarCaja - SUCCESS! Resultado:', resultado);
  return resultado;
}

async function obtenerTodasCajas(idSucursal) {
  console.log('[servicio.cajas] obtenerTodasCajas - idSucursal:', idSucursal);
  const resultado = await repositorio.obtenerTodasCajas(idSucursal);
  console.log('[servicio.cajas] obtenerTodasCajas - Resultado:', resultado?.length, 'cajas');
  return resultado;
}

async function obtenerCajaPorId(id) {
  console.log('[servicio.cajas] obtenerCajaPorId - id:', id);
  const resultado = await repositorio.obtenerCajaPorId(id);
  console.log('[servicio.cajas] obtenerCajaPorId - Resultado:', resultado);
  return resultado;
}

async function eliminarCaja(id) {
  console.log('[servicio.cajas] eliminarCaja - id:', id);
  const resultado = await repositorio.eliminarCaja(id);
  console.log('[servicio.cajas] eliminarCaja - SUCCESS! Resultado:', resultado);
  return resultado;
}

export {
  crearCaja,
  actualizarCaja,
  obtenerTodasCajas,
  obtenerCajaPorId,
  eliminarCaja,
};
