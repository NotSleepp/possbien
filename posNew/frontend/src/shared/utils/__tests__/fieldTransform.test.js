import { describe, it, expect } from 'vitest';
import { toSnakeCase, toCamelCase } from '../fieldTransform';

describe('fieldTransform', () => {
  describe('toSnakeCase', () => {
    it('debe convertir camelCase a snake_case', () => {
      const input = {
        idEmpresa: 1,
        nombreCompleto: 'Juan Pérez',
        fechaNacimiento: '1990-01-01'
      };
      
      const expected = {
        id_empresa: 1,
        nombre_completo: 'Juan Pérez',
        fecha_nacimiento: '1990-01-01'
      };
      
      expect(toSnakeCase(input)).toEqual(expected);
    });
    
    it('debe manejar objetos anidados', () => {
      const input = {
        idEmpresa: 1,
        datosUsuario: {
          nombreCompleto: 'Juan Pérez',
          correoElectronico: 'juan@example.com'
        }
      };
      
      const expected = {
        id_empresa: 1,
        datos_usuario: {
          nombre_completo: 'Juan Pérez',
          correo_electronico: 'juan@example.com'
        }
      };
      
      expect(toSnakeCase(input)).toEqual(expected);
    });
    
    it('debe manejar arrays', () => {
      const input = [
        { idEmpresa: 1, nombreEmpresa: 'Empresa 1' },
        { idEmpresa: 2, nombreEmpresa: 'Empresa 2' }
      ];
      
      const expected = [
        { id_empresa: 1, nombre_empresa: 'Empresa 1' },
        { id_empresa: 2, nombre_empresa: 'Empresa 2' }
      ];
      
      expect(toSnakeCase(input)).toEqual(expected);
    });
    
    it('debe manejar arrays anidados en objetos', () => {
      const input = {
        idEmpresa: 1,
        listaUsuarios: [
          { idUsuario: 1, nombreUsuario: 'user1' },
          { idUsuario: 2, nombreUsuario: 'user2' }
        ]
      };
      
      const expected = {
        id_empresa: 1,
        lista_usuarios: [
          { id_usuario: 1, nombre_usuario: 'user1' },
          { id_usuario: 2, nombre_usuario: 'user2' }
        ]
      };
      
      expect(toSnakeCase(input)).toEqual(expected);
    });
    
    it('debe retornar valores primitivos sin cambios', () => {
      expect(toSnakeCase(null)).toBe(null);
      expect(toSnakeCase(undefined)).toBe(undefined);
      expect(toSnakeCase(123)).toBe(123);
      expect(toSnakeCase('texto')).toBe('texto');
      expect(toSnakeCase(true)).toBe(true);
    });
    
    it('debe manejar campos que ya están en snake_case', () => {
      const input = {
        id_empresa: 1,
        nombre_completo: 'Juan'
      };
      
      expect(toSnakeCase(input)).toEqual(input);
    });
  });
  
  describe('toCamelCase', () => {
    it('debe convertir snake_case a camelCase', () => {
      const input = {
        id_empresa: 1,
        nombre_completo: 'Juan Pérez',
        fecha_nacimiento: '1990-01-01'
      };
      
      const expected = {
        idEmpresa: 1,
        nombreCompleto: 'Juan Pérez',
        fechaNacimiento: '1990-01-01'
      };
      
      expect(toCamelCase(input)).toEqual(expected);
    });
    
    it('debe manejar objetos anidados', () => {
      const input = {
        id_empresa: 1,
        datos_usuario: {
          nombre_completo: 'Juan Pérez',
          correo_electronico: 'juan@example.com'
        }
      };
      
      const expected = {
        idEmpresa: 1,
        datosUsuario: {
          nombreCompleto: 'Juan Pérez',
          correoElectronico: 'juan@example.com'
        }
      };
      
      expect(toCamelCase(input)).toEqual(expected);
    });
    
    it('debe manejar arrays', () => {
      const input = [
        { id_empresa: 1, nombre_empresa: 'Empresa 1' },
        { id_empresa: 2, nombre_empresa: 'Empresa 2' }
      ];
      
      const expected = [
        { idEmpresa: 1, nombreEmpresa: 'Empresa 1' },
        { idEmpresa: 2, nombreEmpresa: 'Empresa 2' }
      ];
      
      expect(toCamelCase(input)).toEqual(expected);
    });
    
    it('debe manejar arrays anidados en objetos', () => {
      const input = {
        id_empresa: 1,
        lista_usuarios: [
          { id_usuario: 1, nombre_usuario: 'user1' },
          { id_usuario: 2, nombre_usuario: 'user2' }
        ]
      };
      
      const expected = {
        idEmpresa: 1,
        listaUsuarios: [
          { idUsuario: 1, nombreUsuario: 'user1' },
          { idUsuario: 2, nombreUsuario: 'user2' }
        ]
      };
      
      expect(toCamelCase(input)).toEqual(expected);
    });
    
    it('debe retornar valores primitivos sin cambios', () => {
      expect(toCamelCase(null)).toBe(null);
      expect(toCamelCase(undefined)).toBe(undefined);
      expect(toCamelCase(123)).toBe(123);
      expect(toCamelCase('texto')).toBe('texto');
      expect(toCamelCase(true)).toBe(true);
    });
    
    it('debe manejar campos que ya están en camelCase', () => {
      const input = {
        idEmpresa: 1,
        nombreCompleto: 'Juan'
      };
      
      expect(toCamelCase(input)).toEqual(input);
    });
  });
  
  describe('transformaciones bidireccionales', () => {
    it('debe ser reversible: camelCase -> snake_case -> camelCase', () => {
      const original = {
        idEmpresa: 1,
        nombreCompleto: 'Juan Pérez',
        datosContacto: {
          correoElectronico: 'juan@example.com',
          numeroTelefono: '123456789'
        }
      };
      
      const transformed = toSnakeCase(original);
      const reversed = toCamelCase(transformed);
      
      expect(reversed).toEqual(original);
    });
    
    it('debe ser reversible: snake_case -> camelCase -> snake_case', () => {
      const original = {
        id_empresa: 1,
        nombre_completo: 'Juan Pérez',
        datos_contacto: {
          correo_electronico: 'juan@example.com',
          numero_telefono: '123456789'
        }
      };
      
      const transformed = toCamelCase(original);
      const reversed = toSnakeCase(transformed);
      
      expect(reversed).toEqual(original);
    });
  });
});
