import { z } from 'zod';

const esquemaCrearSucursal = z.object({
  idEmpresa: z.number().int(),
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  direccion: z.string().optional(),
  direccionFiscal: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().optional(),
});

const esquemaActualizarSucursal = z.object({
  id: z.number().int(),
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  direccion: z.string().optional(),
  direccionFiscal: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().optional(),
});

export { esquemaCrearSucursal, esquemaActualizarSucursal };
