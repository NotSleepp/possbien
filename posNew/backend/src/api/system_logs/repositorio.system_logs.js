import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosSystemLogs(idEmpresa) {
  return await clienteBaseDeDatos('system_log').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerSystemLogPorId(id) {
  return await clienteBaseDeDatos('system_log').where({ id }).first();
}

async function crearSystemLog(datos) {
  const [id] = await clienteBaseDeDatos('system_log').insert(datos);
  return await clienteBaseDeDatos('system_log').where({ id }).first();
}

async function actualizarSystemLog(id, datos) {
  await clienteBaseDeDatos('system_log').where({ id }).update(datos);
  return await clienteBaseDeDatos('system_log').where({ id }).first();
}

async function eliminarSystemLog(id) {
  await clienteBaseDeDatos('system_log').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('system_log').where({ id }).first();
}

export {
  obtenerTodosSystemLogs,
  obtenerSystemLogPorId,
  crearSystemLog,
  actualizarSystemLog,
  eliminarSystemLog,
};
