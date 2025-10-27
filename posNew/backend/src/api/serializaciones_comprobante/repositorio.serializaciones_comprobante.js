import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const TABLA = 'serializacion_comprobantes';

async function obtenerTodasSerializaciones() {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ eliminado: false });
}

async function obtenerSerializacionPorId(id) {
  return await clienteBaseDeDatos(TABLA)
    .where({ id })
    .first();
}

async function obtenerSerializacionesPorSucursal(idSucursal) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_sucursal: idSucursal, eliminado: false });
}

async function obtenerSerializacionesPorTipo(idTipoComprobante) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_tipo_comprobante: idTipoComprobante, eliminado: false });
}

async function crearSerializacion(datos) {
  const [id] = await clienteBaseDeDatos(TABLA).insert({
    id_empresa: datos.id_empresa,
    id_sucursal: datos.id_sucursal,
    id_tipo_comprobante: datos.id_tipo_comprobante,
    serie: datos.serie,
    numero_inicial: datos.numero_inicial ?? 1,
    numero_actual: datos.numero_actual ?? 1,
    numero_final: datos.numero_final ?? null,
    cantidad_numeros: datos.cantidad_numeros ?? 1000,
    por_default: datos.por_default ?? false,
    activo: datos.activo ?? true,
  });
  return await obtenerSerializacionPorId(id);
}

async function actualizarSerializacion(id, datos) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      id_empresa: datos.id_empresa,
      id_sucursal: datos.id_sucursal,
      id_tipo_comprobante: datos.id_tipo_comprobante,
      serie: datos.serie,
      numero_inicial: datos.numero_inicial,
      numero_actual: datos.numero_actual,
      numero_final: datos.numero_final,
      cantidad_numeros: datos.cantidad_numeros,
      por_default: datos.por_default,
      activo: datos.activo,
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerSerializacionPorId(id);
}

async function eliminarSerializacion(id) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      eliminado: true,
      fecha_eliminacion: clienteBaseDeDatos.fn.now(),
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerSerializacionPorId(id);
}

async function obtenerSerializacionPorSerieSucursalTipo(serie, idSucursal, idTipoComprobante) {
  return await clienteBaseDeDatos(TABLA)
    .where({
      serie,
      id_sucursal: idSucursal,
      id_tipo_comprobante: idTipoComprobante,
      eliminado: false
    })
    .first();
}

async function desactivarSeriesPorDefecto(idSucursal, idTipoComprobante, exceptoId = null) {
  const query = clienteBaseDeDatos(TABLA)
    .where({
      id_sucursal: idSucursal,
      id_tipo_comprobante: idTipoComprobante,
      por_default: true,
      eliminado: false
    })
    .update({
      por_default: false,
      fecha_actualizacion: clienteBaseDeDatos.fn.now()
    });
  
  if (exceptoId) {
    query.whereNot({ id: exceptoId });
  }
  
  await query;
}

export {
  obtenerTodasSerializaciones,
  obtenerSerializacionPorId,
  obtenerSerializacionesPorSucursal,
  obtenerSerializacionesPorTipo,
  crearSerializacion,
  actualizarSerializacion,
  eliminarSerializacion,
  obtenerSerializacionPorSerieSucursalTipo,
  desactivarSeriesPorDefecto,
};