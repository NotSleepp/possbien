import { z } from 'zod';

/**
 * Esquema base de validación para usuarios
 * Actualizado para coincidir con la estructura de la base de datos
 */
const userBaseSchema = z.object({
  // Coerción tolerante: los selects entregan strings, convertimos a number
  idEmpresa: z.preprocess((v) => {
    if (typeof v === 'string' && v.trim() !== '') return Number(v);
    if (typeof v === 'number') return v;
    return v;
  }, z.number().int().positive('ID de empresa requerido')),
  
  idRol: z.preprocess((v) => {
    if (typeof v === 'string' && v.trim() !== '') return Number(v);
    if (typeof v === 'number') return v;
    return v;
  }, z.number().int().positive('Debe seleccionar un rol')),
  
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
  
  idTipodocumento: z.preprocess((v) => {
    if (v === '' || v === undefined) return undefined;
    if (v === null) return null;
    if (typeof v === 'string' && v.trim() !== '') return Number(v);
    if (typeof v === 'number') return v;
    return v;
  }, z.number().int().positive().nullable().optional()),
  
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
  console.log('[user.schema] ================= validateUser START =================');
  console.log('[user.schema] isCreate:', isCreate);
  try {
    const schema = isCreate ? createUserSchema : updateUserSchema;
    console.log('[user.schema] Input data:', data);
    const validated = schema.parse(data);
    console.log('[user.schema] Validation SUCCESS. Output:', validated);
    console.log('[user.schema] ================= validateUser END (success) =================');
    return { success: true, errors: {} };
  } catch (error) {
    console.error('[user.schema] Validation ERROR:', error);
    const errors = {};
    const issues = error?.issues || error?.errors || [];
    if (Array.isArray(issues)) {
      issues.forEach((issue) => {
        const path = Array.isArray(issue.path) ? issue.path.join('.') : issue.path;
        console.error('[user.schema] -> issue', {
          code: issue.code,
          path,
          message: issue.message,
          expected: issue.expected,
          received: issue.received,
        });
        const field = Array.isArray(issue.path) ? issue.path[0] : issue.path;
        if (field) {
          // Acumular múltiples mensajes por campo si existen
          errors[field] = errors[field]
            ? `${errors[field]}; ${issue.message}`
            : issue.message;
        }
      });
    }
    console.log('[user.schema] Parsed errors map:', errors);
    console.log('[user.schema] ================= validateUser END (error) =================');
    return { success: false, errors };
  }
};
