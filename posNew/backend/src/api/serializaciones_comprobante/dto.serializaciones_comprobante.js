import { z } from 'zod';

/**
 * Esquema para crear serialización de comprobante
 * Usa nombres snake_case para coincidir con la base de datos
 */
const esquemaCrearSerializacion = z.object({
  id_empresa: z.number().int().positive(),
  id_sucursal: z.number().int().positive(),
  id_tipo_comprobante: z.number().int().positive(),
  serie: z.string().min(1, 'La serie es requerida').max(10),
  numero_inicial: z.number().int().positive().default(1),
  numero_actual: z.number().int().positive().default(1),
  numero_final: z.number().int().positive().nullable().optional(),
  cantidad_numeros: z.number().int().positive().default(1000),
  por_default: z.boolean().default(false),
  activo: z.boolean().default(true).optional(),
}).refine(
  (data) => !data.numero_final || data.numero_actual <= data.numero_final,
  { 
    message: 'El número actual no puede ser mayor al número final', 
    path: ['numero_actual'] 
  }
).refine(
  (data) => data.numero_actual >= data.numero_inicial,
  { 
    message: 'El número actual no puede ser menor al número inicial', 
    path: ['numero_actual'] 
  }
);

/**
 * Esquema para actualizar serialización de comprobante
 * Todos los campos son opcionales excepto el ID
 */
const esquemaActualizarSerializacion = z.object({
  id: z.number().int().positive(),
  id_sucursal: z.number().int().positive().optional(),
  id_tipo_comprobante: z.number().int().positive().optional(),
  serie: z.string().min(1).max(10).optional(),
  numero_inicial: z.number().int().positive().optional(),
  numero_actual: z.number().int().positive().optional(),
  numero_final: z.number().int().positive().nullable().optional(),
  cantidad_numeros: z.number().int().positive().optional(),
  por_default: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export { esquemaCrearSerializacion, esquemaActualizarSerializacion };