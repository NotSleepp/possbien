import { z } from 'zod';

const esquemaCrearSerializacion = z.object({
  idEmpresa: z.number().int(),
  idSucursal: z.number().int(),
  idTipoComprobante: z.number().int(),
  serie: z.string().max(10),
  numeroInicial: z.number().int().min(1).default(1),
  numeroActual: z.number().int().min(1).default(1),
  numeroFinal: z.number().int().optional(),
  cantidadNumeros: z.number().int().min(1).default(1000),
  porDefault: z.boolean().default(false).optional(),
  activo: z.boolean().default(true).optional(),
});

const esquemaActualizarSerializacion = z.object({
  id: z.number().int(),
  idEmpresa: z.number().int().optional(),
  idSucursal: z.number().int().optional(),
  idTipoComprobante: z.number().int().optional(),
  serie: z.string().max(10).optional(),
  numeroInicial: z.number().int().min(1).optional(),
  numeroActual: z.number().int().min(1).optional(),
  numeroFinal: z.number().int().optional(),
  cantidadNumeros: z.number().int().min(1).optional(),
  porDefault: z.boolean().optional(),
  activo: z.boolean().optional(),
});

export { esquemaCrearSerializacion, esquemaActualizarSerializacion };