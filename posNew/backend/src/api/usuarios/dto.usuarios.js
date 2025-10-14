import { z } from 'zod';

// Esquema para crear usuario
const esquemaCrearUsuario = z.object({
  nombreUsuario: z.string().min(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' }),
  contrasena: z.string().min(6, { message: 'La contraseña debe tener al menos 6 caracteres' }),
  nombres: z.string().min(1, { message: 'Los nombres son requeridos' }),
  apellidos: z.string().min(1, { message: 'Los apellidos son requeridos' }),
  correo: z.string().email({ message: 'Correo inválido' }).optional(),
  telefono: z.string().optional(),
  idRol: z.number().int().positive(),
  idEmpresa: z.number().int().positive(),
});

// Esquema para actualizar usuario
const esquemaActualizarUsuario = esquemaCrearUsuario.partial().extend({
  id: z.number().int().positive(),
});

export { esquemaCrearUsuario, esquemaActualizarUsuario };