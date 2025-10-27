import { describe, it, expect } from 'vitest';
import { permissionSchema, permissionsMatrixSchema, moduleSchema } from '../permission.schema';

describe('permissionSchema', () => {
  describe('validaciones básicas', () => {
    it('debe validar datos correctos completos', () => {
      const validData = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: 1,
        puedeVer: true,
        puedeCrear: true,
        puedeEditar: true,
        puedeEliminar: true
      };
      
      expect(() => permissionSchema.parse(validData)).not.toThrow();
    });
    
    it('debe validar datos mínimos requeridos', () => {
      const minimalData = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: 1
      };
      
      const result = permissionSchema.parse(minimalData);
      expect(result.puedeVer).toBe(false); // Default
      expect(result.puedeCrear).toBe(false); // Default
      expect(result.puedeEditar).toBe(false); // Default
      expect(result.puedeEliminar).toBe(false); // Default
    });
    
    it('debe rechazar idEmpresa inválido', () => {
      const invalidData = {
        idEmpresa: -1,
        idRol: 1,
        idModulo: 1
      };
      
      expect(() => permissionSchema.parse(invalidData)).toThrow('ID de empresa debe ser positivo');
    });
    
    it('debe rechazar idRol inválido', () => {
      const invalidData = {
        idEmpresa: 1,
        idRol: 0,
        idModulo: 1
      };
      
      expect(() => permissionSchema.parse(invalidData)).toThrow('ID de rol debe ser positivo');
    });
    
    it('debe rechazar idModulo inválido', () => {
      const invalidData = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: -5
      };
      
      expect(() => permissionSchema.parse(invalidData)).toThrow('ID de módulo debe ser positivo');
    });
  });
  
  describe('validación de permisos booleanos', () => {
    it('debe aceptar puedeVer como true', () => {
      const data = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: 1,
        puedeVer: true
      };
      
      expect(() => permissionSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar puedeVer como false', () => {
      const data = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: 1,
        puedeVer: false
      };
      
      expect(() => permissionSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar puedeVer como string', () => {
      const data = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: 1,
        puedeVer: 'true'
      };
      
      expect(() => permissionSchema.parse(data)).toThrow();
    });
    
    it('debe rechazar puedeCrear como número', () => {
      const data = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: 1,
        puedeCrear: 1
      };
      
      expect(() => permissionSchema.parse(data)).toThrow();
    });
  });
  
  describe('defaults', () => {
    it('debe aplicar todos los defaults a false', () => {
      const data = {
        idEmpresa: 1,
        idRol: 1,
        idModulo: 1
      };
      
      const result = permissionSchema.parse(data);
      expect(result.puedeVer).toBe(false);
      expect(result.puedeCrear).toBe(false);
      expect(result.puedeEditar).toBe(false);
      expect(result.puedeEliminar).toBe(false);
    });
  });
});

describe('permissionsMatrixSchema', () => {
  describe('validaciones básicas', () => {
    it('debe validar matriz de permisos correcta', () => {
      const validData = {
        idEmpresa: 1,
        idRol: 1,
        permisos: [
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 1,
            puedeVer: true,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false
          },
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 2,
            puedeVer: true,
            puedeCrear: true,
            puedeEditar: true,
            puedeEliminar: false
          }
        ]
      };
      
      expect(() => permissionsMatrixSchema.parse(validData)).not.toThrow();
    });
    
    it('debe rechazar matriz vacía', () => {
      const invalidData = {
        idEmpresa: 1,
        idRol: 1,
        permisos: []
      };
      
      expect(() => permissionsMatrixSchema.parse(invalidData)).toThrow('Debe proporcionar al menos un permiso');
    });
    
    it('debe rechazar idEmpresa inválido', () => {
      const invalidData = {
        idEmpresa: 0,
        idRol: 1,
        permisos: [
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 1,
            puedeVer: true
          }
        ]
      };
      
      expect(() => permissionsMatrixSchema.parse(invalidData)).toThrow('ID de empresa debe ser positivo');
    });
    
    it('debe rechazar idRol inválido', () => {
      const invalidData = {
        idEmpresa: 1,
        idRol: -1,
        permisos: [
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 1,
            puedeVer: true
          }
        ]
      };
      
      expect(() => permissionsMatrixSchema.parse(invalidData)).toThrow('ID de rol debe ser positivo');
    });
  });
  
  describe('validación de permisos anidados', () => {
    it('debe validar cada permiso en el array', () => {
      const invalidData = {
        idEmpresa: 1,
        idRol: 1,
        permisos: [
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 1,
            puedeVer: true
          },
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: -1, // Inválido
            puedeVer: true
          }
        ]
      };
      
      expect(() => permissionsMatrixSchema.parse(invalidData)).toThrow('ID de módulo debe ser positivo');
    });
    
    it('debe aceptar múltiples permisos válidos', () => {
      const validData = {
        idEmpresa: 1,
        idRol: 1,
        permisos: [
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 1,
            puedeVer: true,
            puedeCrear: true,
            puedeEditar: true,
            puedeEliminar: true
          },
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 2,
            puedeVer: true,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false
          },
          {
            idEmpresa: 1,
            idRol: 1,
            idModulo: 3,
            puedeVer: false,
            puedeCrear: false,
            puedeEditar: false,
            puedeEliminar: false
          }
        ]
      };
      
      expect(() => permissionsMatrixSchema.parse(validData)).not.toThrow();
    });
  });
});

describe('moduleSchema', () => {
  describe('validaciones básicas', () => {
    it('debe validar módulo correcto completo', () => {
      const validData = {
        id: 1,
        nombre: 'Ventas',
        descripcion: 'Módulo de gestión de ventas',
        icono: 'shopping-cart',
        orden: 1
      };
      
      expect(() => moduleSchema.parse(validData)).not.toThrow();
    });
    
    it('debe validar módulo con datos mínimos', () => {
      const minimalData = {
        id: 1,
        nombre: 'Ventas'
      };
      
      const result = moduleSchema.parse(minimalData);
      expect(result.orden).toBe(0); // Default
    });
    
    it('debe rechazar id inválido', () => {
      const invalidData = {
        id: 0,
        nombre: 'Ventas'
      };
      
      expect(() => moduleSchema.parse(invalidData)).toThrow();
    });
    
    it('debe rechazar nombre vacío', () => {
      const invalidData = {
        id: 1,
        nombre: ''
      };
      
      expect(() => moduleSchema.parse(invalidData)).toThrow('Nombre es requerido');
    });
    
    it('debe rechazar nombre que excede 100 caracteres', () => {
      const invalidData = {
        id: 1,
        nombre: 'a'.repeat(101)
      };
      
      expect(() => moduleSchema.parse(invalidData)).toThrow();
    });
  });
  
  describe('validación de campos opcionales', () => {
    it('debe aceptar descripcion vacía', () => {
      const data = {
        id: 1,
        nombre: 'Ventas',
        descripcion: ''
      };
      
      expect(() => moduleSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar descripcion que excede 500 caracteres', () => {
      const data = {
        id: 1,
        nombre: 'Ventas',
        descripcion: 'a'.repeat(501)
      };
      
      expect(() => moduleSchema.parse(data)).toThrow();
    });
    
    it('debe aceptar icono vacío', () => {
      const data = {
        id: 1,
        nombre: 'Ventas',
        icono: ''
      };
      
      expect(() => moduleSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar icono que excede 50 caracteres', () => {
      const data = {
        id: 1,
        nombre: 'Ventas',
        icono: 'a'.repeat(51)
      };
      
      expect(() => moduleSchema.parse(data)).toThrow();
    });
  });
  
  describe('defaults', () => {
    it('debe aplicar default de orden a 0', () => {
      const data = {
        id: 1,
        nombre: 'Ventas'
      };
      
      const result = moduleSchema.parse(data);
      expect(result.orden).toBe(0);
    });
  });
});
