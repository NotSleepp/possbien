import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosAuditTrails(idEmpresa) {
  return await clienteBaseDeDatos('audit_trails').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerAuditTrailPorId(id) {
  return await clienteBaseDeDatos('audit_trails').where({ id }).first();
}

async function crearAuditTrail(datos) {
  const [id] = await clienteBaseDeDatos('audit_trails').insert(datos);
  return await clienteBaseDeDatos('audit_trails').where({ id }).first();
}

async function actualizarAuditTrail(id, datos) {
  await clienteBaseDeDatos('audit_trails').where({ id }).update(datos);
  return await clienteBaseDeDatos('audit_trails').where({ id }).first();
}

async function eliminarAuditTrail(id) {
  await clienteBaseDeDatos('audit_trails').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('audit_trails').where({ id }).first();
}

export {
    crearAuditTrail,
    obtenerTodosAuditTrails,
    obtenerAuditTrailPorId,
    actualizarAuditTrail,
    eliminarAuditTrail
};
