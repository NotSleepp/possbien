import z from 'zod';

const esquemaCrearVenta = z.object({
  idSucursal: z.number().int(),
  idCliente: z.number().int(),
  fechaVenta: z.string().optional(),
  montoTotal: z.number().min(0),
  estado: z.enum(['PENDIENTE', 'COMPLETADA', 'ANULADA']),
});

const esquemaActualizarVenta = z.object({
  id: z.number().int(),
  idSucursal: z.number().int().optional(),
  idCliente: z.number().int().optional(),
  fechaVenta: z.string().optional(),
  montoTotal: z.number().min(0).optional(),
  estado: z.enum(['PENDIENTE', 'COMPLETADA', 'ANULADA']).optional(),
});

export { esquemaCrearVenta, esquemaActualizarVenta };
