import { esquemaCrearProducto, esquemaActualizarProducto } from './dto.productos.js';
import * as repositorio from './repositorio.productos.js';
import { 
  validarCodigoProductoUnico, 
  validarPrecios, 
  validarAccesoEmpresa 
} from '../../utils/validacionesNegocio.js';

/**
 * Crea un nuevo producto en la base de datos después de validar los datos.
 * @param {object} datos - Los datos del producto a crear.
 * @param {number} datos.idEmpresa - ID de la empresa propietaria del producto.
 * @param {number} datos.idCategoria - ID de la categoría del producto.
 * @param {string} datos.codigo - Código único del producto.
 * @param {string} datos.nombre - Nombre del producto.
 * @param {string} [datos.descripcion] - Descripción opcional del producto.
 * @param {number} datos.precioCompra - Precio de compra del producto.
 * @param {number} datos.precioVenta - Precio de venta del producto.
 * @param {number} datos.stockActual - Stock actual del producto.
 * @param {number} datos.stockMinimo - Stock mínimo del producto.
 * @param {string} [datos.unidadMedida] - Unidad de medida del producto.
 * @returns {Promise<object>} El objeto del producto recién creado.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function crearProducto(datos, usuario = null) {
  const datosValidados = esquemaCrearProducto.parse(datos);
  
  // Validaciones de negocio
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, datosValidados.idEmpresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  
  // Crear función de verificación para validar código único
  const verificarCodigo = async (codigo, empresaId) => {
    return await repositorio.obtenerPorCodigo(codigo, empresaId);
  };
  
  const validacionCodigo = await validarCodigoProductoUnico(
    datosValidados.codigo, 
    datosValidados.idEmpresa, 
    null, 
    verificarCodigo
  );
  
  if (!validacionCodigo.esValido) {
    throw new Error(validacionCodigo.mensaje);
  }
  const precioResult = validarPrecios(datosValidados.precioCompra, datosValidados.precioVenta);
  if (!precioResult.esValido) {
    throw new Error(precioResult.mensaje);
  }
  
  const mappedData = {
    id_empresa: datosValidados.idEmpresa,
    id_categoria: datosValidados.idCategoria,
    codigo: datosValidados.codigo,
    nombre: datosValidados.nombre,
    descripcion: datosValidados.descripcion,
    precio_compra: datosValidados.precioCompra,
    precio_venta: datosValidados.precioVenta,
    unidad_medida: datosValidados.unidadMedida,
  };
  // TODO: Create associated Stock entry with stockActual and stockMinimo
  return await repositorio.crearProducto(mappedData);
}

/**
 * Obtiene todos los productos activos de una empresa específica.
 * @param {number} idEmpresa - ID de la empresa.
 * @returns {Promise<Array>} Lista de productos de la empresa.
 */
async function obtenerTodosProductos(idEmpresa, usuario = null) {
  // Validar acceso a la empresa
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, idEmpresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  
  return await repositorio.obtenerTodosProductos(idEmpresa);
}

/**
 * Obtiene un producto específico por su ID.
 * @param {number} id - ID del producto a buscar.
 * @returns {Promise<object>} El producto encontrado.
 * @throws {Error} Si el producto no existe.
 */
async function obtenerProductoPorId(id) {
  const producto = await repositorio.obtenerProductoPorId(id);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }
  return producto;
}

/**
 * Actualiza un producto existente con nuevos datos.
 * @param {number} id - ID del producto a actualizar.
 * @param {object} datos - Datos a actualizar del producto.
 * @returns {Promise<object>} El producto actualizado.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function actualizarProducto(id, datos, usuario = null) {
  const datosValidados = esquemaActualizarProducto.parse({ id, ...datos });
  
  // Obtener producto actual para validaciones
  const productoActual = await obtenerProductoPorId(id);
  
  // Validaciones de negocio
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, productoActual.id_empresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  
  // Si se está cambiando el código, validar unicidad
  if (datosValidados.codigo && datosValidados.codigo !== productoActual.codigo) {
    // Crear función de verificación para validar código único
    const verificarCodigo = async (codigo, empresaId) => {
      return await repositorio.obtenerPorCodigo(codigo, empresaId);
    };
    
    const validacionCodigo = await validarCodigoProductoUnico(
      datosValidados.codigo, 
      productoActual.id_empresa, 
      id, 
      verificarCodigo
    );
    
    if (!validacionCodigo.esValido) {
      throw new Error(validacionCodigo.mensaje);
    }
  }
  
  // Si se están actualizando precios, validarlos
  if (datosValidados.precioCompra || datosValidados.precioVenta) {
    const precioCompra = datosValidados.precioCompra || productoActual.precio_compra;
    const precioVenta = datosValidados.precioVenta || productoActual.precio_venta;
    const precioResult = validarPrecios(precioCompra, precioVenta);
    if (!precioResult.esValido) {
      throw new Error(precioResult.mensaje);
    }
  }
  
  return await repositorio.actualizarProducto(id, datosValidados);
}

/**
 * Elimina un producto de forma lógica (soft delete).
 * @param {number} id - ID del producto a eliminar.
 * @returns {Promise<object>} El producto marcado como eliminado.
 * @throws {Error} Si el producto no existe.
 */
async function eliminarProducto(id) {
  await obtenerProductoPorId(id);
  return await repositorio.eliminarProducto(id);
}

export {
  crearProducto,
  obtenerTodosProductos,
  obtenerProductoPorId,
  actualizarProducto,
  eliminarProducto,
};
