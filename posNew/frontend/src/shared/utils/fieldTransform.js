/**
 * Utilidades para transformar nombres de campos entre camelCase y snake_case
 * Necesario para mantener consistencia entre frontend (camelCase) y backend/DB (snake_case)
 */

/**
 * Transforma campos de camelCase a snake_case
 * @param {*} obj - Objeto, array o valor primitivo a transformar
 * @returns {*} Objeto transformado con campos en snake_case
 * 
 * @example
 * toSnakeCase({ idEmpresa: 1, nombreCompleto: 'Juan' })
 * // Returns: { id_empresa: 1, nombre_completo: 'Juan' }
 */
export const toSnakeCase = (obj) => {
  // Si no es un objeto o es null, retornar tal cual
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Si es un array, transformar cada elemento
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  
  // Si es un objeto, transformar cada clave
  return Object.keys(obj).reduce((acc, key) => {
    // Convertir camelCase a snake_case
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    
    // Transformar recursivamente el valor
    acc[snakeKey] = toSnakeCase(obj[key]);
    
    return acc;
  }, {});
};

/**
 * Transforma campos de snake_case a camelCase
 * @param {*} obj - Objeto, array o valor primitivo a transformar
 * @returns {*} Objeto transformado con campos en camelCase
 * 
 * @example
 * toCamelCase({ id_empresa: 1, nombre_completo: 'Juan' })
 * // Returns: { idEmpresa: 1, nombreCompleto: 'Juan' }
 */
export const toCamelCase = (obj) => {
  // Si no es un objeto o es null, retornar tal cual
  if (!obj || typeof obj !== 'object') {
    return obj;
  }
  
  // Si es un array, transformar cada elemento
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  
  // Si es un objeto, transformar cada clave
  return Object.keys(obj).reduce((acc, key) => {
    // Convertir snake_case a camelCase
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    
    // Transformar recursivamente el valor
    acc[camelKey] = toCamelCase(obj[key]);
    
    return acc;
  }, {});
};
