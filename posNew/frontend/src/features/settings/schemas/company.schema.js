import { z } from 'zod';

/**
 * Esquema de validación para empresa
 */
export const companySchema = z.object({
  nombre: z.string()
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(255, 'El nombre no puede superar 255 caracteres'),
  
  id_fiscal: z.string()
    .min(8, 'El ID fiscal debe tener al menos 8 caracteres')
    .max(20, 'El ID fiscal no puede superar 20 caracteres')
    .regex(/^[0-9]+$/, 'El ID fiscal solo debe contener números'),
  
  direccion_fiscal: z.string()
    .min(10, 'La dirección fiscal debe tener al menos 10 caracteres')
    .max(500, 'La dirección fiscal no puede superar 500 caracteres'),
  
  correo: z.string()
    .email('Debe ser un correo electrónico válido')
    .max(100, 'El correo no puede superar 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefono: z.string()
    .max(20, 'El teléfono no puede superar 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  simbolo_moneda: z.string()
    .max(10, 'El símbolo de moneda no puede superar 10 caracteres')
    .optional(),
  
  currency: z.string()
    .length(3, 'El código de moneda debe tener 3 caracteres')
    .optional(),
  
  nombre_moneda: z.string()
    .max(50, 'El nombre de moneda no puede superar 50 caracteres')
    .optional(),
  
  impuesto: z.string()
    .max(50, 'El nombre del impuesto no puede superar 50 caracteres')
    .optional(),
  
  valor_impuesto: z.number()
    .min(0, 'El valor del impuesto no puede ser negativo')
    .max(100, 'El valor del impuesto no puede superar 100%')
    .optional(),
  
  pie_pagina_ticket: z.string()
    .max(500, 'El pie de página no puede superar 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  logo: z.string()
    .optional()
    .or(z.literal('')),
});

export const validateCompany = (data) => {
  try {
    companySchema.parse(data);
    return { success: true, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      errors[err.path[0]] = err.message;
    });
    return { success: false, errors };
  }
};
