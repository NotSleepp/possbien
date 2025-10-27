import { z } from 'zod';

/**
 * Esquema de validación para empresa
 */
export const companySchema = z.object({
  nombre: z.string()
    .max(255, 'El nombre debe tener máximo 255 caracteres')
    .optional(),
  
  id_fiscal: z.string()
    .max(50, 'El ID fiscal debe tener máximo 50 caracteres')
    .optional()
    .or(z.literal('')),
  
  direccion_fiscal: z.string()
    .max(500, 'La dirección fiscal debe tener máximo 500 caracteres')
    .optional()
    .or(z.literal('')),
  
  correo: z.string()
    .email('Debe ser un correo electrónico válido')
    .max(100, 'El correo debe tener máximo 100 caracteres')
    .optional()
    .or(z.literal('')),
  
  telefono: z.string()
    .max(20, 'El teléfono debe tener máximo 20 caracteres')
    .optional()
    .or(z.literal('')),
  
  simbolo_moneda: z.string()
    .max(10, 'El símbolo de moneda debe tener máximo 10 caracteres')
    .optional(),
  
  currency: z.string()
    .max(10, 'El código de moneda debe tener máximo 10 caracteres')
    .optional(),
  
  nombre_moneda: z.string()
    .max(50, 'El nombre de moneda debe tener máximo 50 caracteres')
    .optional(),
  
  impuesto: z.string()
    .max(50, 'El nombre del impuesto debe tener máximo 50 caracteres')
    .optional(),
  
  valor_impuesto: z.number()
    .optional(),
  
  pie_pagina_ticket: z.string()
    .max(500, 'El pie de página debe tener máximo 500 caracteres')
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
    console.log('Validation error in company schema:', error);
    console.log('Data being validated:', data);
    const errors = {};
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => {
        if (err.path && err.path[0]) {
          errors[err.path[0]] = err.message;
        }
      });
    }
    console.log('Parsed errors:', errors);
    return { success: false, errors };
  }
};
