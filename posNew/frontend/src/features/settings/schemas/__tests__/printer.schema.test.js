import { describe, it, expect } from 'vitest';
import { printerSchema } from '../printer.schema';

describe('printerSchema', () => {
  describe('validaciones básicas', () => {
    it('debe validar datos correctos completos', () => {
      const validData = {
        idEmpresa: 1,
        idSucursal: 1,
        idCaja: 1,
        name: 'Impresora Principal',
        tipo: 'termica',
        puerto: 'COM1',
        pcName: 'PC-CAJA-01',
        ipLocal: '192.168.1.100',
        state: true,
        configuracion: { ancho: 80, velocidad: 'alta' },
        activo: true
      };
      
      expect(() => printerSchema.parse(validData)).not.toThrow();
    });
    
    it('debe validar datos mínimos requeridos', () => {
      const minimalData = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora'
      };
      
      const result = printerSchema.parse(minimalData);
      expect(result.tipo).toBe('termica'); // Default
      expect(result.state).toBe(true); // Default
      expect(result.activo).toBe(true); // Default
    });
    
    it('debe rechazar name vacío', () => {
      const invalidData = {
        idEmpresa: 1,
        idSucursal: 1,
        name: '',
        tipo: 'termica'
      };
      
      expect(() => printerSchema.parse(invalidData)).toThrow('El nombre es requerido');
    });
    
    it('debe rechazar name que excede 255 caracteres', () => {
      const invalidData = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'a'.repeat(256),
        tipo: 'termica'
      };
      
      expect(() => printerSchema.parse(invalidData)).toThrow('no puede superar 255 caracteres');
    });
    
    it('debe rechazar idEmpresa inválido', () => {
      const invalidData = {
        idEmpresa: -1,
        idSucursal: 1,
        name: 'Impresora'
      };
      
      expect(() => printerSchema.parse(invalidData)).toThrow();
    });
    
    it('debe rechazar idSucursal inválido', () => {
      const invalidData = {
        idEmpresa: 1,
        idSucursal: 0,
        name: 'Impresora'
      };
      
      expect(() => printerSchema.parse(invalidData)).toThrow();
    });
  });
  
  describe('validación de tipo', () => {
    it('debe aceptar tipo "termica"', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        tipo: 'termica'
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar tipo "matricial"', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        tipo: 'matricial'
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar tipo "laser"', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        tipo: 'laser'
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar tipo inválido', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        tipo: 'inkjet'
      };
      
      expect(() => printerSchema.parse(data)).toThrow('Debe seleccionar un tipo válido');
    });
    
    it('debe aplicar default "termica" cuando no se especifica tipo', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora'
      };
      
      const result = printerSchema.parse(data);
      expect(result.tipo).toBe('termica');
    });
  });
  
  describe('validación de IP', () => {
    it('debe aceptar IP válida', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        ipLocal: '192.168.1.100'
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar IP en rango válido (0.0.0.0)', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        ipLocal: '0.0.0.0'
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar IP en rango válido (255.255.255.255)', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        ipLocal: '255.255.255.255'
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar IP con octeto mayor a 255', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        ipLocal: '192.168.1.256'
      };
      
      expect(() => printerSchema.parse(data)).toThrow('Debe ser una dirección IP válida');
    });
    
    it('debe rechazar IP con formato inválido', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        ipLocal: '192.168.1'
      };
      
      expect(() => printerSchema.parse(data)).toThrow('Debe ser una dirección IP válida');
    });
    
    it('debe rechazar IP con caracteres no numéricos', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        ipLocal: '192.168.a.1'
      };
      
      expect(() => printerSchema.parse(data)).toThrow('Debe ser una dirección IP válida');
    });
    
    it('debe aceptar IP vacía', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        ipLocal: ''
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
  });
  
  describe('validación de configuracion', () => {
    it('debe aceptar configuracion como objeto', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        configuracion: {
          ancho: 80,
          velocidad: 'alta',
          corte_automatico: true
        }
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar configuracion como null', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        configuracion: null
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe convertir string JSON a objeto', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        configuracion: '{"ancho": 80}'
      };
      
      const result = printerSchema.parse(data);
      expect(result.configuracion).toEqual({ ancho: 80 });
    });
    
    it('debe convertir string vacío a null', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        configuracion: ''
      };
      
      const result = printerSchema.parse(data);
      expect(result.configuracion).toBeNull();
    });
  });
  
  describe('validación de campos opcionales', () => {
    it('debe aceptar idCaja como null', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        idCaja: null
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar puerto vacío', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        puerto: ''
      };
      
      expect(() => printerSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar puerto que excede 50 caracteres', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        puerto: 'a'.repeat(51)
      };
      
      expect(() => printerSchema.parse(data)).toThrow('no puede superar 50 caracteres');
    });
    
    it('debe rechazar pcName que excede 255 caracteres', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora',
        pcName: 'a'.repeat(256)
      };
      
      expect(() => printerSchema.parse(data)).toThrow('no puede superar 255 caracteres');
    });
  });
  
  describe('defaults', () => {
    it('debe aplicar todos los defaults correctamente', () => {
      const data = {
        idEmpresa: 1,
        idSucursal: 1,
        name: 'Impresora'
      };
      
      const result = printerSchema.parse(data);
      expect(result.tipo).toBe('termica');
      expect(result.state).toBe(true);
      expect(result.activo).toBe(true);
    });
  });
});
