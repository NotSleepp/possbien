import z from 'zod';

const esquemaCrearDetalleCompra = z.object({
  idCompra: z.number().int(),
  idProducto: z.number().int(),
  cantidad: z.number().min(1),
  precioUnitario: z.number().min(0),
  descuento: z.number().min(0).optional(),
});

const esquemaActualizarDetalleCompra = z.object({
  id: z.number().int(),
  idCompra: z.number().int().optional(),
  idProducto: z.number().int().optional(),
  cantidad: z.number().min(1).optional(),
  precioUnitario: z.number().min(0).optional(),
  descuento: z.number().min(0).optional(),
});

export { esquemaCrearDetalleCompra, esquemaActualizarDetalleCompra };
