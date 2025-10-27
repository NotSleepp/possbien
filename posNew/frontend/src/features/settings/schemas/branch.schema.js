import { z } from 'zod';

/**
 * Esquema de validación para sucursales
 */
export const branchSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  codigo: z.string()
    .max(10, 'El código no puede superar 10 caracteres')
    .optional(),
  
  nombre: z.string()
    .max(100, 'El nombre no puede superar 100 caracteres')
    .optional(),
  
  direccion: z.string()
    .max(500, 'La dirección no puede superar 500 caracteres')
    .optional(),
  
  direccion_fiscal: z.string()
    .max(500, 'La dirección fiscal no puede superar 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefono: z.string()
    .max(20, 'El teléfono no puede superar 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  email: z.string()
    .email('Debe ser un correo electrónico válido')
    .max(100, 'El correo no puede superar 100 caracteres')
    .optional()
    .or(z.literal('')),
});

export const validateBranch = (data) => {
  try {
    branchSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    return { success: false, errors };
  }
};
