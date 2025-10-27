/**
 * Clases de error personalizadas y utilidades para manejo de errores
 */

/**
 * Error de validación de datos
 */
export class ValidationError extends Error {
  constructor(message, field = null, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
    this.statusCode = 400;
  }
}

/**
 * Error de restricción de unicidad (clave duplicada)
 */
export class UniqueConstraintError extends Error {
  constructor(field, value) {
    super(`El valor '${value}' ya existe para el campo ${field}`);
    this.name = 'UniqueConstraintError';
    this.field = field;
    this.value = value;
    this.code = 'UNIQUE_CONSTRAINT';
    this.statusCode = 409;
  }
}

/**
 * Error de dependencias (no se puede eliminar por registros relacionados)
 */
export class DependencyError extends Error {
  constructor(resource, dependencies) {
    super(`No se puede eliminar ${resource} porque tiene dependencias`);
    this.name = 'DependencyError';
    this.resource = resource;
    this.dependencies = dependencies;
    this.code = 'DEPENDENCY_ERROR';
    this.statusCode = 409;
  }
}

/**
 * Transforma errores de base de datos en errores amigables para el usuario
 * @param {Error} error - Error original de la base de datos
 * @returns {Error} Error transformado
 */
export const transformDatabaseError = (error) => {
  // Error de clave duplicada (ER_DUP_ENTRY)
  if (error.code === 'ER_DUP_ENTRY') {
    const match = error.sqlMessage?.match(/for key '(.+?)'/);
    const key = match ? match[1] : 'unknown';
    
    // Extraer el campo del nombre de la clave
    let field = key.split('_').pop();
    
    // Casos especiales de nombres de claves
    if (field === 'empresa' || field === 'metodo' || field === 'comp' || field === 'cat' || field === 'rol') {
      field = key.split('_')[1]; // Tomar el segundo elemento
    }
    
    // Mapeo de nombres de campos técnicos a nombres amigables
    const fieldNames = {
      'codigo': 'código',
      'nombre': 'nombre',
      'username': 'nombre de usuario',
      'email': 'correo electrónico',
      'serie': 'serie'
    };
    
    const friendlyField = fieldNames[field] || field;
    
    return new UniqueConstraintError(friendlyField, 'el valor proporcionado');
  }
  
  // Error de clave foránea (ER_ROW_IS_REFERENCED_2)
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return new DependencyError('el registro', { count: 'registros relacionados' });
  }
  
  // Error de validación de Zod
  if (error.name === 'ZodError') {
    const firstError = error.errors[0];
    return new ValidationError(
      firstError.message,
      firstError.path.join('.'),
      'VALIDATION_ERROR'
    );
  }
  
  // Retornar el error original si no se puede transformar
  return error;
};

/**
 * Middleware de manejo de errores para Express
 * Debe ser el último middleware en la cadena
 */
export const errorMiddleware = (err, req, res, next) => {
  // Transformar error de base de datos si es necesario
  const transformedError = transformDatabaseError(err);
  
  // Determinar código de estado HTTP
  const statusCode = transformedError.statusCode || 500;
  
  // Construir respuesta de error
  const response = {
    error: {
      message: transformedError.message,
      code: transformedError.code || 'INTERNAL_ERROR'
    }
  };
  
  // Agregar campo si está disponible (para errores de validación)
  if (transformedError.field) {
    response.error.field = transformedError.field;
  }
  
  // Agregar dependencias si están disponibles
  if (transformedError.dependencies) {
    response.error.dependencies = transformedError.dependencies;
  }
  
  // En desarrollo, incluir stack trace y error original
  if (process.env.NODE_ENV === 'development') {
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('❌ ERROR CAPTURADO:');
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.error('Tipo:', transformedError.name);
    console.error('Mensaje:', transformedError.message);
    console.error('Código:', transformedError.code);
    if (transformedError.field) {
      console.error('Campo:', transformedError.field);
    }
    console.error('Stack:', err.stack);
    console.error('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    response.error.stack = err.stack;
    response.error.originalError = {
      name: err.name,
      message: err.message,
      code: err.code
    };
  }
  
  // Enviar respuesta
  res.status(statusCode).json(response);
};
