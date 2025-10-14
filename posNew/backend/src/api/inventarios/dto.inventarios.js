import z from 'zod';

const esquemaCrearInventario = z.object({
  idProducto: z.number().int(),
  idSucursal: z.number().int(),
  cantidadActual: z.number().min(0),
  stockMinimo: z.number().min(0),
  stockMaximo: z.number().min(0),
});

const esquemaActualizarInventario = z.object({
  id: z.number().int(),
  idProducto: z.number().int().optional(),
  idSucursal: z.number().int().optional(),
  cantidadActual: z.number().min(0).optional(),
  stockMinimo: z.number().min(0).optional(),
  stockMaximo: z.number().min(0).optional(),
});

export { esquemaCrearInventario, esquemaActualizarInventario };
