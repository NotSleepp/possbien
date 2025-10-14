import { z } from 'zod';

const esquemaCrearSystemLog = z.object({
  idEmpresa: z.number().int(),
  idUsuario: z.number().int(),
  accion: z.string(),
  descripcion: z.string(),
  fecha: z.string().optional(),
});

const esquemaActualizarSystemLog = z.object({
  id: z.number().int(),
  idEmpresa: z.number().int().optional(),
  idUsuario: z.number().int().optional(),
  accion: z.string().optional(),
  descripcion: z.string().optional(),
  fecha: z.string().optional(),
});

export { esquemaCrearSystemLog, esquemaActualizarSystemLog };
