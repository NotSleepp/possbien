import { z } from 'zod';

const esquemaCrearCaja = z.object({
  idSucursal: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  saldoInicial: z.number().nonnegative().default(0),
  idEmpresa: z.number().int().optional(),
});

const esquemaActualizarCaja = z.object({
  id: z.number().int(),
  idSucursal: z.number().int().optional(),
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  saldoInicial: z.number().nonnegative().optional(),
  idEmpresa: z.number().int().optional(),
});

export {
  esquemaCrearCaja,
  esquemaActualizarCaja,
};
