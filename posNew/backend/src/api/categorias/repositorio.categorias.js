import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasCategorias(idEmpresa) {
  console.log('[Categorias][Repo] obtenerTodasCategorias - idEmpresa:', idEmpresa);
  return await clienteBaseDeDatos('categorias').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerCategoriaPorId(id) {
  console.log('[Categorias][Repo] obtenerCategoriaPorId - id:', id);
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

async function crearCategoria(datos) {
  console.log('[Categorias][Repo] crearCategoria - datos insert:', datos);
  const [id] = await clienteBaseDeDatos('categorias').insert(datos);
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

async function actualizarCategoria(id, datos) {
  console.log('[Categorias][Repo] actualizarCategoria - id:', id, 'datos:', datos);
  await clienteBaseDeDatos('categorias').where({ id }).update(datos);
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

async function eliminarCategoria(id) {
  console.log('[Categorias][Repo] eliminarCategoria - id:', id);
  await clienteBaseDeDatos('categorias').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

async function obtenerCategoriaPorCodigoYEmpresa(codigo, idEmpresa) {
  console.log('[Categorias][Repo] obtenerCategoriaPorCodigoYEmpresa - codigo:', codigo, 'idEmpresa:', idEmpresa);
  return await clienteBaseDeDatos('categorias')
    .where({ codigo, id_empresa: idEmpresa, eliminado: false })
    .first();
}

async function contarProductosPorCategoria(idCategoria) {
  const result = await clienteBaseDeDatos('productos')
    .where({ id_categoria: idCategoria, eliminado: false })
    .count('* as count')
    .first();
  return result?.count || 0;
}

export {
    crearCategoria,
    obtenerTodasCategorias,
    obtenerCategoriaPorId,
    actualizarCategoria,
    eliminarCategoria,
    obtenerCategoriaPorCodigoYEmpresa,
    contarProductosPorCategoria
};
