/**
 * Middleware para transformar automáticamente tipos de datos
 * Convierte strings numéricos a números y valores booleanos
 */

/**
 * Convierte strings que representan números a números
 */
const convertirStringANumero = (valor) => {
  // Si es null o undefined, mantenerlo como está
  if (valor === null || valor === undefined) {
    return valor;
  }
  if (typeof valor === 'string' && !isNaN(valor) && !isNaN(parseFloat(valor))) {
    return parseFloat(valor);
  }
  return valor;
};

/**
 * Convierte valores que representan booleanos a booleanos
 * Acepta: "true", "false", 1, 0, "1", "0"
 */
const convertirABooleano = (valor) => {
  if (typeof valor === 'string') {
    if (valor.toLowerCase() === 'true') return true;
    if (valor.toLowerCase() === 'false') return false;
    if (valor === '1') return true;
    if (valor === '0') return false;
  }
  if (typeof valor === 'number') {
    if (valor === 1) return true;
    if (valor === 0) return false;
  }
  return valor;
};

/**
 * Transforma recursivamente un objeto aplicando las conversiones
 */
const transformarObjeto = (obj, camposBooleanos = [], camposNumericos = []) => {
  if (obj === null || obj === undefined) return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(item => transformarObjeto(item, camposBooleanos, camposNumericos));
  }
  
  if (typeof obj === 'object') {
    const objetoTransformado = {};
    
    for (const [clave, valor] of Object.entries(obj)) {
      let valorTransformado = valor;
      
      // Si el valor es null o undefined, mantenerlo como está
      if (valor === null || valor === undefined) {
        valorTransformado = valor;
      }
      // Convertir campos booleanos
      else if (camposBooleanos.includes(clave)) {
        valorTransformado = convertirABooleano(valor);
      }
      // Convertir campos numéricos
      else if (camposNumericos.includes(clave)) {
        valorTransformado = convertirStringANumero(valor);
      }
      // Si es un objeto anidado, aplicar transformación recursiva
      else if (typeof valor === 'object' && valor !== null) {
        valorTransformado = transformarObjeto(valor, camposBooleanos, camposNumericos);
      }
      
      objetoTransformado[clave] = valorTransformado;
    }
    
    return objetoTransformado;
  }
  
  return obj;
};

/**
 * Middleware específico para métodos de pago
 */
export const transformarMetodosPago = (req, res, next) => {
  if (req.body) {
    const camposBooleanos = ['activo', 'requiereReferencia'];
    const camposNumericos = ['id', 'idEmpresa'];
    
    req.body = transformarObjeto(req.body, camposBooleanos, camposNumericos);
  }
  
  next();
};

/**
 * Middleware específico para impresoras
 */
export const transformarImpresoras = (req, res, next) => {
  console.log('[dataTransform.middleware] ========== transformarImpresoras START ==========');
  console.log('[dataTransform.middleware] Body BEFORE transformation:', JSON.stringify(req.body));
  
  if (req.body) {
    const camposBooleanos = ['state'];
    const camposNumericos = ['id', 'idEmpresa', 'idSucursal', 'idCaja'];
    
    req.body = transformarObjeto(req.body, camposBooleanos, camposNumericos);
    
    console.log('[dataTransform.middleware] Body AFTER transformation:', JSON.stringify(req.body));
  }
  
  console.log('[dataTransform.middleware] ========== transformarImpresoras END ==========');
  next();
};

/**
 * Middleware genérico para transformación de datos
 */
export const transformarDatos = (camposBooleanos = [], camposNumericos = []) => {
  return (req, res, next) => {
    if (req.body) {
      req.body = transformarObjeto(req.body, camposBooleanos, camposNumericos);
    }
    
    // También transformar query parameters si es necesario
    if (req.query) {
      req.query = transformarObjeto(req.query, camposBooleanos, camposNumericos);
    }
    
    next();
  };
};

/**
 * Middleware universal que intenta detectar automáticamente tipos
 */
export const autoTransformarDatos = (req, res, next) => {
  const transformarAutomaticamente = (obj) => {
    if (obj === null || obj === undefined) return obj;
    
    if (Array.isArray(obj)) {
      return obj.map(transformarAutomaticamente);
    }
    
    if (typeof obj === 'object') {
      const objetoTransformado = {};
      
      for (const [clave, valor] of Object.entries(obj)) {
        let valorTransformado = valor;
        
        // Auto-detectar y convertir números
        if (typeof valor === 'string' && !isNaN(valor) && !isNaN(parseFloat(valor))) {
          // Solo convertir si parece ser un número entero o decimal válido
          if (/^\d+$/.test(valor) || /^\d+\.\d+$/.test(valor)) {
            valorTransformado = parseFloat(valor);
          }
        }
        // Auto-detectar y convertir booleanos
        else if (typeof valor === 'string') {
          if (valor.toLowerCase() === 'true') valorTransformado = true;
          else if (valor.toLowerCase() === 'false') valorTransformado = false;
          else if (valor === '1') valorTransformado = true;
          else if (valor === '0') valorTransformado = false;
        }
        else if (typeof valor === 'number') {
          // Convertir 1/0 a boolean solo para campos que probablemente sean booleanos
          if ((valor === 1 || valor === 0) && 
              (clave.includes('activo') || clave.includes('state') || 
               clave.includes('enabled') || clave.includes('visible') ||
               clave.includes('requiere'))) {
            valorTransformado = valor === 1;
          }
        }
        // Transformar objetos anidados
        else if (typeof valor === 'object' && valor !== null) {
          valorTransformado = transformarAutomaticamente(valor);
        }
        
        objetoTransformado[clave] = valorTransformado;
      }
      
      return objetoTransformado;
    }
    
    return obj;
  };
  
  if (req.body) {
    req.body = transformarAutomaticamente(req.body);
  }
  
  if (req.query) {
    req.query = transformarAutomaticamente(req.query);
  }
  
  next();
};