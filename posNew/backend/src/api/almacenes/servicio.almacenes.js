import * as repositorio from './repositorio.almacenes.js';
import {
  esquemaCrearAlmacen,
  esquemaActualizarAlmacen,
} from './dto.almacenes.js';

const crearAlmacen = async (datos) => {
  const datosValidados = esquemaCrearAlmacen.parse(datos);
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    id_sucursal: datosValidados.idSucursal,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    descripcion: datosValidados.descripcion,
    default: datosValidados.default,
  };
  return repositorio.crearAlmacen(mappedData);
};

const obtenerAlmacenesPorEmpresa = async (idEmpresa) => {
  return repositorio.obtenerAlmacenesPorEmpresa(idEmpresa);
};

const obtenerAlmacenPorId = async (id) => {
  return repositorio.obtenerAlmacenPorId(id);
};

const actualizarAlmacen = async (id, datos) => {
  const datosValidados = esquemaActualizarAlmacen.parse(datos);
  const mappedData = {
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    descripcion: datosValidados.descripcion,
    default: datosValidados.default,
  };
  return repositorio.actualizarAlmacen(id, mappedData);
};

const eliminarAlmacen = async (id) => {
  return repositorio.eliminarAlmacen(id);
};

export {
  crearAlmacen,
  obtenerAlmacenesPorEmpresa,
  obtenerAlmacenPorId,
  actualizarAlmacen,
  eliminarAlmacen,
};
