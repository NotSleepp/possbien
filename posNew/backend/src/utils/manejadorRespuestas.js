/**
 * Utilidades para manejo consistente de respuestas HTTP
 * Siguiendo estándares REST y mejores prácticas de APIs
 */

/**
 * Envía una respuesta exitosa con formato estándar
 * @param {object} res - Response de Express
 * @param {any} datos - Datos a enviar en la respuesta
 * @param {string} mensaje - Mensaje descriptivo (opcional)
 * @param {number} status - Código de estado HTTP (por defecto 200)
 * @param {object} meta - Metadatos adicionales como paginación (opcional)
 */
function enviarRespuesta(res, datos = null, mensaje = 'Operación exitosa', status = 200, meta = null) {
  const respuesta = {
    exito: true,
    mensaje,
    timestamp: new Date().toISOString()
  };
  
  // Solo incluir datos si existen
  if (datos !== null) {
    respuesta.datos = datos;
  }
  
  // Incluir metadatos si existen (útil para paginación)
  if (meta) {
    respuesta.meta = meta;
  }
  
  res.status(status).json(respuesta);
}

/**
 * Envía una respuesta de error con formato estándar
 * @param {object} res - Response de Express
 * @param {string} mensaje - Mensaje de error
 * @param {number} status - Código de estado HTTP (por defecto 400)
 * @param {string} codigo - Código de error específico (opcional)
 * @param {object} detalles - Detalles adicionales del error (opcional)
 */
function enviarError(res, mensaje = 'Error en la operación', status = 400, codigo = null, detalles = null) {
  const respuesta = {
    exito: false,
    error: {
      mensaje,
      timestamp: new Date().toISOString()
    }
  };
  
  // Incluir código de error si se proporciona
  if (codigo) {
    respuesta.error.codigo = codigo;
  }
  
  // Incluir detalles adicionales si existen
  if (detalles) {
    respuesta.error.detalles = detalles;
  }
  
  res.status(status).json(respuesta);
}

/**
 * Envía una respuesta exitosa para operaciones de creación
 * @param {object} res - Response de Express
 * @param {any} datos - Datos del recurso creado
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarCreado(res, datos, mensaje = 'Recurso creado exitosamente') {
  enviarRespuesta(res, datos, mensaje, 201);
}

/**
 * Envía una respuesta exitosa para operaciones de actualización
 * @param {object} res - Response de Express
 * @param {any} datos - Datos del recurso actualizado
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarActualizado(res, datos, mensaje = 'Recurso actualizado exitosamente') {
  enviarRespuesta(res, datos, mensaje, 200);
}

/**
 * Envía una respuesta exitosa para operaciones de eliminación
 * @param {object} res - Response de Express
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarEliminado(res, mensaje = 'Recurso eliminado exitosamente') {
  enviarRespuesta(res, null, mensaje, 200);
}

/**
 * Envía una respuesta con lista paginada
 * @param {object} res - Response de Express
 * @param {array} datos - Array de datos
 * @param {object} paginacion - Información de paginación
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarListaPaginada(res, datos, paginacion, mensaje = 'Lista obtenida exitosamente') {
  const meta = {
    paginacion: {
      paginaActual: paginacion.pagina,
      elementosPorPagina: paginacion.limite,
      totalElementos: paginacion.total,
      totalPaginas: Math.ceil(paginacion.total / paginacion.limite),
      tieneAnterior: paginacion.pagina > 1,
      tieneSiguiente: paginacion.pagina < Math.ceil(paginacion.total / paginacion.limite)
    }
  };
  
  enviarRespuesta(res, datos, mensaje, 200, meta);
}

/**
 * Envía error de recurso no encontrado
 * @param {object} res - Response de Express
 * @param {string} recurso - Nombre del recurso no encontrado
 */
function enviarNoEncontrado(res, recurso = 'Recurso') {
  enviarError(res, `${recurso} no encontrado`, 404, 'NOT_FOUND');
}

/**
 * Envía error de acceso no autorizado
 * @param {object} res - Response de Express
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarNoAutorizado(res, mensaje = 'Acceso no autorizado') {
  enviarError(res, mensaje, 401, 'UNAUTHORIZED');
}

/**
 * Envía error de permisos insuficientes
 * @param {object} res - Response de Express
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarProhibido(res, mensaje = 'No tienes permisos para realizar esta acción') {
  enviarError(res, mensaje, 403, 'FORBIDDEN');
}

/**
 * Envía error de conflicto (recurso ya existe)
 * @param {object} res - Response de Express
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarConflicto(res, mensaje = 'El recurso ya existe') {
  enviarError(res, mensaje, 409, 'CONFLICT');
}

/**
 * Envía error de validación con detalles
 * @param {object} res - Response de Express
 * @param {array} errores - Array de errores de validación
 * @param {string} mensaje - Mensaje personalizado (opcional)
 */
function enviarErrorValidacion(res, errores, mensaje = 'Datos de entrada inválidos') {
  enviarError(res, mensaje, 400, 'VALIDATION_ERROR', { errores });
}

export {
  enviarRespuesta,
  enviarError,
  enviarCreado,
  enviarActualizado,
  enviarEliminado,
  enviarListaPaginada,
  enviarNoEncontrado,
  enviarNoAutorizado,
  enviarProhibido,
  enviarConflicto,
  enviarErrorValidacion
};