import { z } from 'zod';

/**
 * Esquema de validación para impresoras
 * Actualizado para coincidir con la estructura de la base de datos
 */
export const printerSchema = z.object({
  // ID Empresa - convertir a número si viene como string
  idEmpresa: z.union([
    z.number().int().positive(),
    z.string().transform(val => {
      console.log('[printer.schema] Converting idEmpresa from string:', val);
      const num = Number(val);
      if (isNaN(num)) throw new Error('ID de empresa inválido');
      return num;
    })
  ]).refine(val => val > 0, { message: 'ID de empresa requerido' }),
  
  // ID Sucursal - convertir a número si viene como string
  idSucursal: z.union([
    z.number().int().positive(),
    z.string().transform(val => {
      console.log('[printer.schema] Converting idSucursal from string:', val);
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error('Debe seleccionar una sucursal');
      return num;
    })
  ]).refine(val => val > 0, { message: 'Debe seleccionar una sucursal' }),
  
  // ID Caja - puede ser null, undefined, string vacío, o número
  idCaja: z.union([
    z.number().int().positive(),
    z.null(),
    z.undefined(),
    z.literal(''),
    z.string().transform(val => {
      console.log('[printer.schema] Converting idCaja from string:', val);
      if (val === '' || val === 'null') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    })
  ]).optional().transform(val => {
    console.log('[printer.schema] Final idCaja value:', val);
    if (val === '' || val === undefined) return null;
    return val;
  }),
  
  // Nombre - requerido
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede superar 255 caracteres')
    .transform(val => {
      console.log('[printer.schema] name:', val);
      return val.trim();
    }),
  
  // Tipo - enum con default
  tipo: z.enum(['termica', 'matricial', 'laser'], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo válido' }),
  }).default('termica').transform(val => {
    console.log('[printer.schema] tipo:', val);
    return val;
  }),
  
  // Puerto - opcional, puede ser string vacío
  puerto: z.string()
    .max(50, 'El puerto no puede superar 50 caracteres')
    .optional()
    .or(z.literal(''))
    .transform(val => {
      console.log('[printer.schema] puerto:', val);
      return val || '';
    }),
  
  // PC Name - opcional
  pcName: z.string()
    .max(255, 'El nombre del PC no puede superar 255 caracteres')
    .optional()
    .or(z.literal(''))
    .transform(val => {
      console.log('[printer.schema] pcName:', val);
      return val || '';
    }),
  
  // IP Local - opcional, puede ser cualquier string o vacío
  ipLocal: z.string()
    .max(45, 'La IP no puede superar 45 caracteres')
    .optional()
    .or(z.literal(''))
    .transform(val => {
      console.log('[printer.schema] ipLocal value:', val);
      // Si está vacío, devolver string vacío
      if (!val || val === '') {
        console.log('[printer.schema] ipLocal is empty, returning empty string');
        return '';
      }
      // Si tiene valor, validar que sea IP válida (opcional)
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      if (ipv4Regex.test(val)) {
        // Es formato IP, validar octetos
        const octets = val.split('.');
        const valid = octets.every(octet => {
          const num = parseInt(octet, 10);
          return num >= 0 && num <= 255;
        });
        if (!valid) {
          console.log('[printer.schema] ipLocal has invalid octets');
        } else {
          console.log('[printer.schema] ipLocal is valid IP');
        }
      } else {
        console.log('[printer.schema] ipLocal is not IP format, accepting as-is');
      }
      console.log('[printer.schema] Final ipLocal:', val);
      return val;
    }),
  
  // State - convertir a boolean
  state: z.union([
    z.boolean(),
    z.number().transform(val => {
      console.log('[printer.schema] Converting state from number:', val);
      return Boolean(val);
    }),
    z.string().transform(val => {
      console.log('[printer.schema] Converting state from string:', val);
      return val === 'true' || val === '1';
    })
  ]).default(true).transform(val => {
    console.log('[printer.schema] Final state:', val);
    return Boolean(val);
  }),
  
  // Configuración - puede ser objeto, string JSON, o null
  configuracion: z.union([
    z.record(z.any()),
    z.string().transform((str) => {
      console.log('[printer.schema] Converting configuracion from string:', str);
      if (!str || str === '') return null;
      try {
        const parsed = JSON.parse(str);
        console.log('[printer.schema] Parsed configuracion:', parsed);
        return parsed;
      } catch (e) {
        console.log('[printer.schema] Failed to parse configuracion, returning null');
        return null;
      }
    }),
    z.null(),
    z.undefined()
  ]).optional().transform(val => {
    console.log('[printer.schema] Final configuracion:', val);
    return val === undefined ? null : val;
  }),
  
  // Activo - opcional
  activo: z.boolean().default(true).optional(),
});

export const validatePrinter = (data) => {
  console.log('[printer.schema] ========== VALIDATION STARTED ==========');
  console.log('[printer.schema] Input data:', JSON.stringify(data, null, 2));
  console.log('[printer.schema] Data types:', {
    idEmpresa: typeof data.idEmpresa,
    idSucursal: typeof data.idSucursal,
    idCaja: typeof data.idCaja,
    name: typeof data.name,
    tipo: typeof data.tipo,
    puerto: typeof data.puerto,
    pcName: typeof data.pcName,
    ipLocal: typeof data.ipLocal,
    state: typeof data.state,
    configuracion: typeof data.configuracion,
  });
  
  try {
    const validated = printerSchema.parse(data);
    console.log('[printer.schema] ========== VALIDATION SUCCESS ==========');
    console.log('[printer.schema] Validated data:', JSON.stringify(validated, null, 2));
    return { success: true, data: validated, errors: {} };
  } catch (error) {
    console.error('[printer.schema] ========== VALIDATION FAILED ==========');
    console.error('[printer.schema] Error object:', error);
    console.error('[printer.schema] Error name:', error.name);
    console.error('[printer.schema] Error message:', error.message);
    
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      console.error('[printer.schema] Zod errors array:', error.errors);
      error.errors.forEach((err, index) => {
        console.error(`[printer.schema] Error ${index + 1}:`, {
          path: err.path,
          message: err.message,
          code: err.code,
          fullPath: err.path.join('.'),
        });
        // Usar el primer elemento del path como key del error
        const fieldName = err.path[0];
        if (fieldName) {
          errors[fieldName] = err.message;
          console.error(`[printer.schema] Added error for field "${fieldName}":`, err.message);
        } else {
          console.error(`[printer.schema] WARNING: Error without path!`, err);
        }
      });
    } else {
      console.error('[printer.schema] ERROR: No errors array found in error object!');
    }
    
    console.error('[printer.schema] Final errors object:', errors);
    console.error('[printer.schema] Number of errors:', Object.keys(errors).length);
    console.error('[printer.schema] ========== END VALIDATION ==========');
    return { success: false, errors };
  }
};
