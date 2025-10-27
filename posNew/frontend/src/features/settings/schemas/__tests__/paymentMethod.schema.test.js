import { describe, it, expect } from 'vitest';
import { paymentMethodSchema } from '../paymentMethod.schema';

describe('paymentMethodSchema', () => {
  describe('validaciones básicas', () => {
    it('debe validar datos correctos completos', () => {
      const validData = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        descripcion: 'Pago en efectivo',
        imagen: '/images/efectivo.png',
        requiereReferencia: false,
        activo: true
      };
      
      expect(() => paymentMethodSchema.parse(validData)).not.toThrow();
    });
    
    it('debe validar datos mínimos requeridos', () => {
      const minimalData = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo'
      };
      
      const result = paymentMethodSchema.parse(minimalData);
      expect(result.requiereReferencia).toBe(false); // Default
      expect(result.activo).toBe(true); // Default
    });
    
    it('debe rechazar codigo vacío', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: '',
        nombre: 'Efectivo'
      };
      
      expect(() => paymentMethodSchema.parse(invalidData)).toThrow('El código es requerido');
    });
    
    it('debe rechazar nombre vacío', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: ''
      };
      
      expect(() => paymentMethodSchema.parse(invalidData)).toThrow('El nombre es requerido');
    });
    
    it('debe rechazar codigo que excede 10 caracteres', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: 'CODIGO12345',
        nombre: 'Efectivo'
      };
      
      expect(() => paymentMethodSchema.parse(invalidData)).toThrow('no puede superar 10 caracteres');
    });
    
    it('debe rechazar nombre que excede 100 caracteres', () => {
      const invalidData = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'a'.repeat(101)
      };
      
      expect(() => paymentMethodSchema.parse(invalidData)).toThrow('no puede superar 100 caracteres');
    });
    
    it('debe rechazar idEmpresa inválido', () => {
      const invalidData = {
        idEmpresa: -1,
        codigo: 'EF',
        nombre: 'Efectivo'
      };
      
      expect(() => paymentMethodSchema.parse(invalidData)).toThrow();
    });
  });
  
  describe('validación de campos opcionales', () => {
    it('debe aceptar descripcion vacía', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        descripcion: ''
      };
      
      expect(() => paymentMethodSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar descripcion que excede 1000 caracteres', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        descripcion: 'a'.repeat(1001)
      };
      
      expect(() => paymentMethodSchema.parse(data)).toThrow('no puede superar 1000 caracteres');
    });
    
    it('debe aceptar imagen vacía', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        imagen: ''
      };
      
      expect(() => paymentMethodSchema.parse(data)).not.toThrow();
    });
    
    it('debe rechazar imagen que excede 255 caracteres', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        imagen: 'a'.repeat(256)
      };
      
      expect(() => paymentMethodSchema.parse(data)).toThrow('no puede superar 255 caracteres');
    });
    
    it('debe aceptar URL de imagen válida', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        imagen: 'https://example.com/images/efectivo.png'
      };
      
      expect(() => paymentMethodSchema.parse(data)).not.toThrow();
    });
  });
  
  describe('validación de requiereReferencia', () => {
    it('debe aceptar requiereReferencia como true', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'TC',
        nombre: 'Tarjeta de Crédito',
        requiereReferencia: true
      };
      
      expect(() => paymentMethodSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar requiereReferencia como false', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        requiereReferencia: false
      };
      
      expect(() => paymentMethodSchema.parse(data)).not.toThrow();
    });
    
    it('debe aplicar default false cuando no se especifica', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo'
      };
      
      const result = paymentMethodSchema.parse(data);
      expect(result.requiereReferencia).toBe(false);
    });
  });
  
  describe('validación de activo', () => {
    it('debe aceptar activo como true', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        activo: true
      };
      
      expect(() => paymentMethodSchema.parse(data)).not.toThrow();
    });
    
    it('debe aceptar activo como false', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        activo: false
      };
      
      expect(() => paymentMethodSchema.parse(data)).not.toThrow();
    });
    
    it('debe aplicar default true cuando no se especifica', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo'
      };
      
      const result = paymentMethodSchema.parse(data);
      expect(result.activo).toBe(true);
    });
  });
  
  describe('casos de uso reales', () => {
    it('debe validar método de pago en efectivo', () => {
      const efectivo = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo',
        descripcion: 'Pago en efectivo al momento de la compra',
        requiereReferencia: false
      };
      
      expect(() => paymentMethodSchema.parse(efectivo)).not.toThrow();
    });
    
    it('debe validar método de pago con tarjeta', () => {
      const tarjeta = {
        idEmpresa: 1,
        codigo: 'TC',
        nombre: 'Tarjeta de Crédito',
        descripcion: 'Pago con tarjeta de crédito o débito',
        requiereReferencia: true,
        imagen: '/images/tarjeta.png'
      };
      
      expect(() => paymentMethodSchema.parse(tarjeta)).not.toThrow();
    });
    
    it('debe validar método de pago con transferencia', () => {
      const transferencia = {
        idEmpresa: 1,
        codigo: 'TRANS',
        nombre: 'Transferencia Bancaria',
        descripcion: 'Transferencia electrónica',
        requiereReferencia: true
      };
      
      expect(() => paymentMethodSchema.parse(transferencia)).not.toThrow();
    });
    
    it('debe validar método de pago desactivado', () => {
      const desactivado = {
        idEmpresa: 1,
        codigo: 'CHQ',
        nombre: 'Cheque',
        descripcion: 'Pago con cheque (desactivado)',
        activo: false
      };
      
      expect(() => paymentMethodSchema.parse(desactivado)).not.toThrow();
    });
  });
  
  describe('defaults', () => {
    it('debe aplicar todos los defaults correctamente', () => {
      const data = {
        idEmpresa: 1,
        codigo: 'EF',
        nombre: 'Efectivo'
      };
      
      const result = paymentMethodSchema.parse(data);
      expect(result.requiereReferencia).toBe(false);
      expect(result.activo).toBe(true);
    });
  });
});
