import { z } from 'zod';

/**
 * Esquema para crear usuario
 * Usa nombres snake_case para coincidir con la base de datos
 */
const esquemaCrearUsuario = z.object({
  id_empresa: z.number().int().positive(),
  id_rol: z.number().int().positive(),
  username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(50),
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255),
  nombres: z.string().min(1, 'Los nombres son requeridos').max(100),
  apellidos: z.string().min(1, 'Los apellidos son requeridos').max(100),
  email: z.string().email('Debe ser un email válido').max(100).optional(),
  telefono: z.string().max(20).optional(),
  id_tipodocumento: z.number().int().positive().nullable().optional(),
  nro_doc: z.string().max(20).optional(),
  tema: z.enum(['light', 'dark']).default('light'),
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
  activo: z.boolean().default(true).optional(),
});

/**
 * Esquema para actualizar usuario
 * Todos los campos son opcionales excepto el ID
 * Password es opcional (solo se actualiza si se proporciona)
 */
const esquemaActualizarUsuario = z.object({
  id: z.number().int().positive(),
  id_rol: z.number().int().positive().optional(),
  username: z.string().min(3).max(50).optional(),
  password: z.string().min(8).max(255).optional(),
  nombres: z.string().min(1).max(100).optional(),
  apellidos: z.string().min(1).max(100).optional(),
  email: z.string().email().max(100).optional(),
  telefono: z.string().max(20).optional(),
  id_tipodocumento: z.number().int().positive().nullable().optional(),
  nro_doc: z.string().max(20).optional(),
  tema: z.enum(['light', 'dark']).optional(),
  estado: z.enum(['ACTIVO', 'INACTIVO']).optional(),
  activo: z.boolean().optional(),
});

export { esquemaCrearUsuario, esquemaActualizarUsuario };