import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import {
  validarStockProducto,
  validarAccesoEmpresa,
  validarAccesoSucursal,
  validarVenta,
  validarPrecios,
  validarFechaComercial,
  validarCodigoProductoUnico,
  validarDatosCliente
} from '../../../src/utils/validacionesNegocio.js';
import * as repositorioProductos from '../../../src/api/productos/repositorio.productos.js';

// Mock del repositorio
jest.mock('../../../src/api/productos/repositorio.productos.js');

describe('Validaciones de Negocio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validarStockProducto', () => {
    it('debería validar stock suficiente correctamente', async () => {
      const producto = {
        id: 1,
        stock: 100,
        stockMinimo: 10
      };
      const cantidadSolicitada = 50;

      const resultado = await validarStockProducto(producto, cantidadSolicitada);

      expect(resultado.esValido).toBe(true);
      expect(resultado.mensaje).toBe('Stock suficiente');
    });

    it('debería detectar stock insuficiente', async () => {
      const producto = {
        id: 1,
        stock: 10,
        stockMinimo: 5
      };
      const cantidadSolicitada = 15;

      const resultado = await validarStockProducto(producto, cantidadSolicitada);

      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toContain('Stock insuficiente');
    });

    it('debería alertar sobre stock mínimo', async () => {
      const producto = {
        id: 1,
        stock: 20,
        stockMinimo: 15
      };
      const cantidadSolicitada = 10;

      const resultado = await validarStockProducto(producto, cantidadSolicitada);

      expect(resultado.esValido).toBe(true);
      expect(resultado.advertencia).toBe(true);
    });
  });

  describe('validarAccesoEmpresa', () => {
    it('debería permitir acceso a empresa válida', async () => {
      const usuario = {
        id: 1,
        empresaId: 5,
        rol: 'ADMINISTRADOR'
      };
      const idEmpresa = 5;

      const resultado = await validarAccesoEmpresa(usuario, idEmpresa);

      expect(resultado.esValido).toBe(true);
    });

    it('debería denegar acceso a empresa diferente', async () => {
      const usuario = {
        id: 1,
        empresaId: 5,
        rol: 'EMPLEADO'
      };
      const idEmpresa = 10;

      const resultado = await validarAccesoEmpresa(usuario, idEmpresa);

      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toContain('No tienes acceso a esta empresa');
    });

    it('debería denegar acceso cuando usuario no tiene empresa', async () => {
      const usuario = {};
      const empresaId = 1;

      const resultado = await validarAccesoEmpresa(usuario, empresaId);

      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toContain('Usuario sin empresa asignada');
    });
  });

  describe('validarVenta', () => {
    it('debería validar venta correcta', async () => {
      const datosVenta = {
        total: 250,
        metodoPago: 'efectivo',
        montoPagado: 300
      };
      const productos = [
        { id: 1, cantidad: 2, precio: 100 },
        { id: 2, cantidad: 1, precio: 50 }
      ];

      const resultado = await validarVenta(datosVenta, productos);

      expect(resultado.esValido).toBe(true);
    });

    it('debería detectar total incorrecto', async () => {
      const datosVenta = {
        total: 150, // Debería ser 200
        metodoPago: 'efectivo',
        montoPagado: 200
      };
      const productos = [
        { id: 1, cantidad: 2, precio: 100 }
      ];

      const resultado = await validarVenta(datosVenta, productos);

      expect(resultado.esValido).toBe(false);
      expect(resultado.errores).toContain('El total de la venta no coincide con la suma de los productos');
    });

    it('debería detectar pago insuficiente', async () => {
      const datosVenta = {
        total: 100,
        metodoPago: 'efectivo',
        montoPagado: 80
      };
      const productos = [
        { id: 1, cantidad: 1, precio: 100 }
      ];

      const resultado = await validarVenta(datosVenta, productos);

      expect(resultado.esValido).toBe(false);
      expect(resultado.errores).toContain('El monto pagado es insuficiente');
    });
  });

  describe('validarPrecios', () => {
    it('debería validar precios correctos', async () => {
      const precioCompra = 50;
      const precioVenta = 80;

      const resultado = await validarPrecios(precioCompra, precioVenta);

      expect(resultado.esValido).toBe(true);
    });

    it('debería detectar precio de venta menor al de compra', async () => {
      const precioCompra = 100;
      const precioVenta = 80;

      const resultado = await validarPrecios(precioCompra, precioVenta);

      expect(resultado.esValido).toBe(true); // No es error, solo advertencia
      expect(resultado.advertencias).toContain('El precio de venta es menor o igual al precio de compra');
    });

    it('debería alertar sobre margen bajo', async () => {
      const precioCompra = 100;
      const precioVenta = 105;

      const resultado = await validarPrecios(precioCompra, precioVenta);

      expect(resultado.esValido).toBe(true);
      expect(resultado.advertencias.length).toBeGreaterThan(0);
    });
  });

  describe('validarFechaComercial', () => {
    it('debería validar fecha actual', async () => {
      const fecha = new Date();

      const resultado = await validarFechaComercial(fecha);

      expect(resultado.esValido).toBe(true);
    });

    it('debería rechazar fecha muy antigua', async () => {
      const fecha = new Date('2020-01-01');

      const resultado = await validarFechaComercial(fecha);

      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toContain('La fecha no puede ser anterior a un año');
    });

    it('debería rechazar fecha futura cuando no está permitida', async () => {
      const fecha = new Date();
      fecha.setDate(fecha.getDate() + 10);

      const resultado = await validarFechaComercial(fecha);

      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toContain('No se permiten fechas futuras');
    });
  });

  describe('validarCodigoProductoUnico', () => {
    it('debería validar código único correctamente', async () => {
      const mockVerificarCodigo = jest.fn().mockResolvedValue(null);
      const codigo = 'PROD001';
      const empresaId = 1;

      const resultado = await validarCodigoProductoUnico(codigo, empresaId, null, mockVerificarCodigo);

      expect(resultado.esValido).toBe(true);
      expect(mockVerificarCodigo).toHaveBeenCalledWith('PROD001', 1);
    });

    it('debería detectar código duplicado', async () => {
      const mockVerificarCodigo = jest.fn().mockResolvedValue({ id: 2 });

      const resultado = await validarCodigoProductoUnico('PROD001', 1, null, mockVerificarCodigo);

      expect(resultado.esValido).toBe(false);
      expect(resultado.mensaje).toContain('Ya existe un producto con este código');
    });

    it('debería permitir mismo código para actualización', async () => {
      const mockVerificarCodigo = jest.fn().mockResolvedValue({ id: 1 });

      const resultado = await validarCodigoProductoUnico('PROD001', 1, 1, mockVerificarCodigo);

      expect(resultado.esValido).toBe(true);
    });
  });

  describe('validarDatosCliente', () => {
    it('debería validar datos de cliente correctos', async () => {
      const datosCliente = {
        nombre: 'Juan Pérez',
        email: 'juan@email.com',
        telefono: '123456789',
        documento: '12345678'
      };

      const resultado = await validarDatosCliente(datosCliente);

      expect(resultado.esValido).toBe(true);
    });

    it('debería detectar email inválido', async () => {
      const datosCliente = {
        nombre: 'Juan Pérez',
        email: 'email-invalido',
        telefono: '123456789'
      };

      const resultado = await validarDatosCliente(datosCliente);

      expect(resultado.esValido).toBe(false);
      expect(resultado.errores).toContain('El formato del email no es válido');
    });

    it('debería detectar nombre muy corto', async () => {
      const datosCliente = {
        nombre: 'A',
        email: 'juan@email.com'
      };

      const resultado = await validarDatosCliente(datosCliente);

      expect(resultado.esValido).toBe(false);
      expect(resultado.errores).toContain('El nombre debe tener al menos 2 caracteres');
    });
  });
});