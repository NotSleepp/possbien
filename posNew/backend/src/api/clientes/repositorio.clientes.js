import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosClientes(idEmpresa) {
  return await clienteBaseDeDatos('clientes_proveedores').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerClientePorId(id) {
  return await clienteBaseDeDatos('clientes_proveedores').where({ id }).first();
}

async function crearCliente(datos) {
  const [id] = await clienteBaseDeDatos('clientes').insert(datos);
  return await clienteBaseDeDatos('clientes').where({ id }).first();
}

async function actualizarCliente(id, datos) {
  await clienteBaseDeDatos('clientes').where({ id }).update(datos);
  return await clienteBaseDeDatos('clientes').where({ id }).first();
}

async function eliminarCliente(id) {
  await clienteBaseDeDatos('clientes').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('clientes').where({ id }).first();
}

export {
  obtenerTodosClientes,
  obtenerClientePorId,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
};
