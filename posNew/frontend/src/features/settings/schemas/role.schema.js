import { z } from 'zod';

/**
 * Esquema de validación para roles
 * Actualizado para coincidir con la estructura de la base de datos
 */
export const roleSchema = z.object({
  idEmpresa: z.coerce.number().int().positive('ID de empresa requerido'),

  nombre: z.string()
    .trim()
    .min(1, 'El nombre es requerido')
    .max(50, 'El nombre no puede superar 50 caracteres'),

  descripcion: z.string()
    .trim()
    .max(1000, 'La descripción no puede superar 1000 caracteres')
    .optional()
    .or(z.literal('')),

  activo: z.coerce.boolean().default(true).optional(),
});

export const validateRole = (data) => {
  try {
    console.log('[role.schema] validateRole - input data:', data);
    roleSchema.parse(data);
    console.log('[role.schema] validateRole - validation SUCCESS');
    return { success: true, errors: {} };
  } catch (error) {
    console.error('[role.schema] validateRole - validation ERROR:', error);
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    console.log('[role.schema] validateRole - parsed errors:', errors);
    return { success: false, errors };
  }
};
