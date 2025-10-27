import { z } from 'zod';

/**
 * Esquema de validación para sucursales
 */
export const branchSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  codigo: z.string()
    .min(1, 'El código es requerido')
    .max(10, 'El código no puede superar 10 caracteres')
    .regex(/^[A-Z0-9]+$/, 'El código solo debe contener letras mayúsculas y números'),
  
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  
  direccion: z.string()
    .min(5, 'La dirección debe tener al menos 5 caracteres')
    .max(500, 'La dirección no puede superar 500 caracteres'),
  
  direccion_fiscal: z.string()
    .max(500, 'La dirección fiscal no puede superar 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefono: z.string()
    .max(20, 'El teléfono no puede superar 20 caracteres')
    .regex(/^[0-9+\-\s()]*$/, 'El teléfono solo debe contener números y símbolos válidos')
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
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};
