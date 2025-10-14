import z from 'zod';

const esquemaCrearCompra = z.object({
  idSucursal: z.number().int(),
  idProveedor: z.number().int(),
  fechaCompra: z.string().optional(),
  total: z.number().min(0),
  estado: z.enum(['completada', 'pendiente', 'cancelada']),
});

const esquemaActualizarCompra = z.object({
  id: z.number().int(),
  idSucursal: z.number().int().optional(),
  idProveedor: z.number().int().optional(),
  fechaCompra: z.string().optional(),
  total: z.number().min(0).optional(),
  estado: z.enum(['completada', 'pendiente', 'cancelada']).optional(),
});

export { esquemaCrearCompra, esquemaActualizarCompra };
