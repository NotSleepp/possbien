import { z } from 'zod';

const esquemaCrearAlmacen = z.object({
  idEmpresa: z.number().int(),
  idSucursal: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  default: z.boolean().optional(),
});

const esquemaActualizarAlmacen = z.object({
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  default: z.boolean().optional(),
});

export { esquemaCrearAlmacen, esquemaActualizarAlmacen };
