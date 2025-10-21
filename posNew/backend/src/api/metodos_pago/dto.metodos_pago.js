import { z } from 'zod';

export const esquemaCrearMetodoPago = z.object({
  idEmpresa: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  imagen: z.string().optional(),
  requiereReferencia: z.boolean().optional().default(false),
  activo: z.boolean().optional().default(true)
});

export const esquemaActualizarMetodoPago = z.object({
  id: z.number().int(),
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  imagen: z.string().optional(),
  requiereReferencia: z.boolean().optional(),
  activo: z.boolean().optional()
});