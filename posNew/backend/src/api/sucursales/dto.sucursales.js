import { z } from 'zod';

const esquemaCrearSucursal = z.object({
  idEmpresa: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  direccion: z.string().optional(),
  direccionFiscal: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
});

const esquemaActualizarSucursal = z.object({
  id: z.number().int(),
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  direccion: z.string().optional(),
  direccionFiscal: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
});

export { esquemaCrearSucursal, esquemaActualizarSucursal };
