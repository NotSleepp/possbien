import { z } from 'zod';

const esquemaCrearCaja = z.object({
  idSucursal: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  saldoInicial: z.number().min(0),
});

const esquemaActualizarCaja = z.object({
  id: z.number().int(),
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  saldoInicial: z.number().min(0).optional(),
});

export { esquemaCrearCaja, esquemaActualizarCaja };
