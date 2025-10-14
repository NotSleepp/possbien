import { z } from 'zod';

const esquemaCrearAsignacionCaja = z.object({
  idCaja: z.number().int(),
  idUsuario: z.number().int(),
  fechaAsignacion: z.string().optional(),
  estado: z.enum(['activa', 'inactiva']),
});

const esquemaActualizarAsignacionCaja = z.object({
  id: z.number().int(),
  idCaja: z.number().int().optional(),
  idUsuario: z.number().int().optional(),
  fechaAsignacion: z.string().optional(),
  estado: z.enum(['activa', 'inactiva']).optional(),
});

export { esquemaCrearAsignacionCaja, esquemaActualizarAsignacionCaja };
