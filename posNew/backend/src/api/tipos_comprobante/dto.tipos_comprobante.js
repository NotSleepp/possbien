import { z } from 'zod';

const destinos = z.enum(['VENTA', 'COMPRA', 'INTERNO']);

const esquemaCrearTipoComprobante = z.object({
  idEmpresa: z.number().int(),
  codigo: z.string().max(10),
  nombre: z.string().max(100),
  descripcion: z.string().optional(),
  destino: destinos.default('VENTA').optional(),
  activo: z.boolean().default(true).optional(),
});

const esquemaActualizarTipoComprobante = z.object({
  id: z.number().int(),
  idEmpresa: z.number().int().optional(),
  codigo: z.string().max(10).optional(),
  nombre: z.string().max(100).optional(),
  descripcion: z.string().optional(),
  destino: destinos.optional(),
  activo: z.boolean().optional(),
});

export { esquemaCrearTipoComprobante, esquemaActualizarTipoComprobante };