import db from '../../config/baseDeDatos.js';

/**
 * Prepara los datos de impresora para inserción/actualización
 * Convierte el campo configuracion a JSON string si es necesario
 */
function prepararDatos(datos) {
  const datosProcesados = { ...datos };
  
  // Si configuracion es un objeto, convertirlo a JSON string para MySQL
  if (datosProcesados.configuracion && typeof datosProcesados.configuracion === 'object') {
    datosProcesados.configuracion = JSON.stringify(datosProcesados.configuracion);
  }
  
  return datosProcesados;
}

/**
 * Procesa los datos de impresora al leerlos de la BD
 * Convierte el campo configuracion de JSON string a objeto
 */
function procesarResultado(impresora) {
  if (!impresora) return null;
  
  // Si configuracion es un string JSON, parsearlo a objeto
  if (impresora.configuracion && typeof impresora.configuracion === 'string') {
    try {
      impresora.configuracion = JSON.parse(impresora.configuracion);
    } catch (e) {
      // Si no se puede parsear, dejar como null
      impresora.configuracion = null;
    }
  }
  
  return impresora;
}

export async function crearImpresora(datos) {
  const datosProcesados = prepararDatos(datos);
  const [id] = await db('impresoras').insert(datosProcesados);
  const impresora = await db('impresoras').where({ id }).first();
  return procesarResultado(impresora);
}

export async function obtenerImpresorasPorEmpresa(idEmpresa) {
  const impresoras = await db('impresoras').where({ id_empresa: idEmpresa, eliminado: false });
  return impresoras.map(procesarResultado);
}

export async function obtenerImpresoraPorId(id) {
  const impresora = await db('impresoras').where({ id }).first();
  return procesarResultado(impresora);
}

export async function actualizarImpresora(id, datos) {
  const datosProcesados = prepararDatos(datos);
  await db('impresoras').where({ id }).update({ ...datosProcesados, fecha_actualizacion: db.fn.now() });
  const impresora = await db('impresoras').where({ id }).first();
  return procesarResultado(impresora);
}

export async function eliminarImpresora(id) {
  await db('impresoras').where({ id }).update({ eliminado: true, fecha_eliminacion: db.fn.now() });
}