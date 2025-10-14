import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasCategorias(idEmpresa) {
  return await clienteBaseDeDatos('categoria').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerCategoriaPorId(id) {
  return await clienteBaseDeDatos('categoria').where({ id }).first();
}

async function crearCategoria(datos) {
  const [id] = await clienteBaseDeDatos('categorias').insert(datos);
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

async function actualizarCategoria(id, datos) {
  await clienteBaseDeDatos('categorias').where({ id }).update(datos);
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

async function eliminarCategoria(id) {
  await clienteBaseDeDatos('categorias').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

export {
    crearCategoria,
    obtenerTodasCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria
};
