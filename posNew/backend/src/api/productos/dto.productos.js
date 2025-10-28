import { z } from 'zod';

const esquemaCrearProducto = z.object({
  idEmpresa: z.number().int(),
  idCategoria: z.number().int(),
  codigo: z.string().min(1),
  codigoBarras: z.string().optional(),
  codigoInterno: z.string().optional(),
  nombre: z.string().min(1),
  descripcion: z.string().optional(),
  precioCompra: z.number().min(0),
  precioVenta: z.number().min(0),
  stockActual: z.number().min(0),
  stockMinimo: z.number().min(0),
  unidadMedida: z.string().optional(),
  sevendePor: z.string().optional(),
  manejaInventarios: z.boolean().optional(),
  manejaMultiprecios: z.boolean().optional(),
  imagenUrl: z.string().optional(),
});

const esquemaActualizarProducto = z.object({
  id: z.number().int(),
  idCategoria: z.number().int().optional(),
  codigo: z.string().min(1).optional(),
  codigoBarras: z.string().optional(),
  codigoInterno: z.string().optional(),
  nombre: z.string().min(1).optional(),
  descripcion: z.string().optional(),
  precioCompra: z.number().min(0).optional(),
  precioVenta: z.number().min(0).optional(),
  stockActual: z.number().min(0).optional(),
  stockMinimo: z.number().min(0).optional(),
  unidadMedida: z.string().optional(),
  sevendePor: z.string().optional(),
  manejaInventarios: z.boolean().optional(),
  manejaMultiprecios: z.boolean().optional(),
  imagenUrl: z.string().optional(),
});

export { esquemaCrearProducto, esquemaActualizarProducto };