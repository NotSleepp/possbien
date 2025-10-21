/**
 * Categorías de errores para mejor clasificación y logging
 */
const CATEGORIAS_ERROR = {
  VALIDACION: 'VALIDACION',
  AUTENTICACION: 'AUTENTICACION',
  AUTORIZACION: 'AUTORIZACION',
  BASE_DATOS: 'BASE_DATOS',
  NEGOCIO: 'NEGOCIO',
  SISTEMA: 'SISTEMA',
  RED: 'RED'
};

/**
 * Determina la categoría del error basándose en el tipo y mensaje
 * @param {Error} error - El error a categorizar
 * @returns {string} La categoría del error
 */
function categorizarError(error) {
  if (error.name === 'ZodError' || error.message.includes('validation')) {
    return CATEGORIAS_ERROR.VALIDACION;
  }
  if (error.name === 'JsonWebTokenError' || error.message.includes('token')) {
    return CATEGORIAS_ERROR.AUTENTICACION;
  }
  if (error.message.includes('permission') || error.message.includes('unauthorized')) {
    return CATEGORIAS_ERROR.AUTORIZACION;
  }
  if (error.code && (error.code.startsWith('ER_') || error.code === 'ECONNREFUSED')) {
    return CATEGORIAS_ERROR.BASE_DATOS;
  }
  if (error.message.includes('no encontrado') || error.message.includes('not found')) {
    return CATEGORIAS_ERROR.NEGOCIO;
  }
  if (error.code && error.code.startsWith('E')) {
    return CATEGORIAS_ERROR.RED;
  }
  return CATEGORIAS_ERROR.SISTEMA;
}

/**
 * Genera un ID único para el error para tracking
 * @returns {string} ID único del error
 */
function generarErrorId() {
  return `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Crea un log estructurado del error
 * @param {Error} error - El error a loggear
 * @param {object} req - Request de Express
 * @param {string} errorId - ID único del error
 * @param {string} categoria - Categoría del error
 */
function logearError(error, req, errorId, categoria) {
  const logData = {
    errorId,
    categoria,
    timestamp: new Date().toISOString(),
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      empresaId: req.user?.empresaId
    },
    severity: error.status >= 500 ? 'ERROR' : 'WARNING'
  };

  if (logData.severity === 'ERROR') {
    console.error('🚨 ERROR CRÍTICO:', JSON.stringify(logData, null, 2));
  } else {
    console.warn('⚠️  WARNING:', JSON.stringify(logData, null, 2));
  }
}

/**
 * Middleware mejorado de manejo de errores con logging estructurado y categorización
 * @param {Error} err - Error capturado
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
function manejadorErrores(err, req, res, next) {
  const errorId = generarErrorId();
  const categoria = categorizarError(err);
  let status = err.status || err.statusCode || 500;
  
  // Log estructurado del error
  logearError(err, req, errorId, categoria);
  
  // Preparar respuesta según el tipo de error
  let mensaje = 'Error interno del servidor';
  let codigo = 'INTERNAL_SERVER_ERROR';

  // Detectar errores de duplicado de base de datos y responder 409
  const esConflictoBD = (
    err?.code === 'ER_DUP_ENTRY' ||
    err?.code === 'SQLITE_CONSTRAINT' ||
    err?.code === '23505' ||
    /UNIQUE|duplicate/i.test(err?.message || '')
  );
  if (esConflictoBD) {
    status = 409;
    mensaje = 'Ya existe un registro con esos datos';
    codigo = 'CONFLICT';
  } else {
    switch (categoria) {
      case CATEGORIAS_ERROR.VALIDACION:
        mensaje = 'Datos de entrada inválidos';
        codigo = 'VALIDATION_ERROR';
        break;
      case CATEGORIAS_ERROR.AUTENTICACION:
        mensaje = 'Error de autenticación';
        codigo = 'AUTHENTICATION_ERROR';
        break;
      case CATEGORIAS_ERROR.AUTORIZACION:
        mensaje = 'No tienes permisos para realizar esta acción';
        codigo = 'AUTHORIZATION_ERROR';
        break;
      case CATEGORIAS_ERROR.NEGOCIO:
        mensaje = err.message; // Los errores de negocio pueden mostrar el mensaje original
        codigo = 'BUSINESS_ERROR';
        break;
      case CATEGORIAS_ERROR.BASE_DATOS:
        mensaje = 'Error en la base de datos';
        codigo = 'DATABASE_ERROR';
        break;
      default:
        mensaje = status < 500 ? err.message : 'Error interno del servidor';
        codigo = 'INTERNAL_SERVER_ERROR';
    }
  }
  
  const respuesta = {
    exito: false,
    error: {
      codigo,
      mensaje,
      errorId,
      categoria,
      timestamp: new Date().toISOString()
    }
  };
  
  // Solo incluir detalles técnicos en desarrollo
  if (process.env.NODE_ENV === 'development') {
    respuesta.error.detalles = {
      stack: err.stack,
      originalMessage: err.message,
      code: err.code
    };
  }
  
  res.status(status).json(respuesta);
}

export default manejadorErrores;
export { CATEGORIAS_ERROR, categorizarError };