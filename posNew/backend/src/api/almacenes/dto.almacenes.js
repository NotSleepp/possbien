import { z } from 'zod';

const esquemaCrearAlmacen = z.object({
  idEmpresa: z.number().int(),
  idSucursal: z.number().int(),
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  default: z.boolean().optional(),
});

const esquemaActualizarAlmacen = z.object({
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  descripcion: z.string().optional(),
  default: z.boolean().optional(),
});

export { esquemaCrearAlmacen, esquemaActualizarAlmacen };
