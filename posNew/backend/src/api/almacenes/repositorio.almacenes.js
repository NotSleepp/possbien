import clienteBaseDeDatos from '../../config/baseDeDatos.js';

const crearAlmacen = async (data) => {
  const [id] = await clienteBaseDeDatos('almacen').insert(data);
  return clienteBaseDeDatos('almacen').where({ id }).first();
};

const obtenerAlmacenesPorEmpresa = async (idEmpresa) => {
  return clienteBaseDeDatos('almacen').where({ id_empresa: idEmpresa });
};

const obtenerAlmacenPorId = async (id) => {
  return clienteBaseDeDatos('almacen').where({ id }).first();
};

const actualizarAlmacen = async (id, data) => {
  await clienteBaseDeDatos('almacen').where({ id }).update(data);
  return clienteBaseDeDatos('almacen').where({ id }).first();
};

const eliminarAlmacen = async (id) => {
  await clienteBaseDeDatos('almacen').where({ id }).del();
  return { id };
};

export {
  crearAlmacen,
  obtenerAlmacenesPorEmpresa,
  obtenerAlmacenPorId,
  actualizarAlmacen,
  eliminarAlmacen,
};
