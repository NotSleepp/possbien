import { z } from 'zod';

/**
 * Esquema para crear impresora
 * Acepta tanto camelCase (frontend) como snake_case (backend)
 */
export const esquemaCrearImpresora = z.object({
  // Aceptar ambos formatos para id_empresa
  id_empresa: z.number().int().positive().optional(),
  idEmpresa: z.number().int().positive().optional(),
  
  // Aceptar ambos formatos para id_sucursal
  id_sucursal: z.number().int().positive().optional(),
  idSucursal: z.number().int().positive().optional(),
  
  // Aceptar ambos formatos para id_caja
  id_caja: z.number().int().positive().nullable().optional(),
  idCaja: z.number().int().positive().nullable().optional(),
  
  name: z.string().min(1, 'El nombre es requerido').max(255),
  nombre: z.string().min(1).max(255).nullable().optional(),
  tipo: z.enum(['termica', 'matricial', 'laser']).default('termica'),
  puerto: z.string().max(50).optional(),
  
  // Aceptar ambos formatos para pc_name
  pc_name: z.string().max(255).optional(),
  pcName: z.string().max(255).optional(),
  
  // Aceptar ambos formatos para ip_local
  ip_local: z.string().max(45).optional(),
  ipLocal: z.string().max(45).optional(),
  
  state: z.boolean().default(true),
  configuracion: z.union([
    z.record(z.any()),
    z.string(),
    z.null()
  ]).optional(),
  activo: z.boolean().default(true).optional()
}).transform((data) => {
  // Normalizar a camelCase para el servicio
  return {
    idEmpresa: data.idEmpresa || data.id_empresa,
    idSucursal: data.idSucursal || data.id_sucursal,
    idCaja: data.idCaja || data.id_caja || null,
    name: data.name,
    nombre: data.nombre || null,
    tipo: data.tipo,
    puerto: data.puerto || null,
    pcName: data.pcName || data.pc_name || null,
    ipLocal: data.ipLocal || data.ip_local || null,
    state: data.state ?? true,
    configuracion: data.configuracion || null,
    activo: data.activo ?? true
  };
});

/**
 * Esquema base para actualizar impresora (sin transform para poder usar .omit())
 * Todos los campos son opcionales excepto el ID
 * Acepta tanto camelCase (frontend) como snake_case (backend)
 */
const esquemaActualizarImpresoraBase = z.object({
  id: z.number().int().positive(),
  
  // Aceptar ambos formatos
  id_sucursal: z.number().int().positive().optional(),
  idSucursal: z.number().int().positive().optional(),
  
  id_caja: z.number().int().positive().nullable().optional(),
  idCaja: z.number().int().positive().nullable().optional(),
  
  name: z.string().min(1).max(255).optional(),
  nombre: z.string().min(1).max(255).nullable().optional(),
  tipo: z.enum(['termica', 'matricial', 'laser']).optional(),
  puerto: z.string().max(50).optional(),
  
  pc_name: z.string().max(255).optional(),
  pcName: z.string().max(255).optional(),
  
  ip_local: z.string().max(45).optional(),
  ipLocal: z.string().max(45).optional(),
  
  state: z.boolean().optional(),
  configuracion: z.union([
    z.record(z.any()),
    z.string(),
    z.null()
  ]).optional(),
  activo: z.boolean().optional()
});

/**
 * Esquema para actualizar impresora con transformación
 */
export const esquemaActualizarImpresora = esquemaActualizarImpresoraBase.transform((data) => {
  // Normalizar a camelCase para el servicio
  const result = {
    id: data.id
  };
  
  if (data.idSucursal !== undefined || data.id_sucursal !== undefined) {
    result.idSucursal = data.idSucursal || data.id_sucursal;
  }
  if (data.idCaja !== undefined || data.id_caja !== undefined) {
    result.idCaja = data.idCaja ?? data.id_caja ?? null;
  }
  if (data.name !== undefined) result.name = data.name;
  if (data.nombre !== undefined) result.nombre = data.nombre;
  if (data.tipo !== undefined) result.tipo = data.tipo;
  if (data.puerto !== undefined) result.puerto = data.puerto;
  if (data.pcName !== undefined || data.pc_name !== undefined) {
    result.pcName = data.pcName || data.pc_name;
  }
  if (data.ipLocal !== undefined || data.ip_local !== undefined) {
    result.ipLocal = data.ipLocal || data.ip_local;
  }
  if (data.state !== undefined) result.state = data.state;
  if (data.configuracion !== undefined) result.configuracion = data.configuracion;
  if (data.activo !== undefined) result.activo = data.activo;
  
  return result;
});

/**
 * Esquema para el body de actualización (sin el campo id)
 * Este se usa en las rutas para validar el body
 */
export const esquemaActualizarImpresoraBody = esquemaActualizarImpresoraBase.omit({ id: true });