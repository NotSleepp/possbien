import { z } from 'zod';

// Esquema para crear empresa
const esquemaCrearEmpresa = z.object({
  codigo: z.string().optional(),
  nombre: z.string().optional(),
  id_fiscal: z.string().optional(),
  direccion_fiscal: z.string().optional(),
  direccion: z.string().optional(),
  telefono: z.string().optional(),
  email: z.string().optional().or(z.literal('')),
  correo: z.string().optional().or(z.literal('')),
  simbolo_moneda: z.string().optional(),
  currency: z.string().optional(),
  nombre_moneda: z.string().optional(),
  impuesto: z.string().optional(),
  valor_impuesto: z.number().optional(),
  pie_pagina_ticket: z.string().optional().or(z.literal('')),
  logo: z.string().optional().or(z.literal('')),
  logo_url: z.string().optional().or(z.literal('')),
  ruc: z.string().optional(),
  razon_social: z.string().optional(),
  nombre_comercial: z.string().optional(),
});

// Esquema para actualizar empresa
const esquemaActualizarEmpresa = esquemaCrearEmpresa.partial().extend({
  id: z.number().int().positive().optional(),
});

export { esquemaCrearEmpresa, esquemaActualizarEmpresa };