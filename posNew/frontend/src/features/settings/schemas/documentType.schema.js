import { z } from 'zod';

/**
 * Esquema de validación para tipos de comprobantes
 * Actualizado para coincidir con la estructura de la base de datos
 */
export const documentTypeSchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa requerido'),
  
  codigo: z.string()
    .min(1, 'El código es requerido')
    .max(10, 'El código no puede superar 10 caracteres'),
  
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  
  descripcion: z.string()
    .max(1000, 'La descripción no puede superar 1000 caracteres')
    .optional()
    .or(z.literal('')),
  
  destino: z.enum(['VENTA', 'COMPRA', 'INTERNO'], {
    errorMap: () => ({ message: 'Debe seleccionar un destino válido' }),
  }).default('VENTA'),
  
  activo: z.boolean().default(true).optional(),
});

export const validateDocumentType = (data) => {
  try {
    documentTypeSchema.parse(data);
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
