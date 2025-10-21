import { z } from 'zod';

const esquemaCrearStock = z.object({
  idEmpresa: z.number().int(),
  idProducto: z.number().int(),
  idAlmacen: z.number().int(),
  cantidadActual: z.number().int().min(0).default(0),
  cantidadReservada: z.number().int().min(0).default(0),
  stockMinimo: z.number().int().min(0).default(0),
  stockMaximo: z.number().int().min(0).default(0),
  ubicacion: z.string().max(100).optional(),
});

const esquemaActualizarStock = z.object({
  id: z.number().int(),
  idEmpresa: z.number().int().optional(),
  idProducto: z.number().int().optional(),
  idAlmacen: z.number().int().optional(),
  cantidadActual: z.number().int().min(0).optional(),
  cantidadReservada: z.number().int().min(0).optional(),
  stockMinimo: z.number().int().min(0).optional(),
  stockMaximo: z.number().int().min(0).optional(),
  ubicacion: z.string().max(100).optional(),
});

export { esquemaCrearStock, esquemaActualizarStock };