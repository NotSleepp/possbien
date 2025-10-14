import { z } from 'zod';

const esquemaCrearCategoria = z.object({
  idEmpresa: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
});

const esquemaActualizarCategoria = z.object({
  id: z.number().int(),
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
});

export {
    esquemaCrearCategoria,
    esquemaActualizarCategoria
};
