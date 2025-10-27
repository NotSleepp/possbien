import { z } from 'zod';

const destinos = z.enum(['VENTA', 'COMPRA', 'INTERNO']);

/**
 * Esquema para crear tipo de comprobante
 * Usa nombres snake_case para coincidir con la base de datos
 */
const esquemaCrearTipoComprobante = z.object({
  id_empresa: z.number().int().positive(),
  codigo: z.string().min(1, 'El código es requerido').max(10),
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  descripcion: z.string().max(1000).optional(),
  destino: destinos.default('VENTA'),
  activo: z.boolean().default(true).optional(),
});

/**
 * Esquema para actualizar tipo de comprobante
 * Todos los campos son opcionales excepto el ID
 */
const esquemaActualizarTipoComprobante = z.object({
  id: z.number().int().positive(),
  codigo: z.string().min(1).max(10).optional(),
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(1000).optional(),
  destino: destinos.optional(),
  activo: z.boolean().optional(),
});

export { esquemaCrearTipoComprobante, esquemaActualizarTipoComprobante };