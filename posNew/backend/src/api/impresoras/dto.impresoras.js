import { z } from 'zod';

export const esquemaCrearImpresora = z.object({
  idEmpresa: z.number().int(),
  idSucursal: z.number().int(),
  idCaja: z.number().int().optional(),
  name: z.string().min(1),
  nombre: z.string().optional(),
  tipo: z.enum(['termica','matricial','laser']).default('termica'),
  puerto: z.string().optional(),
  pcName: z.string().optional(),
  ipLocal: z.string().optional(),
  state: z.boolean().optional().default(true),
  configuracion: z.any().optional()
});

export const esquemaActualizarImpresora = z.object({
  id: z.number().int(),
  name: z.string().min(1).optional(),
  nombre: z.string().optional(),
  tipo: z.enum(['termica','matricial','laser']).optional(),
  puerto: z.string().optional(),
  pcName: z.string().optional(),
  ipLocal: z.string().optional(),
  state: z.boolean().optional(),
  configuracion: z.any().optional()
});