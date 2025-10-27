import z from 'zod';

/**
 * Esquema para crear rol
 * Usa nombres snake_case para coincidir con la base de datos
 * Nota: El campo 'codigo' no existe en la tabla roles
 */
const esquemaCrearRol = z.object({
  id_empresa: z.number().int().positive(),
  nombre: z.string().min(1, 'El nombre es requerido').max(50),
  descripcion: z.string().max(1000).optional(),
  activo: z.boolean().default(true).optional(),
});

/**
 * Esquema para actualizar rol
 * Todos los campos son opcionales excepto el ID
 */
const esquemaActualizarRol = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1).max(50).optional(),
  descripcion: z.string().max(1000).optional(),
  activo: z.boolean().optional(),
});

export { esquemaCrearRol, esquemaActualizarRol };