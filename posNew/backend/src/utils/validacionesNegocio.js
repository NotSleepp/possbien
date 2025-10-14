/**
 * Validaciones de reglas de negocio para el sistema POS
 * Contiene lógica específica del dominio y reglas empresariales
 */

/**
 * Valida que un producto tenga stock suficiente para una venta
 * @param {object} producto - Producto a validar
 * @param {number} cantidadSolicitada - Cantidad solicitada
 * @returns {object} Resultado de la validación
 */
export function validarStockProducto(producto, cantidadSolicitada) {
  if (!producto) {
    return {
      esValido: false,
      mensaje: 'Producto no encontrado'
    };
  }
  
  if (producto.eliminado) {
    return {
      esValido: false,
      mensaje: 'El producto no está disponible'
    };
  }
  
  if (producto.stock < cantidadSolicitada) {
    return {
      esValido: false,
      mensaje: `Stock insuficiente. Disponible: ${producto.stock}, Solicitado: ${cantidadSolicitada}`
    };
  }
  
  if (producto.stock - cantidadSolicitada <= producto.stockMinimo) {
    return {
      esValido: true,
      mensaje: 'Advertencia: El stock quedará en mínimo después de esta operación',
      advertencia: true
    };
  }
  
  return {
    esValido: true,
    mensaje: 'Stock suficiente'
  };
}

/**
 * Valida que un usuario tenga permisos para acceder a una empresa
 * @param {object} usuario - Usuario a validar
 * @param {number} empresaId - ID de la empresa
 * @returns {object} Resultado de la validación
 */
export function validarAccesoEmpresa(usuario, empresaId) {
  if (!usuario) {
    return {
      esValido: false,
      mensaje: 'Usuario no autenticado'
    };
  }
  
  if (!usuario.empresaId) {
    return {
      esValido: false,
      mensaje: 'Usuario sin empresa asignada'
    };
  }
  
  if (usuario.empresaId !== empresaId) {
    return {
      esValido: false,
      mensaje: 'No tienes acceso a esta empresa'
    };
  }
  
  return {
    esValido: true,
    mensaje: 'Acceso autorizado'
  };
}

/**
 * Valida que un usuario tenga permisos para acceder a una sucursal
 * @param {object} usuario - Usuario a validar
 * @param {number} sucursalId - ID de la sucursal
 * @returns {object} Resultado de la validación
 */
export function validarAccesoSucursal(usuario, sucursalId) {
  if (!usuario) {
    return {
      esValido: false,
      mensaje: 'Usuario no autenticado'
    };
  }
  
  if (!usuario.sucursalId) {
    return {
      esValido: false,
      mensaje: 'Usuario sin sucursal asignada'
    };
  }
  
  if (usuario.sucursalId !== sucursalId) {
    return {
      esValido: false,
      mensaje: 'No tienes acceso a esta sucursal'
    };
  }
  
  return {
    esValido: true,
    mensaje: 'Acceso autorizado'
  };
}

/**
 * Valida que una venta sea válida según las reglas de negocio
 * @param {object} venta - Datos de la venta
 * @param {array} productos - Array de productos en la venta
 * @returns {object} Resultado de la validación
 */
export function validarVenta(venta, productos) {
  const errores = [];
  const advertencias = [];
  
  // Validar que la venta tenga productos
  if (!productos || productos.length === 0) {
    errores.push('La venta debe tener al menos un producto');
  }
  
  // Validar que todos los productos tengan cantidad válida
  productos.forEach((item, index) => {
    if (!item.cantidad || item.cantidad <= 0) {
      errores.push(`El producto en la posición ${index + 1} debe tener una cantidad válida`);
    }
    
    if (!item.precio || item.precio <= 0) {
      errores.push(`El producto en la posición ${index + 1} debe tener un precio válido`);
    }
  });
  
  // Validar total de la venta
  const totalCalculado = productos.reduce((total, item) => {
    return total + (item.cantidad * item.precio);
  }, 0);
  
  if (Math.abs(venta.total - totalCalculado) > 0.01) {
    errores.push('El total de la venta no coincide con la suma de los productos');
  }
  
  // Validar método de pago
  const metodosPagoValidos = ['efectivo', 'tarjeta', 'transferencia', 'mixto'];
  if (!metodosPagoValidos.includes(venta.metodoPago)) {
    errores.push('Método de pago no válido');
  }
  
  // Validar que el monto pagado sea suficiente
  if (venta.montoPagado < venta.total) {
    errores.push('El monto pagado es insuficiente');
  }
  
  return {
    esValido: errores.length === 0,
    errores,
    advertencias,
    mensaje: errores.length === 0 ? 'Venta válida' : 'La venta tiene errores'
  };
}

/**
 * Valida que un precio sea válido según las reglas de negocio
 * @param {number} precioCompra - Precio de compra
 * @param {number} precioVenta - Precio de venta
 * @returns {object} Resultado de la validación
 */
export function validarPrecios(precioCompra, precioVenta) {
  const errores = [];
  const advertencias = [];
  
  if (precioCompra <= 0) {
    errores.push('El precio de compra debe ser mayor a cero');
  }
  
  if (precioVenta <= 0) {
    errores.push('El precio de venta debe ser mayor a cero');
  }
  
  if (precioVenta <= precioCompra) {
    advertencias.push('El precio de venta es menor o igual al precio de compra');
  }
  
  const margen = ((precioVenta - precioCompra) / precioCompra) * 100;
  if (margen < 10) {
    advertencias.push(`Margen de ganancia bajo: ${margen.toFixed(2)}%`);
  }
  
  return {
    esValido: errores.length === 0,
    errores,
    advertencias,
    margen: margen.toFixed(2),
    mensaje: errores.length === 0 ? 'Precios válidos' : 'Los precios tienen errores'
  };
}

/**
 * Valida que una fecha sea válida para operaciones comerciales
 * @param {string|Date} fecha - Fecha a validar
 * @param {boolean} permitirFuturo - Si se permite fechas futuras
 * @returns {object} Resultado de la validación
 */
export function validarFechaComercial(fecha, permitirFuturo = false) {
  const fechaObj = new Date(fecha);
  const ahora = new Date();
  
  if (isNaN(fechaObj.getTime())) {
    return {
      esValido: false,
      mensaje: 'Fecha inválida'
    };
  }
  
  // Validar que no sea muy antigua (más de 1 año)
  const unAnoAtras = new Date();
  unAnoAtras.setFullYear(unAnoAtras.getFullYear() - 1);
  
  if (fechaObj < unAnoAtras) {
    return {
      esValido: false,
      mensaje: 'La fecha no puede ser anterior a un año'
    };
  }
  
  // Validar fechas futuras si no están permitidas
  if (!permitirFuturo && fechaObj > ahora) {
    return {
      esValido: false,
      mensaje: 'No se permiten fechas futuras'
    };
  }
  
  return {
    esValido: true,
    mensaje: 'Fecha válida'
  };
}

/**
 * Valida que un código de producto sea único en la empresa
 * @param {string} codigo - Código del producto
 * @param {number} empresaId - ID de la empresa
 * @param {number} productoId - ID del producto (para actualizaciones)
 * @param {function} verificarCodigo - Función para verificar en BD
 * @returns {Promise<object>} Resultado de la validación
 */
export async function validarCodigoProductoUnico(codigo, empresaId, productoId = null, verificarCodigo) {
  if (!codigo || codigo.trim().length === 0) {
    return {
      esValido: false,
      mensaje: 'El código del producto es requerido'
    };
  }
  
  if (codigo.length < 3 || codigo.length > 20) {
    return {
      esValido: false,
      mensaje: 'El código debe tener entre 3 y 20 caracteres'
    };
  }
  
  try {
    const productoExistente = await verificarCodigo(codigo, empresaId);
    
    if (productoExistente && productoExistente.id !== productoId) {
      return {
        esValido: false,
        mensaje: 'Ya existe un producto con este código'
      };
    }
    
    return {
      esValido: true,
      mensaje: 'Código disponible'
    };
  } catch (error) {
    return {
      esValido: false,
      mensaje: 'Error al validar el código'
    };
  }
}

/**
 * Valida los datos de un cliente según las reglas de negocio
 * @param {object} cliente - Datos del cliente
 * @returns {object} Resultado de la validación
 */
export function validarDatosCliente(cliente) {
  const errores = [];
  const advertencias = [];
  
  // Validar nombre
  if (!cliente.nombre || cliente.nombre.trim().length < 2) {
    errores.push('El nombre debe tener al menos 2 caracteres');
  }
  
  // Validar email si se proporciona
  if (cliente.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cliente.email)) {
      errores.push('El formato del email no es válido');
    }
  }
  
  // Validar teléfono si se proporciona
  if (cliente.telefono) {
    const telefonoRegex = /^[\d\s\-\+\(\)]{7,15}$/;
    if (!telefonoRegex.test(cliente.telefono)) {
      errores.push('El formato del teléfono no es válido');
    }
  }
  
  // Validar documento si se proporciona
  if (cliente.documento) {
    if (cliente.documento.length < 7 || cliente.documento.length > 15) {
      errores.push('El documento debe tener entre 7 y 15 caracteres');
    }
  }
  
  return {
    esValido: errores.length === 0,
    errores,
    advertencias,
    mensaje: errores.length === 0 ? 'Datos del cliente válidos' : 'Los datos del cliente tienen errores'
  };
}

export default {
  validarStockProducto,
  validarAccesoEmpresa,
  validarAccesoSucursal,
  validarVenta,
  validarPrecios,
  validarFechaComercial,
  validarCodigoProductoUnico,
  validarDatosCliente
};