import { z } from 'zod';

/**
 * Esquema de validación para serialización de comprobantes
 * Actualizado para coincidir con la estructura de la base de datos
 */
export const serializationSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  idSucursal: z.number().int().positive('Debe seleccionar una sucursal'),
  
  idTipoComprobante: z.number().int().positive('Debe seleccionar un tipo de comprobante'),
  
  serie: z.string()
    .min(1, 'La serie es requerida')
    .max(10, 'La serie no puede superar 10 caracteres'),
  
  numeroInicial: z.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1),
  
  numeroActual: z.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1),
  
  numeroFinal: z.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .nullable()
    .optional(),
  
  cantidadNumeros: z.number()
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
  try {
    serializationSchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    return { success: false, errors };
  }
};
