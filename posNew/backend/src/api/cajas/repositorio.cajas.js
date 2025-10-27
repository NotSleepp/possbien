import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasCajas(idSucursal) {
  console.log('[repositorio.cajas] obtenerTodasCajas - idSucursal:', idSucursal);
  try {
    const resultado = await clienteBaseDeDatos('caja').where({ id_sucursal: idSucursal, eliminado: false });
    console.log('[repositorio.cajas] obtenerTodasCajas - Resultado:', resultado?.length, 'cajas');
    return resultado;
  } catch (error) {
    console.error('[repositorio.cajas] obtenerTodasCajas - ERROR:', error);
    throw error;
  }
}

async function obtenerCajaPorId(id) {
  console.log('[repositorio.cajas] obtenerCajaPorId - id:', id);
  try {
    const resultado = await clienteBaseDeDatos('caja').where({ id }).first();
    console.log('[repositorio.cajas] obtenerCajaPorId - Resultado:', resultado);
    return resultado;
  } catch (error) {
    console.error('[repositorio.cajas] obtenerCajaPorId - ERROR:', error);
    throw error;
  }
}

async function crearCaja(datos) {
  console.log('[repositorio.cajas] crearCaja - INICIO');
  console.log('[repositorio.cajas] crearCaja - datos a insertar:', datos);
  try {
    console.log('[repositorio.cajas] crearCaja - Ejecutando INSERT en tabla caja...');
    const [id] = await clienteBaseDeDatos('caja').insert(datos);
    console.log('[repositorio.cajas] crearCaja - INSERT SUCCESS! ID generado:', id);
    console.log('[repositorio.cajas] crearCaja - Recuperando caja creada...');
    const resultado = await clienteBaseDeDatos('caja').where({ id }).first();
    console.log('[repositorio.cajas] crearCaja - Caja creada:', resultado);
    return resultado;
  } catch (error) {
    console.error('[repositorio.cajas] crearCaja - ERROR!');
    console.error('[repositorio.cajas] crearCaja - Error:', error);
    console.error('[repositorio.cajas] crearCaja - Error message:', error?.message);
    console.error('[repositorio.cajas] crearCaja - Error code:', error?.code);
    console.error('[repositorio.cajas] crearCaja - Error sqlMessage:', error?.sqlMessage);
    throw error;
  }
}

async function actualizarCaja(id, datos) {
  console.log('[repositorio.cajas] actualizarCaja - INICIO');
  console.log('[repositorio.cajas] actualizarCaja - id:', id);
  console.log('[repositorio.cajas] actualizarCaja - datos a actualizar:', datos);
  try {
    console.log('[repositorio.cajas] actualizarCaja - Ejecutando UPDATE en tabla caja...');
    await clienteBaseDeDatos('caja').where({ id }).update(datos);
    console.log('[repositorio.cajas] actualizarCaja - UPDATE SUCCESS!');
    console.log('[repositorio.cajas] actualizarCaja - Recuperando caja actualizada...');
    const resultado = await clienteBaseDeDatos('caja').where({ id }).first();
    console.log('[repositorio.cajas] actualizarCaja - Caja actualizada:', resultado);
    return resultado;
  } catch (error) {
    console.error('[repositorio.cajas] actualizarCaja - ERROR!');
    console.error('[repositorio.cajas] actualizarCaja - Error:', error);
    console.error('[repositorio.cajas] actualizarCaja - Error message:', error?.message);
    console.error('[repositorio.cajas] actualizarCaja - Error code:', error?.code);
    console.error('[repositorio.cajas] actualizarCaja - Error sqlMessage:', error?.sqlMessage);
    throw error;
  }
}

async function eliminarCaja(id) {
  console.log('[repositorio.cajas] eliminarCaja - id:', id);
  try {
    await clienteBaseDeDatos('caja').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
    console.log('[repositorio.cajas] eliminarCaja - UPDATE SUCCESS!');
    const resultado = await clienteBaseDeDatos('caja').where({ id }).first();
    console.log('[repositorio.cajas] eliminarCaja - Caja eliminada:', resultado);
    return resultado;
  } catch (error) {
    console.error('[repositorio.cajas] eliminarCaja - ERROR:', error);
    throw error;
  }
}

export {
    crearCaja,
    obtenerTodasCajas,
    obtenerCajaPorId,
    actualizarCaja,
    eliminarCaja
};
