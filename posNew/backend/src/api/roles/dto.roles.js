import z from 'zod';

const esquemaCrearRol = z.object({
  idEmpresa: z.number().int(),
  codigo: z.string().min(1),
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
});

const esquemaActualizarRol = z.object({
  id: z.number().int(),
  codigo: z.string().min(1).optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
});

export { esquemaCrearRol, esquemaActualizarRol };