import { z } from 'zod';

const esquemaCrearAuditTrail = z.object({
  idEmpresa: z.number().int(),
  idUsuario: z.number().int(),
  entidad: z.string(),
  accion: z.string(),
  datosAnteriores: z.string().optional(),
  datosNuevos: z.string().optional(),
  fecha: z.string().optional(),
});

const esquemaActualizarAuditTrail = z.object({
  id: z.number().int(),
  idEmpresa: z.number().int().optional(),
  idUsuario: z.number().int().optional(),
  entidad: z.string().optional(),
  accion: z.string().optional(),
  datosAnteriores: z.string().optional(),
  datosNuevos: z.string().optional(),
  fecha: z.string().optional(),
});

export {
    esquemaCrearAuditTrail,
    esquemaActualizarAuditTrail
};
