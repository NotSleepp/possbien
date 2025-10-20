import { esquemaCrearCliente, esquemaActualizarCliente } from './dto.clientes.js';
import * as repositorio from './repositorio.clientes.js';
import { 
  validarDatosCliente, 
  validarAccesoEmpresa 
} from '../../utils/validacionesNegocio.js';

/**
 * Crea un nuevo cliente en la base de datos después de validar los datos.
 * @param {object} datos - Los datos del cliente a crear.
 * @param {number} datos.idEmpresa - ID de la empresa propietaria del cliente.
 * @param {string} datos.codigo - Código único del cliente.
 * @param {string} datos.nombre - Nombre del cliente.
 * @param {string} [datos.direccion] - Dirección del cliente.
 * @param {string} [datos.telefono] - Teléfono del cliente.
 * @param {string} [datos.email] - Email del cliente.
 * @param {string} [datos.tipoDocumento] - Tipo de documento del cliente.
 * @param {string} [datos.numeroDocumento] - Número de documento del cliente.
 * @returns {Promise<object>} El objeto del cliente recién creado.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function crearCliente(datos, usuario = null) {
  const datosValidados = esquemaCrearCliente.parse(datos);
  
  // Validaciones de negocio
  if (usuario) {
    const accesoResult = validarAccesoEmpresa(usuario, datosValidados.idEmpresa);
    if (!accesoResult.esValido) {
      throw new Error(accesoResult.mensaje || 'Acceso no autorizado');
    }
  }
  
  // Validar datos específicos del cliente
  const clienteResult = validarDatosCliente({
    nombre: datosValidados.nombre,
    email: datosValidados.email,
    telefono: datosValidados.telefono,
    documento: datosValidados.numeroDocumento,
    tipoDocumento: datosValidados.tipoDocumento
  });
  if (!clienteResult.esValido) {
    throw new Error(clienteResult.mensaje || 'Datos de cliente inválidos');
  }
  
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
  return await repositorio.crearCliente(mappedData);
}

/**
 * Obtiene todos los clientes activos de una empresa específica.
 * @param {number} idEmpresa - ID de la empresa.
 * @returns {Promise<Array>} Lista de clientes de la empresa.
 */
async function obtenerTodosClientes(idEmpresa, usuario = null) {
  // Validar acceso a la empresa
  if (usuario) {
    await validarAccesoEmpresa(usuario.id, idEmpresa);
  }
  
  return await repositorio.obtenerTodosClientes(idEmpresa);
}

/**
 * Obtiene un cliente específico por su ID.
 * @param {number} id - ID del cliente a buscar.
 * @returns {Promise<object>} El cliente encontrado.
 * @throws {Error} Si el cliente no existe.
 */
async function obtenerClientePorId(id) {
  const cliente = await repositorio.obtenerClientePorId(id);
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }
  return cliente;
}

/**
 * Actualiza un cliente existente con nuevos datos.
 * @param {number} id - ID del cliente a actualizar.
 * @param {object} datos - Datos a actualizar del cliente.
 * @returns {Promise<object>} El cliente actualizado.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function actualizarCliente(id, datos, usuario = null) {
  const datosValidados = esquemaActualizarCliente.parse({ id, ...datos });
  
  // Obtener cliente actual para validaciones
  const clienteActual = await obtenerClientePorId(id);
  
  // Validaciones de negocio
  if (usuario) {
    const accesoResult = validarAccesoEmpresa(usuario, clienteActual.id_empresa);
    if (!accesoResult.esValido) {
      throw new Error(accesoResult.mensaje || 'Acceso no autorizado');
    }
  }
  
  // Validar datos específicos del cliente si se están actualizando
  if (datosValidados.nombre || datosValidados.email || datosValidados.telefono || datosValidados.numeroDocumento) {
    const clienteResult = validarDatosCliente({
      nombre: datosValidados.nombre || clienteActual.nombre,
      email: datosValidados.email || clienteActual.email,
      telefono: datosValidados.telefono || clienteActual.telefono,
      documento: datosValidados.numeroDocumento || clienteActual.numero_documento,
      tipoDocumento: datosValidados.tipoDocumento || clienteActual.tipo_documento
    });
    if (!clienteResult.esValido) {
      throw new Error(clienteResult.mensaje || 'Datos de cliente inválidos');
    }
  }
  
  return await repositorio.actualizarCliente(id, datosValidados);
}

/**
 * Elimina un cliente de forma lógica (soft delete).
 * @param {number} id - ID del cliente a eliminar.
 * @returns {Promise<object>} El cliente marcado como eliminado.
 * @throws {Error} Si el cliente no existe.
 */
export const eliminarCliente = async (id, usuario = null) => {
  if (!usuario || !usuario.empresaId) {
    throw new Error('Acceso no autorizado o empresa no definida');
  }

  const cliente = await repositorio.obtenerClientePorId(id);
  if (!cliente) {
    throw new Error('Cliente no encontrado');
  }

  const result = validarAccesoEmpresa(usuario, cliente.id_empresa);
  if (!result.esValido) {
    throw new Error(result.mensaje || 'Acceso no autorizado');
  }

  return await repositorio.eliminarCliente(id);
};

export {
  crearCliente,
  obtenerTodosClientes,
  obtenerClientePorId,
  actualizarCliente,
};
