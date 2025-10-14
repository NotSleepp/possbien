import { z } from 'zod';

const esquemaCrearDetalleVenta = z.object({
  idVenta: z.number().int(),
  idProducto: z.number().int(),
  cantidad: z.number().min(1),
  precioUnitario: z.number().min(0),
  subtotal: z.number().min(0),
});

const esquemaActualizarDetalleVenta = z.object({
  id: z.number().int(),
  idVenta: z.number().int().optional(),
  idProducto: z.number().int().optional(),
  cantidad: z.number().min(1).optional(),
  precioUnitario: z.number().min(0).optional(),
  subtotal: z.number().min(0).optional(),
});

export { esquemaCrearDetalleVenta, esquemaActualizarDetalleVenta };
