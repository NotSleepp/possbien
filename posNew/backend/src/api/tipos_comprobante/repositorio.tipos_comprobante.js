import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const TABLA = 'tipo_comprobantes';

async function obtenerTodosTiposComprobante() {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ eliminado: false });
}

async function obtenerTiposComprobantePorEmpresa(idEmpresa) {
  return await clienteBaseDeDatos(TABLA)
    .select('*')
    .where({ id_empresa: idEmpresa, eliminado: false });
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

async function obtenerTipoComprobantePorCodigoYEmpresa(codigo, idEmpresa) {
  return await clienteBaseDeDatos(TABLA)
    .where({ codigo, id_empresa: idEmpresa, eliminado: false })
    .first();
}

async function contarVentasPorTipoComprobante(idTipoComprobante) {
  const result = await clienteBaseDeDatos('ventas')
    .where({ id_tipo_comprobante: idTipoComprobante, eliminado: false })
    .count('* as count')
    .first();
  return result ? parseInt(result.count, 10) : 0;
}

export {
  obtenerTodosTiposComprobante,
  obtenerTiposComprobantePorEmpresa,
  obtenerTipoComprobantePorId,
  crearTipoComprobante,
  actualizarTipoComprobante,
  eliminarTipoComprobante,
  obtenerTipoComprobantePorCodigoYEmpresa,
  contarVentasPorTipoComprobante,
};