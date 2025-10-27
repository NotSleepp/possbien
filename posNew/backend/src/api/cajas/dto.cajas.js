import { z } from 'zod';

const esquemaCrearCaja = z.object({
  idSucursal: z.number().int(),
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  saldoInicial: z.number().optional().default(0),
  idEmpresa: z.number().int().optional(),
});

const esquemaActualizarCaja = z.object({
  id: z.number().int(),
  idSucursal: z.number().int().optional(),
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  saldoInicial: z.number().optional(),
  idEmpresa: z.number().int().optional(),
});

export {
  esquemaCrearCaja,
  esquemaActualizarCaja,
};
