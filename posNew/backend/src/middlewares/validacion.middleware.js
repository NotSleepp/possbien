import { ZodError } from 'zod';
import { enviarError } from '../utils/manejadorRespuestas.js';

/**
 * Middleware para validar datos usando esquemas Zod
 * @param {object} esquema - Esquema Zod para validación
 * @param {string} fuente - Fuente de los datos ('body', 'params', 'query')
 * @returns {function} Middleware de Express
 */
export function validarEsquema(esquema, fuente = 'body') {
  return (req, res, next) => {
    try {
      let datos;
      
      switch (fuente) {
        case 'body':
          datos = req.body;
          break;
        case 'params':
          datos = req.params;
          break;
        case 'query':
          datos = req.query;
          break;
        default:
          datos = req.body;
      }
      
      // Validar los datos con el esquema
      const datosValidados = esquema.parse(datos);
      
      // Reemplazar los datos originales con los validados
      if (fuente === 'body') {
        req.body = datosValidados;
      } else if (fuente === 'params') {
        req.params = datosValidados;
      } else if (fuente === 'query') {
        req.query = datosValidados;
      }
      
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const erroresFormateados = error.errors.map(err => ({
          campo: err.path.join('.'),
          mensaje: err.message,
          valorRecibido: err.received
        }));
        
        return enviarError(
          res,
          'Datos de entrada inválidos',
          400,
          'VALIDATION_ERROR',
          { errores: erroresFormateados }
        );
      }
      
      return enviarError(res, 'Error de validación', 400, 'VALIDATION_ERROR');
    }
  };
}

/**
 * Middleware para validar que los IDs sean números válidos
 * @param {string[]} campos - Array de nombres de campos a validar
 * @returns {function} Middleware de Express
 */
export function validarIds(campos = ['id']) {
  return (req, res, next) => {
    try {
      for (const campo of campos) {
        const valor = req.params[campo];
        
        if (valor !== undefined) {
          const numeroId = parseInt(valor, 10);
          
          if (isNaN(numeroId) || numeroId <= 0) {
            return enviarError(
              res,
              `El campo '${campo}' debe ser un número entero positivo`,
              400,
              'VALIDATION_ERROR'
            );
          }
          
          // Convertir a número para uso posterior
          req.params[campo] = numeroId;
        }
      }
      
      next();
    } catch (error) {
      return enviarError(res, 'Error de validación de IDs', 400, 'VALIDATION_ERROR');
    }
  };
}

/**
 * Middleware para sanitizar datos de entrada
 * Remueve campos no deseados y aplica transformaciones básicas
 * @param {string[]} camposPermitidos - Array de campos permitidos
 * @returns {function} Middleware de Express
 */
export function sanitizarDatos(camposPermitidos) {
  return (req, res, next) => {
    try {
      if (req.body && typeof req.body === 'object') {
        const datosSanitizados = {};
        
        for (const campo of camposPermitidos) {
          if (req.body.hasOwnProperty(campo)) {
            let valor = req.body[campo];
            
            // Sanitización básica para strings
            if (typeof valor === 'string') {
              valor = valor.trim();
              
              // Remover caracteres peligrosos básicos
              valor = valor.replace(/[<>"']/g, '');
            }
            
            datosSanitizados[campo] = valor;
          }
        }
        
        req.body = datosSanitizados;
      }
      
      next();
    } catch (error) {
      return enviarError(res, 'Error de sanitización', 400, 'VALIDATION_ERROR');
    }
  };
}

/**
 * Middleware para validar paginación
 * @param {object} req - Request de Express
 * @param {object} res - Response de Express
 * @param {function} next - Función next de Express
 */
export function validarPaginacion(req, res, next) {
  try {
    const { pagina = 1, limite = 10 } = req.query;
    
    const paginaNum = parseInt(pagina, 10);
    const limiteNum = parseInt(limite, 10);
    
    if (isNaN(paginaNum) || paginaNum < 1) {
      return enviarError(
        res,
        'El número de página debe ser un entero positivo',
        400,
        'VALIDATION_ERROR'
      );
    }
    
    if (isNaN(limiteNum) || limiteNum < 1 || limiteNum > 100) {
      return enviarError(
        res,
        'El límite debe ser un entero entre 1 y 100',
        400,
        'VALIDATION_ERROR'
      );
    }
    
    // Agregar valores validados al request
    req.paginacion = {
      pagina: paginaNum,
      limite: limiteNum,
      offset: (paginaNum - 1) * limiteNum
    };
    
    next();
  } catch (error) {
    return enviarError(res, 'Error de validación de paginación', 400, 'VALIDATION_ERROR');
  }
}

/**
 * Middleware para validar fechas
 * @param {string[]} campos - Array de nombres de campos de fecha a validar
 * @returns {function} Middleware de Express
 */
export function validarFechas(campos) {
  return (req, res, next) => {
    try {
      const fuentes = [req.body, req.query, req.params];
      
      for (const fuente of fuentes) {
        if (fuente && typeof fuente === 'object') {
          for (const campo of campos) {
            if (fuente[campo]) {
              const fecha = new Date(fuente[campo]);
              
              if (isNaN(fecha.getTime())) {
                return enviarError(
                  res,
                  `El campo '${campo}' debe ser una fecha válida`,
                  400,
                  'VALIDATION_ERROR'
                );
              }
              
              // Convertir a formato ISO para consistencia
              fuente[campo] = fecha.toISOString();
            }
          }
        }
      }
      
      next();
    } catch (error) {
      return enviarError(res, 'Error de validación de fechas', 400, 'VALIDATION_ERROR');
    }
  };
}

export default {
  validarEsquema,
  validarIds,
  sanitizarDatos,
  validarPaginacion,
  validarFechas
};