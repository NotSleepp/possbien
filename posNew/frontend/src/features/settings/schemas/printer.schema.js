import { z } from 'zod';

/**
 * Esquema de validación para impresoras
 * Actualizado para coincidir con la estructura de la base de datos
 */
export const printerSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  idSucursal: z.number().int().positive('Debe seleccionar una sucursal'),
  
  idCaja: z.number().int().positive().nullable().optional(),
  
  name: z.string()
    .min(1, 'El nombre es requerido')
    .max(255, 'El nombre no puede superar 255 caracteres'),
  
  tipo: z.enum(['termica', 'matricial', 'laser'], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo válido' }),
  }).default('termica'),
  
  puerto: z.string()
    .max(50, 'El puerto no puede superar 50 caracteres')
    .optional()
    .or(z.literal('')),
  
  pcName: z.string()
    .max(255, 'El nombre del PC no puede superar 255 caracteres')
    .optional()
    .or(z.literal('')),
  
  ipLocal: z.string()
    .max(45, 'La IP no puede superar 45 caracteres')
    .optional()
    .or(z.literal(''))
    .refine(
      (val) => {
        if (!val || val === '') return true;
        // Validar formato IPv4
        const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
        if (!ipv4Regex.test(val)) return false;
        // Validar que cada octeto esté entre 0 y 255
        const octets = val.split('.');
        return octets.every(octet => {
          const num = parseInt(octet, 10);
          return num >= 0 && num <= 255;
        });
      },
      { message: 'Debe ser una dirección IP válida (ej: 192.168.1.1)' }
    ),
  
  state: z.boolean().default(true),
  
  configuracion: z.record(z.any()).nullable().optional()
    .or(z.string().transform((str) => {
      if (!str || str === '') return null;
      try {
        return JSON.parse(str);
      } catch {
        return null;
      }
    })),
  
  activo: z.boolean().default(true).optional(),
});

export const validatePrinter = (data) => {
  console.log('[printer.schema] Validating data:', data);
  try {
    printerSchema.parse(data);
    console.log('[printer.schema] Validation SUCCESS');
    return { success: true, errors: {} };
  } catch (error) {
    console.error('[printer.schema] Validation error:', error);
    console.error('[printer.schema] Data being validated:', data);
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    console.error('[printer.schema] Parsed errors:', errors);
    return { success: false, errors };
  }
};
