import { esquemaCrearVenta, esquemaActualizarVenta } from './dto.ventas.js';
import * as repositorio from './repositorio.ventas.js';
import { 
  validarVenta, 
  validarAccesoSucursal, 
  validarFechaComercial,
  validarStockProducto 
} from '../../utils/validacionesNegocio.js';

/**
 * Crea una nueva venta en la base de datos después de validar los datos.
 * @param {object} datos - Los datos de la venta a crear.
 * @param {number} datos.idSucursal - ID de la sucursal donde se realiza la venta.
 * @param {number} datos.idCliente - ID del cliente que realiza la compra.
 * @param {string} [datos.fechaVenta] - Fecha de la venta (ISO string). Si no se proporciona, usa la fecha actual.
 * @param {number} datos.total - Total de la venta.
 * @param {string} datos.estado - Estado de la venta (ej: 'completada', 'pendiente', 'cancelada').
 * @returns {Promise<object>} El objeto de la venta recién creada.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function crearVenta(datos, usuario = null) {
  const datosValidados = esquemaCrearVenta.parse(datos);
  
  // Validaciones de negocio
  if (usuario) {
    const result = await validarAccesoSucursal(usuario, datosValidados.idSucursal);
    if (!result.esValido) {
      throw new Error(result.mensaje);
    }
  }
  
  // Validar fecha comercial
  if (datosValidados.fechaVenta) {
    const fechaResult = validarFechaComercial(datosValidados.fechaVenta);
    if (!fechaResult.esValido) {
      throw new Error(fechaResult.mensaje);
    }
  }
  
  // Validar datos de la venta (productos, cantidades, precios, etc.)
  if (datos.productos && datos.productos.length > 0) {
    const ventaResult = await validarVenta(datos);
    if (!ventaResult.esValido) {
      throw new Error(ventaResult.mensaje);
    }
    
    // Validar stock de cada producto
    for (const producto of datos.productos) {
      const stockResult = await validarStockProducto(producto.idProducto, producto.cantidad);
      if (!stockResult.esValido) {
        throw new Error(stockResult.mensaje);
      }
    }
  }
  
  const mappedData = {
    id_sucursal: datosValidados.idSucursal,
    id_cliente: datosValidados.idCliente,
    fecha_venta: datosValidados.fechaVenta ? new Date(datosValidados.fechaVenta) : new Date(),
    total: datosValidados.total,
    estado: datosValidados.estado,
  };
  return await repositorio.crearVenta(mappedData);
}

/**
 * Obtiene todas las ventas activas de una sucursal específica.
 * @param {number} idSucursal - ID de la sucursal.
 * @returns {Promise<Array>} Lista de ventas de la sucursal.
 */
async function obtenerTodasVentas(idSucursal, usuario = null) {
  // Validar acceso a la sucursal
  if (usuario) {
    const result = await validarAccesoSucursal(usuario, idSucursal);
    if (!result.esValido) {
      throw new Error(result.mensaje);
    }
  }
  
  return await repositorio.obtenerTodasVentas(idSucursal);
}

/**
 * Obtiene una venta específica por su ID.
 * @param {number} id - ID de la venta a buscar.
 * @returns {Promise<object>} La venta encontrada.
 * @throws {Error} Si la venta no existe.
 */
async function obtenerVentaPorId(id) {
  const venta = await repositorio.obtenerVentaPorId(id);
  if (!venta) {
    throw new Error('Venta no encontrada');
  }
  return venta;
}

/**
 * Actualiza una venta existente con nuevos datos.
 * @param {number} id - ID de la venta a actualizar.
 * @param {object} datos - Datos a actualizar de la venta.
 * @returns {Promise<object>} La venta actualizada.
 * @throws {Error} Si los datos no pasan la validación de Zod.
 */
async function actualizarVenta(id, datos, usuario = null) {
  const datosValidados = esquemaActualizarVenta.parse({ id, ...datos });
  
  // Obtener venta actual para validaciones
  const ventaActual = await obtenerVentaPorId(id);
  
  // Validaciones de negocio
  if (usuario) {
    const result = await validarAccesoSucursal(usuario, ventaActual.id_sucursal);
    if (!result.esValido) {
      throw new Error(result.mensaje);
    }
  }
  
  // Validar fecha comercial si se está actualizando
  if (datosValidados.fechaVenta) {
    const fechaResult = validarFechaComercial(datosValidados.fechaVenta);
    if (!fechaResult.esValido) {
      throw new Error(fechaResult.mensaje);
    }
  }
  
  // Si se están actualizando productos, validar la venta completa
  if (datos.productos && datos.productos.length > 0) {
    const ventaResult = await validarVenta({ ...ventaActual, ...datos });
    if (!ventaResult.esValido) {
      throw new Error(ventaResult.mensaje);
    }
  }
  
  return await repositorio.actualizarVenta(id, datosValidados);
}

/**
 * Elimina una venta de forma lógica (soft delete).
 * @param {number} id - ID de la venta a eliminar.
 * @returns {Promise<object>} La venta marcada como eliminada.
 * @throws {Error} Si la venta no existe.
 */
async function eliminarVenta(id) {
  await obtenerVentaPorId(id);
  return await repositorio.eliminarVenta(id);
}

export {
  crearVenta,
  obtenerTodasVentas,
  obtenerVentaPorId,
  actualizarVenta,
  eliminarVenta,
};
