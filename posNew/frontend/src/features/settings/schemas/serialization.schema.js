import { z } from 'zod';

/**
 * Esquema de validación para serialización de comprobantes
 * Actualizado para coincidir con la estructura de la base de datos
 */
export const serializationSchema = z.object({
  // IDs: aceptar number o string y convertir a number
  idEmpresa: z.union([
    z.number().int().positive('ID de empresa requerido'),
    z.string().transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error('ID de empresa requerido');
      return num;
    }),
  ]),
  
  idSucursal: z.union([
    z.number().int().positive('Debe seleccionar una sucursal'),
    z.string().transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error('Debe seleccionar una sucursal');
      return num;
    }),
  ]),
  
  idTipoComprobante: z.union([
    z.number().int().positive('Debe seleccionar un tipo de comprobante'),
    z.string().transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error('Debe seleccionar un tipo de comprobante');
      return num;
    }),
  ]),
  
  // Serie
  serie: z.string()
    .min(1, 'La serie es requerida')
    .max(10, 'La serie no puede superar 10 caracteres'),
  
  // Números: convertir strings a number
  numeroInicial: z.coerce.number()
    .int('Debe ser un número entero')
    .min(0, 'Debe ser mayor o igual a 0')
    .default(1),
  
  numeroActual: z.coerce.number()
    .int('Debe ser un número entero')
    .min(0, 'Debe ser mayor o igual a 0')
    .default(1),
  
  // numeroFinal: permitir '', undefined y null; convertir '' a null
  numeroFinal: z.union([
    // Permitir 0 en edición para no bloquear registros existentes; se transformará a null
    z.coerce.number().int('Debe ser un número entero').min(0, 'Debe ser mayor o igual a 0'),
    z.null(),
    z.undefined(),
    z.literal(''),
  ])
    .optional()
    .transform((val) => (val === '' || val === undefined || val === 0 ? null : val)),
  
  cantidadNumeros: z.coerce.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1000),
  
  porDefault: z.boolean().default(false),
  
  activo: z.boolean().default(true).optional(),
}).refine(
  (data) => !data.numeroFinal || data.numeroActual <= data.numeroFinal,
  { 
    message: 'El número actual no puede ser mayor al número final', 
    path: ['numeroActual'] 
  }
).refine(
  (data) => data.numeroActual >= data.numeroInicial,
  { 
    message: 'El número actual no puede ser menor al número inicial', 
    path: ['numeroActual'] 
  }
);

export const validateSerialization = (data) => {
  console.log('[serialization.schema] validateSerialization input:', data);
  try {
    const validated = serializationSchema.parse(data);
    console.log('[serialization.schema] validateSerialization success, output:', validated);
    return { success: true, data: validated, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    console.error('[serialization.schema] validateSerialization errors:', errors, 'raw error:', error);
    return { success: false, errors };
  }
};

/**
 * Esquema de validación para edición (sin reglas cruzadas)
 * Mantiene coerción y validaciones por campo, pero omite comparaciones entre números
 */
export const serializationUpdateSchema = z.object({
  idEmpresa: z.union([
    z.number().int().positive('ID de empresa requerido'),
    z.string().transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error('ID de empresa requerido');
      return num;
    }),
  ]),

  idSucursal: z.union([
    z.number().int().positive('Debe seleccionar una sucursal'),
    z.string().transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error('Debe seleccionar una sucursal');
      return num;
    }),
  ]),

  idTipoComprobante: z.union([
    z.number().int().positive('Debe seleccionar un tipo de comprobante'),
    z.string().transform((val) => {
      const num = Number(val);
      if (isNaN(num) || num <= 0) throw new Error('Debe seleccionar un tipo de comprobante');
      return num;
    }),
  ]),

  serie: z.string()
    .min(1, 'La serie es requerida')
    .max(10, 'La serie no puede superar 10 caracteres'),

  numeroInicial: z.coerce.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1),

  numeroActual: z.coerce.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1),

  numeroFinal: z.union([
    z.coerce.number().int('Debe ser un número entero').positive('Debe ser mayor a 0'),
    z.null(),
    z.undefined(),
    z.literal(''),
  ])
    .optional()
    .transform((val) => (val === '' || val === undefined ? null : val)),

  cantidadNumeros: z.coerce.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1000),

  // Tolerar boolean, 0/1 y strings 'true'/'false'/'1'/'0' para edición
  porDefault: z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val === 1;
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase();
      if (s === 'true' || s === '1') return true;
      if (s === 'false' || s === '0') return false;
      return val; // dejar pasar valores inesperados para que z.boolean() falle
    }
    return val;
  }, z.boolean()).default(false),

  activo: z.preprocess((val) => {
    if (typeof val === 'boolean') return val;
    if (typeof val === 'number') return val === 1;
    if (typeof val === 'string') {
      const s = val.trim().toLowerCase();
      if (s === 'true' || s === '1') return true;
      if (s === 'false' || s === '0') return false;
      return val;
    }
    return val;
  }, z.boolean()).default(true).optional(),
});

export const validateSerializationUpdate = (data) => {
  console.log('[serialization.schema] validateSerializationUpdate input:', data);
  try {
    const validated = serializationUpdateSchema.parse(data);
    console.log('[serialization.schema] validateSerializationUpdate success, output:', validated);
    return { success: true, data: validated, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    console.error('[serialization.schema] validateSerializationUpdate errors:', errors, 'raw error:', error);
    return { success: false, errors };
  }
};
