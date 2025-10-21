import { z } from 'zod';

const esquemaCrearDetalleVenta = z.object({
  idVenta: z.number().int(),
  idProducto: z.number().int(),
  cantidad: z.number().min(1),
  precioVenta: z.number().min(0),
  descuento: z.number().min(0).optional(),
});

const esquemaActualizarDetalleVenta = z.object({
  id: z.number().int(),
  idVenta: z.number().int().optional(),
  idProducto: z.number().int().optional(),
  cantidad: z.number().min(1).optional(),
  precioVenta: z.number().min(0).optional(),
  descuento: z.number().min(0).optional(),
});

export { esquemaCrearDetalleVenta, esquemaActualizarDetalleVenta };
