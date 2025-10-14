import { esquemaCrearSystemLog, esquemaActualizarSystemLog } from './dto.system_logs.js';
import * as repositorio from './repositorio.system_logs.js';

async function crearSystemLog(datos) {
  const datosValidados = esquemaCrearSystemLog.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    id_usuario: datosValidados.idUsuario,
    accion: datosValidados.accion,
    descripcion: datosValidados.descripcion,
    fecha: datosValidados.fecha ? new Date(datosValidados.fecha) : new Date(),
  };
  return await repositorio.crearSystemLog(mappedData);
}

async function obtenerTodosSystemLogs(idEmpresa) {
  return await repositorio.obtenerTodosSystemLogs(idEmpresa);
}

async function obtenerSystemLogPorId(id) {
  const log = await repositorio.obtenerSystemLogPorId(id);
  if (!log) {
    throw new Error('System log no encontrado');
  }
  return log;
}

async function actualizarSystemLog(id, datos) {
  const datosValidados = esquemaActualizarSystemLog.parse({ id, ...datos });
  return await repositorio.actualizarSystemLog(id, datosValidados);
}

async function eliminarSystemLog(id) {
  await obtenerSystemLogPorId(id);
  return await repositorio.eliminarSystemLog(id);
}

export {
  crearSystemLog,
  obtenerTodosSystemLogs,
  obtenerSystemLogPorId,
  actualizarSystemLog,
  eliminarSystemLog,
};
