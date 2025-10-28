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
  
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, datosValidados.idEmpresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  
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
    stock_minimo: datosValidados.stockMinimo,
    unidad_medida: datosValidados.unidadMedida,
    codigo_barras: datosValidados.codigoBarras,
    codigo_interno: datosValidados.codigoInterno,
    sevende_por: datosValidados.sevendePor,
    maneja_inventarios: datosValidados.manejaInventarios,
    maneja_multiprecios: datosValidados.manejaMultiprecios,
    imagen_url: datosValidados.imagenUrl,
  };
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

// Obtiene productos por empresa con stock agregado (stock_actual)
async function obtenerProductosConStockPorEmpresa(idEmpresa, usuario = null) {
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, idEmpresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  return await repositorio.obtenerProductosConStockPorEmpresa(idEmpresa);
}

// Busca productos por empresa con texto libre en nombre o códigos
async function buscarProductosPorEmpresa(idEmpresa, q, usuario = null) {
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, idEmpresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  return await repositorio.buscarProductosPorEmpresa(idEmpresa, q);
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
  
  const productoActual = await obtenerProductoPorId(id);
  
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, productoActual.id_empresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  
  if (datosValidados.codigo && datosValidados.codigo !== productoActual.codigo) {
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
  
  if (datosValidados.precioCompra || datosValidados.precioVenta) {
    const precioCompra = datosValidados.precioCompra || productoActual.precio_compra;
    const precioVenta = datosValidados.precioVenta || productoActual.precio_venta;
    const precioResult = validarPrecios(precioCompra, precioVenta);
    if (!precioResult.esValido) {
      throw new Error(precioResult.mensaje);
    }
  }
  
  const mappedUpdate = {};
  if (datosValidados.idCategoria !== undefined) mappedUpdate.id_categoria = datosValidados.idCategoria;
  if (datosValidados.codigo !== undefined) mappedUpdate.codigo = datosValidados.codigo;
  if (datosValidados.nombre !== undefined) mappedUpdate.nombre = datosValidados.nombre;
  if (datosValidados.descripcion !== undefined) mappedUpdate.descripcion = datosValidados.descripcion;
  if (datosValidados.precioCompra !== undefined) mappedUpdate.precio_compra = datosValidados.precioCompra;
  if (datosValidados.precioVenta !== undefined) mappedUpdate.precio_venta = datosValidados.precioVenta;
  if (datosValidados.stockMinimo !== undefined) mappedUpdate.stock_minimo = datosValidados.stockMinimo;
  if (datosValidados.unidadMedida !== undefined) mappedUpdate.unidad_medida = datosValidados.unidadMedida;
  if (datosValidados.codigoBarras !== undefined) mappedUpdate.codigo_barras = datosValidados.codigoBarras;
  if (datosValidados.codigoInterno !== undefined) mappedUpdate.codigo_interno = datosValidados.codigoInterno;
  if (datosValidados.sevendePor !== undefined) mappedUpdate.sevende_por = datosValidados.sevendePor;
  if (datosValidados.manejaInventarios !== undefined) mappedUpdate.maneja_inventarios = datosValidados.manejaInventarios;
  if (datosValidados.manejaMultiprecios !== undefined) mappedUpdate.maneja_multiprecios = datosValidados.manejaMultiprecios;
  if (datosValidados.imagenUrl !== undefined) mappedUpdate.imagen_url = datosValidados.imagenUrl;
  
  return await repositorio.actualizarProducto(id, mappedUpdate);
}

/**
 * Elimina un producto de forma lógica (soft delete).
 * @param {number} id - ID del producto a eliminar.
 * @returns {Promise<object>} El producto marcado como eliminado.
 * @throws {Error} Si el producto no existe.
 */
export const eliminarProducto = async (id, usuario = null) => {
  if (!usuario || !usuario.empresaId) {
    throw new Error('Acceso no autorizado o empresa no definida');
  }

  const producto = await repositorio.obtenerProductoPorId(id);
  if (!producto) {
    throw new Error('Producto no encontrado');
  }

  // Validar que el producto pertenece a la misma empresa del usuario
  const result = validarAccesoEmpresa(usuario, producto.id_empresa);
  if (!result.esValido) {
    throw new Error(result.mensaje || 'Acceso no autorizado');
  }

  return await repositorio.eliminarProducto(id);
};

export {
  crearProducto,
  obtenerTodosProductos,
  obtenerProductosConStockPorEmpresa,
  buscarProductosPorEmpresa,
  obtenerProductoPorId,
  actualizarProducto,
};
