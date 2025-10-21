import { esquemaCrearVenta, esquemaActualizarVenta } from './dto.ventas.js';
import * as repositorio from './repositorio.ventas.js';
import { 
  validarVenta, 
  validarAccesoSucursal, 
  validarFechaComercial,
  validarStockProducto 
} from '../../utils/validacionesNegocio.js';

async function crearVenta(datos, usuario = null) {
  const datosValidados = esquemaCrearVenta.parse(datos);
  
  if (usuario) {
    const result = await validarAccesoSucursal(usuario, datosValidados.idSucursal);
    if (!result.esValido) {
      throw new Error(result.mensaje);
    }
  }
  
  if (datosValidados.fechaVenta) {
    const fechaResult = validarFechaComercial(datosValidados.fechaVenta);
    if (!fechaResult.esValido) {
      throw new Error(fechaResult.mensaje);
    }
  }
  
  if (datos.productos && datos.productos.length > 0) {
    const ventaResult = await validarVenta(datos);
    if (!ventaResult.esValido) {
      throw new Error(ventaResult.mensaje);
    }
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
    monto_total: datosValidados.montoTotal,
    estado: datosValidados.estado,
  };
  return await repositorio.crearVenta(mappedData);
}

async function obtenerTodasVentas(idSucursal, usuario = null) {
  if (usuario) {
    const result = await validarAccesoSucursal(usuario, idSucursal);
    if (!result.esValido) {
      throw new Error(result.mensaje);
    }
  }
  return await repositorio.obtenerTodasVentas(idSucursal);
}

async function obtenerVentaPorId(id) {
  const venta = await repositorio.obtenerVentaPorId(id);
  if (!venta) {
    throw new Error('Venta no encontrada');
  }
  return venta;
}

async function actualizarVenta(id, datos, usuario = null) {
  const datosValidados = esquemaActualizarVenta.parse({ id, ...datos });
  const ventaActual = await obtenerVentaPorId(id);
  
  if (usuario) {
    const result = await validarAccesoSucursal(usuario, ventaActual.id_sucursal);
    if (!result.esValido) {
      throw new Error(result.mensaje);
    }
  }
  
  if (datosValidados.fechaVenta) {
    const fechaResult = validarFechaComercial(datosValidados.fechaVenta);
    if (!fechaResult.esValido) {
      throw new Error(fechaResult.mensaje);
    }
  }
  
  if (datos.productos && datos.productos.length > 0) {
    const ventaResult = await validarVenta({ ...ventaActual, ...datos });
    if (!ventaResult.esValido) {
      throw new Error(ventaResult.mensaje);
    }
  }
  
  const mappedData = {
    id_sucursal: datosValidados.idSucursal,
    id_cliente: datosValidados.idCliente,
    fecha_venta: datosValidados.fechaVenta ? new Date(datosValidados.fechaVenta) : undefined,
    monto_total: datosValidados.montoTotal,
    estado: datosValidados.estado,
  };
  return await repositorio.actualizarVenta(id, mappedData);
}

async function eliminarVenta(id, usuario = null) {
  const venta = await obtenerVentaPorId(id);
  if (usuario) {
    const result = await validarAccesoSucursal(usuario, venta.id_sucursal);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado a la sucursal');
    }
  }
  return await repositorio.eliminarVenta(id);
}

export {
  crearVenta,
  obtenerTodasVentas,
  obtenerVentaPorId,
  actualizarVenta,
  eliminarVenta,
};
