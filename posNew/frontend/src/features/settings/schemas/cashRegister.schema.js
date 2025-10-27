import { z } from 'zod';

/**
 * Esquema de validación para cajas registradoras
 */
export const cashRegisterSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  idSucursal: z.number().int().positive('Debe seleccionar una sucursal'),
  
  codigo: z.string()
    .min(1, 'El código es requerido')
    .max(10, 'El código no puede superar 10 caracteres')
    .regex(/^[A-Z0-9]+$/, 'El código solo debe contener letras mayúsculas y números'),
  
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  
  descripcion: z.string()
    .max(500, 'La descripción no puede superar 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  montoInicial: z.number()
    .min(0, 'El monto inicial no puede ser negativo')
    .optional(),
  
  print: z.boolean().optional(),
});

export const validateCashRegister = (data) => {
  try {
    cashRegisterSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};
