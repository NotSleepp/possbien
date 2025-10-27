import { describe, it, expect } from 'vitest';
import { documentTypeSchema } from '../documentType.schema';

describe('documentTypeSchema', () => {
  describe('validaciones básicas', () => {
    it('debe validar datos correctos completos', () => {
      const validData = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura',
        descripcion: 'Factura de venta',
        destino: 'VENTA',
        activo: true
      };
      
      expect(() => documentTypeSchema.parse(validData)).not.toThrow();
    });
    
    it('debe validar datos mínimos requeridos', () => {
      const minimalData = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura'
      };
      
      const result = documentTypeSchema.parse(minimalData);
      expect(result.destino).toBe('VENTA'); // Default
      expect(result.activo).toBe(true); // Default
    });
    
    it('debe rechazar codigo vacío', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: '',
        nombre: 'Factura'
      };
      
      expect(() => documentTypeSchema.parse(invalidData)).toThrow('El código es requerido');
    });
    
    it('debe rechazar nombre vacío', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: ''
      };
      
      expect(() => documentTypeSchema.parse(invalidData)).toThrow('El nombre es requerido');
    });
    
    it('debe rechazar codigo que excede 10 caracteres', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: 'CODIGO12345',
        nombre: 'Factura'
      };
      
      expect(() => documentTypeSchema.parse(invalidData)).toThrow('no puede superar 10 caracteres');
    });
    
    it('debe rechazar nombre que excede 100 caracteres', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'a'.repeat(101)
      };
      
      expect(() => documentTypeSchema.parse(invalidData)).toThrow('no puede superar 100 caracteres');
    });
  });
  
  describe('validación de destino', () => {
    it('debe aceptar destino VENTA', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura',
        destino: 'VENTA'
      };
      
      expect(() => documentTypeSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar destino COMPRA', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'FC',
        nombre: 'Factura de Compra',
        destino: 'COMPRA'
      };
      
      expect(() => documentTypeSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar destino INTERNO', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'INT',
        nombre: 'Documento Interno',
        destino: 'INTERNO'
      };
      
      expect(() => documentTypeSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar destino inválido', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura',
        destino: 'INVALIDO'
      };
      
      expect(() => documentTypeSchema.parse(data)).toThrow('Debe seleccionar un destino válido');
    });
    
    it('debe aplicar default VENTA cuando no se especifica', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura'
      };
      
      const result = documentTypeSchema.parse(data);
      expect(result.destino).toBe('VENTA');
    });
  });
  
  describe('validación de descripcion', () => {
    it('debe aceptar descripcion vacía', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura',
        descripcion: ''
      };
      
      expect(() => documentTypeSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar descripcion que excede 1000 caracteres', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura',
        descripcion: 'a'.repeat(1001)
      };
      
      expect(() => documentTypeSchema.parse(data)).toThrow('no puede superar 1000 caracteres');
    });
  });
  
  describe('casos de uso reales', () => {
    it('debe validar factura de venta', () => {
      const factura = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura',
        descripcion: 'Factura electrónica de venta',
        destino: 'VENTA'
      };
      
      expect(() => documentTypeSchema.parse(factura)).not.toThrow();
    });
    
    it('debe validar boleta de venta', () => {
      const boleta = {
        idEmpresa: 1,
        codigo: 'BOL',
        nombre: 'Boleta',
        descripcion: 'Boleta de venta',
        destino: 'VENTA'
      };
      
      expect(() => documentTypeSchema.parse(boleta)).not.toThrow();
    });
    
    it('debe validar factura de compra', () => {
      const facturaCompra = {
        idEmpresa: 1,
        codigo: 'FC',
        nombre: 'Factura de Compra',
        descripcion: 'Factura recibida de proveedor',
        destino: 'COMPRA'
      };
      
      expect(() => documentTypeSchema.parse(facturaCompra)).not.toThrow();
    });
    
    it('debe validar nota de crédito', () => {
      const notaCredito = {
        idEmpresa: 1,
        codigo: 'NC',
        nombre: 'Nota de Crédito',
        descripcion: 'Nota de crédito por devolución',
        destino: 'VENTA'
      };
      
      expect(() => documentTypeSchema.parse(notaCredito)).not.toThrow();
    });
    
    it('debe validar documento interno', () => {
      const interno = {
        idEmpresa: 1,
        codigo: 'GR',
        nombre: 'Guía de Remisión',
        descripcion: 'Guía de remisión interna',
        destino: 'INTERNO'
      };
      
      expect(() => documentTypeSchema.parse(interno)).not.toThrow();
    });
  });
  
  describe('defaults', () => {
    it('debe aplicar todos los defaults correctamente', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'FAC',
        nombre: 'Factura'
      };
      
      const result = documentTypeSchema.parse(data);
      expect(result.destino).toBe('VENTA');
      expect(result.activo).toBe(true);
    });
  });
});
