import { z } from 'zod';

const esquemaCrearMovimientoCaja = z.object({
  idCaja: z.number().int(),
  idUsuario: z.number().int(),
  tipo: z.enum(['ingreso', 'egreso']),
  monto: z.number().min(0),
  descripcion: z.string(),
  fecha: z.string().optional(),
});

const esquemaActualizarMovimientoCaja = z.object({
  id: z.number().int(),
  idCaja: z.number().int().optional(),
  idUsuario: z.number().int().optional(),
  tipo: z.enum(['ingreso', 'egreso']).optional(),
  monto: z.number().min(0).optional(),
  descripcion: z.string().optional(),
  fecha: z.string().optional(),
});

export { esquemaCrearMovimientoCaja, esquemaActualizarMovimientoCaja };
