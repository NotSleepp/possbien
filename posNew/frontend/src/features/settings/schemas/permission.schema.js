import { z } from 'zod';

/**
 * Schema de validación para un permiso individual
 */
export const permissionSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa debe ser positivo'),
  idRol: z.number().int().positive('ID de rol debe ser positivo'),
  idModulo: z.number().int().positive('ID de módulo debe ser positivo'),
  puedeVer: z.boolean().default(false),
  puedeCrear: z.boolean().default(false),
  puedeEditar: z.boolean().default(false),
  puedeEliminar: z.boolean().default(false)
});

/**
 * Schema para actualización masiva de permisos (matriz completa)
 */
export const permissionsMatrixSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa debe ser positivo'),
  idRol: z.number().int().positive('ID de rol debe ser positivo'),
  permisos: z.array(permissionSchema).min(1, 'Debe proporcionar al menos un permiso')
});

/**
 * Schema para un módulo del sistema
 */
export const moduleSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1, 'Nombre es requerido').max(100),
  descripcion: z.string().max(500).optional(),
  icono: z.string().max(50).optional(),
  orden: z.number().int().default(0)
});
