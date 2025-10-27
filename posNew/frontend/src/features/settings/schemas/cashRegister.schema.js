import { z } from 'zod';

/**
 * Esquema de validación para cajas registradoras
 */
export const cashRegisterSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  idSucursal: z.number().int().positive('Debe seleccionar una sucursal'),
  
  codigo: z.string()
    .max(10, 'El código no puede superar 10 caracteres')
    .optional(),
  
  nombre: z.string()
    .max(100, 'El nombre no puede superar 100 caracteres')
    .optional(),
  
  descripcion: z.string()
    .max(500, 'La descripción no puede superar 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  saldoInicial: z.number()
    .optional(),
  
  print: z.boolean().optional(),
});

export const validateCashRegister = (data) => {
  try {
    console.log('[cashRegister.schema] Validating data:', data);
    cashRegisterSchema.parse(data);
    console.log('[cashRegister.schema] Validation SUCCESS');
    return { success: true, errors: {} };
  } catch (error) {
    console.log('[cashRegister.schema] Validation error:', error);
    console.log('[cashRegister.schema] Data being validated:', data);
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    console.log('[cashRegister.schema] Parsed errors:', errors);
    return { success: false, errors };
  }
};
