import { z } from 'zod';

// Esquema para crear empresa
const esquemaCrearEmpresa = z.object({
  codigo: z.string().min(1, { message: 'El código es requerido' }).max(20),
  nombre: z.string().min(1, { message: 'El nombre es requerido' }).max(100),
  id_fiscal: z.string().max(50).optional(),
  direccion: z.string().optional(),
  telefono: z.string().max(20).optional(),
  email: z.string().email({ message: 'Correo inválido' }).optional(),
});

// Esquema para actualizar empresa
const esquemaActualizarEmpresa = esquemaCrearEmpresa.partial().extend({
  id: z.number().int().positive(),
});

export { esquemaCrearEmpresa, esquemaActualizarEmpresa };