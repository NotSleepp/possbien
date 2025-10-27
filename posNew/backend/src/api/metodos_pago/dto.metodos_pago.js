import { z } from 'zod';

/**
 * Esquema para crear método de pago
 * Usa nombres snake_case para coincidir con la base de datos
 */
export const esquemaCrearMetodoPago = z.object({
  id_empresa: z.number().int().positive(),
  codigo: z.string().min(1, 'El código es requerido').max(10),
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  descripcion: z.string().max(1000).optional(),
  imagen: z.string().max(255).optional(),
  requiere_referencia: z.boolean().default(false),
  activo: z.boolean().default(true).optional()
});

/**
 * Esquema para actualizar método de pago
 * Todos los campos son opcionales excepto el ID
 */
export const esquemaActualizarMetodoPago = z.object({
  id: z.number().int().positive(),
  codigo: z.string().min(1).max(10).optional(),
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(1000).optional(),
  imagen: z.string().max(255).optional(),
  requiere_referencia: z.boolean().optional(),
  activo: z.boolean().optional()
});