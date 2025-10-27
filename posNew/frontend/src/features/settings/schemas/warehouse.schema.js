import { z } from 'zod';

/**
 * Esquema de validación para almacenes
 */
export const warehouseSchema = z.object({
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
  
  default: z.boolean().optional(),
});

export const validateWarehouse = (data) => {
  try {
    console.log('[warehouse.schema] Validating data:', data);
    warehouseSchema.parse(data);
    console.log('[warehouse.schema] Validation SUCCESS');
    return { success: true, errors: {} };
  } catch (error) {
    console.log('[warehouse.schema] Validation error:', error);
    console.log('[warehouse.schema] Data being validated:', data);
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    console.log('[warehouse.schema] Parsed errors:', errors);
    return { success: false, errors };
  }
};
