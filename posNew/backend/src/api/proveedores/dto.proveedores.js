import { z } from 'zod';

const esquemaCrearProveedor = z.object({
  idEmpresa: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  tipoDocumento: z.string().optional(),
  numeroDocumento: z.string().optional(),
});

const esquemaActualizarProveedor = z.object({
  id: z.number().int(),
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().email().optional(),
  tipoDocumento: z.string().optional(),
  numeroDocumento: z.string().optional(),
});

export {
    esquemaCrearProveedor,
    esquemaActualizarProveedor
};
