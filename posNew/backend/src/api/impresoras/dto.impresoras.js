import { z } from 'zod';

/**
 * Esquema para crear impresora
 * Usa nombres snake_case para coincidir con la base de datos
 */
export const esquemaCrearImpresora = z.object({
  id_empresa: z.number().int().positive(),
  id_sucursal: z.number().int().positive(),
  id_caja: z.number().int().positive().nullable().optional(),
  name: z.string().min(1, 'El nombre es requerido').max(255),
  tipo: z.enum(['termica', 'matricial', 'laser']).default('termica'),
  puerto: z.string().max(50).optional(),
  pc_name: z.string().max(255).optional(),
  ip_local: z.string().max(45).optional(),
  state: z.boolean().default(true),
  configuracion: z.record(z.any()).nullable().optional(),
  activo: z.boolean().default(true).optional()
});

/**
 * Esquema para actualizar impresora
 * Todos los campos son opcionales excepto el ID
 */
export const esquemaActualizarImpresora = z.object({
  id: z.number().int().positive(),
  id_sucursal: z.number().int().positive().optional(),
  id_caja: z.number().int().positive().nullable().optional(),
  name: z.string().min(1).max(255).optional(),
  tipo: z.enum(['termica', 'matricial', 'laser']).optional(),
  puerto: z.string().max(50).optional(),
  pc_name: z.string().max(255).optional(),
  ip_local: z.string().max(45).optional(),
  state: z.boolean().optional(),
  configuracion: z.record(z.any()).nullable().optional(),
  activo: z.boolean().optional()
});