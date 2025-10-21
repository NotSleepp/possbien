import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const TABLA = 'tipo_comprobantes';

async function obtenerTodosTiposComprobante() {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ eliminado: false });
}

async function obtenerTipoComprobantePorId(id) {
  return await clienteBaseDeDatos(TABLA)
    .where({ id })
    .first();
}

async function crearTipoComprobante(datos) {
  const [id] = await clienteBaseDeDatos(TABLA).insert({
    id_empresa: datos.id_empresa,
    codigo: datos.codigo,
    nombre: datos.nombre,
    descripcion: datos.descripcion ?? null,
    destino: datos.destino ?? 'VENTA',
    activo: datos.activo ?? true,
  });
  return await obtenerTipoComprobantePorId(id);
}

async function actualizarTipoComprobante(id, datos) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      id_empresa: datos.id_empresa,
      codigo: datos.codigo,
      nombre: datos.nombre,
      descripcion: datos.descripcion,
      destino: datos.destino,
      activo: datos.activo,
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerTipoComprobantePorId(id);
}

async function eliminarTipoComprobante(id) {
  await clienteBaseDeDatos(TABLA)
    .where({ id })
    .update({
      eliminado: true,
      fecha_eliminacion: clienteBaseDeDatos.fn.now(),
      fecha_actualizacion: clienteBaseDeDatos.fn.now(),
    });
  return await obtenerTipoComprobantePorId(id);
}

export {
  obtenerTodosTiposComprobante,
  obtenerTipoComprobantePorId,
  crearTipoComprobante,
  actualizarTipoComprobante,
  eliminarTipoComprobante,
};