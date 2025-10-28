import { z } from 'zod';

/**
 * Esquema para crear categoría
 * Alineado a camelCase (coincide con frontend)
 */
const esquemaCrearCategoria = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  codigo: z.string().min(1, 'El código es requerido').max(20),
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  descripcion: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido').default('#007bff'),
  icono: z.string().max(50).default('folder'),
  activo: z.boolean().default(true).optional(),
});

/**
 * Esquema para actualizar categoría
 * Todos los campos son opcionales excepto el ID
 */
const esquemaActualizarCategoria = z.object({
  id: z.number().int().positive(),
  codigo: z.string().min(1).max(20).optional(),
  nombre: z.string().min(1).max(100).optional(),
  descripcion: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  icono: z.string().max(50).optional(),
  activo: z.boolean().optional(),
});

export {
    esquemaCrearCategoria,
    esquemaActualizarCategoria
};
