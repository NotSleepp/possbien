import { esquemaCrearProveedor, esquemaActualizarProveedor } from './dto.proveedores.js';
import * as repositorio from './repositorio.proveedores.js';

async function crearProveedor(datos) {
  const datosValidados = esquemaCrearProveedor.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    direccion: datosValidados.direccion,
    telefono: datosValidados.telefono,
    email: datosValidados.email,
    tipo_documento: datosValidados.tipoDocumento,
    numero_documento: datosValidados.numeroDocumento,
  };
  return await repositorio.crearProveedor(mappedData);
}

async function obtenerTodosProveedores(idEmpresa) {
  return await repositorio.obtenerTodosProveedores(idEmpresa);
}

async function obtenerProveedorPorId(id) {
  const proveedor = await repositorio.obtenerProveedorPorId(id);
  if (!proveedor) {
    throw new Error('Proveedor no encontrado');
  }
  return proveedor;
}

async function actualizarProveedor(id, datos) {
  const datosValidados = esquemaActualizarProveedor.parse({ id, ...datos });
  return await repositorio.actualizarProveedor(id, datosValidados);
}

async function eliminarProveedor(id) {
  await obtenerProveedorPorId(id);
  return await repositorio.eliminarProveedor(id);
}

export {
    crearProveedor,
    obtenerTodosProveedores,
    obtenerProveedorPorId,
    actualizarProveedor,
    eliminarProveedor
};
