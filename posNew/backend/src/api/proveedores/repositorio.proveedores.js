import clienteBaseDeDatos from '../../config/baseDeDatos.js';

async function obtenerTodosProveedores(idEmpresa) {
  return await clienteBaseDeDatos('proveedores').where({ id_empresa: idEmpresa, eliminado: false });
}

async function obtenerProveedorPorId(id) {
  return await clienteBaseDeDatos('proveedores').where({ id }).first();
}

async function crearProveedor(datos) {
  const [id] = await clienteBaseDeDatos('proveedores').insert(datos);
  return await clienteBaseDeDatos('proveedores').where({ id }).first();
}

async function actualizarProveedor(id, datos) {
  await clienteBaseDeDatos('proveedores').where({ id }).update(datos);
  return await clienteBaseDeDatos('proveedores').where({ id }).first();
}

async function eliminarProveedor(id) {
  await clienteBaseDeDatos('proveedores').where({ id }).update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('proveedores').where({ id }).first();
}

export {
    crearProveedor,
    obtenerTodosProveedores,
    obtenerProveedorPorId,
    actualizarProveedor,
    eliminarProveedor
};
