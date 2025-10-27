import { z } from 'zod';

/**
 * Esquema de validación para categorías
 * Actualizado para coincidir con la estructura de la base de datos
 */
export const categorySchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  codigo: z.string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede superar 20 caracteres'),
  
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  
  descripcion: z.string()
    .max(1000, 'La descripción no puede superar 1000 caracteres')
    .optional()
    .or(z.literal('')),
  
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido (ej: #007bff)')
    .default('#007bff'),
  
  icono: z.string()
    .max(50, 'El ícono no puede superar 50 caracteres')
    .default('folder'),
  
  activo: z.boolean().default(true).optional(),
});

export const validateCategory = (data) => {
  try {
    categorySchema.parse(data);
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
