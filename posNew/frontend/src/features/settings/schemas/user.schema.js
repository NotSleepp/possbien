import { z } from 'zod';

/**
 * Esquema base de validación para usuarios
 * Actualizado para coincidir con la estructura de la base de datos
 */
const userBaseSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  idRol: z.number().int().positive('Debe seleccionar un rol'),
  
  username: z.string()
    .min(3, 'El nombre de usuario debe tener al menos 3 caracteres')
    .max(50, 'El nombre de usuario no puede superar 50 caracteres'),
  
  nombres: z.string()
    .min(1, 'Los nombres son requeridos')
    .max(100, 'Los nombres no pueden superar 100 caracteres'),
  
  apellidos: z.string()
    .min(1, 'Los apellidos son requeridos')
    .max(100, 'Los apellidos no pueden superar 100 caracteres'),
  
  email: z.string()
    .email('Debe ser un email válido')
    .max(100, 'El email no puede superar 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefono: z.string()
    .max(20, 'El teléfono no puede superar 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  idTipodocumento: z.number()
    .int()
    .positive()
    .nullable()
    .optional(),
  
  nroDoc: z.string()
    .max(20, 'El número de documento no puede superar 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  tema: z.enum(['light', 'dark']).default('light'),
  
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
  
  activo: z.boolean().default(true).optional(),
});

/**
 * Esquema para crear usuario (requiere contraseña con validación de fortaleza)
 */
export const createUserSchema = userBaseSchema.extend({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede superar 255 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    ),
});

/**
 * Esquema para actualizar usuario (contraseña opcional)
 */
export const updateUserSchema = userBaseSchema.extend({
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255, 'La contraseña no puede superar 255 caracteres')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
    )
    .optional()
    .or(z.literal('')),
});

/**
 * Esquema general (para compatibilidad)
 */
export const userSchema = updateUserSchema;

export const validateUser = (data, isCreate = false) => {
  try {
    const schema = isCreate ? createUserSchema : updateUserSchema;
    schema.parse(data);
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
