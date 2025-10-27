import { z } from 'zod';

/**
 * Esquema de validación para impresoras
 */
export const printerSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  idSucursal: z.number().int().positive('Debe seleccionar una sucursal'),
  
  idCaja: z.number().int().positive().optional().nullable(),
  
  name: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede superar 255 caracteres'),
  
  tipo: z.enum(['termica', 'matricial', 'laser'], {
    errorMap: () => ({ message: 'Debe seleccionar un tipo válido' }),
  }),
  
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
    .or(z.literal('')),
  
  state: z.boolean().optional(),
  
  configuracion: z.string().optional().or(z.literal('')),
});

export const validatePrinter = (data) => {
  try {
    printerSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};
