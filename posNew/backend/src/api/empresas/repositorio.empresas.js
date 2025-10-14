import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodasEmpresas() {
  return await clienteBaseDeDatos('empresa').where({ eliminado: false });
}

async function obtenerEmpresaPorId(id) {
  return await clienteBaseDeDatos('empresa').where({ id }).first();
}

async function crearEmpresa(datos) {
  const [id] = await clienteBaseDeDatos('empresa').insert(datos);
  return await clienteBaseDeDatos('empresa').where({ id }).first();
}

async function actualizarEmpresa(id, datos) {
  await clienteBaseDeDatos('empresa').where({ id }).update(datos);
  return await clienteBaseDeDatos('empresa').where({ id }).first();
}

async function eliminarEmpresa(id) {
  await clienteBaseDeDatos('empresa').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('empresa').where({ id }).first();
}

export { obtenerTodasEmpresas, obtenerEmpresaPorId, crearEmpresa, actualizarEmpresa, eliminarEmpresa };