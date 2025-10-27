import { esquemaCrearEmpresa, esquemaActualizarEmpresa } from './dto.empresas.js';
import * as repositorio from './repositorio.empresas.js';

async function crearEmpresa(datos) {
  const datosValidados = esquemaCrearEmpresa.parse(datos);
  const mappedData = {
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    ruc: datosValidados.ruc,
    direccion: datosValidados.direccion,
    telefono: datosValidados.telefono,
    email: datosValidados.email,
  };
  return await repositorio.crearEmpresa(mappedData);
}

async function obtenerTodasEmpresas() {
  return await repositorio.obtenerTodasEmpresas();
}

async function obtenerEmpresaPorId(id) {
  const empresa = await repositorio.obtenerEmpresaPorId(id);
  if (!empresa) {
    throw new Error('Empresa no encontrada');
  }
  return empresa;
}

async function actualizarEmpresa(id, datos) {
  const datosValidados = esquemaActualizarEmpresa.parse({ id, ...datos });
  // Remover el id de los datos a actualizar
  const { id: _, ...datosActualizar } = datosValidados;
  // Remover campos undefined o null
  const datosLimpios = Object.fromEntries(
    Object.entries(datosActualizar).filter(([_, v]) => v !== undefined && v !== null)
  );
  return await repositorio.actualizarEmpresa(id, datosLimpios);
}

async function eliminarEmpresa(id) {
  await obtenerEmpresaPorId(id); // Verifica existencia
  return await repositorio.eliminarEmpresa(id);
}

export { crearEmpresa, obtenerTodasEmpresas, obtenerEmpresaPorId, actualizarEmpresa, eliminarEmpresa };