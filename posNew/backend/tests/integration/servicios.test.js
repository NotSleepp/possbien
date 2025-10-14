import { jest, describe, test, expect, beforeAll, beforeEach } from '@jest/globals';

describe('Servicios - Pruebas de Integración', () => {
  let validacionesNegocio;
  let repositorioClientes;
  let repositorioProductos;
  let repositorioVentas;
  let crearCliente;
  let crearProducto;
  let crearVenta;

  beforeAll(async () => {
    await jest.unstable_mockModule('../../src/utils/validacionesNegocio.js', () => ({
      validarAccesoEmpresa: jest.fn().mockReturnValue({ esValido: true }),
      validarAccesoSucursal: jest.fn().mockReturnValue({ esValido: true }),
      validarDatosCliente: jest.fn().mockReturnValue({ esValido: true }),
      validarCodigoProductoUnico: jest.fn().mockResolvedValue({ esValido: true }),
      validarPrecios: jest.fn().mockReturnValue({ esValido: true }),
      validarStockProducto: jest.fn().mockReturnValue({ esValido: true }),
      validarVenta: jest.fn().mockReturnValue({ esValido: true }),
      validarFechaComercial: jest.fn().mockReturnValue({ esValido: true })
    }));

    await jest.unstable_mockModule('../../src/api/clientes/repositorio.clientes.js', () => ({
      crearCliente: jest.fn(),
      obtenerTodosClientes: jest.fn(),
      obtenerClientePorId: jest.fn(),
      actualizarCliente: jest.fn(),
      eliminarCliente: jest.fn()
    }));

    await jest.unstable_mockModule('../../src/api/productos/repositorio.productos.js', () => ({
      crearProducto: jest.fn(),
      obtenerTodosProductos: jest.fn(),
      obtenerProductoPorId: jest.fn(),
      obtenerPorCodigo: jest.fn(),
      actualizarProducto: jest.fn(),
      eliminarProducto: jest.fn()
    }));

    await jest.unstable_mockModule('../../src/api/ventas/repositorio.ventas.js', () => ({
      crearVenta: jest.fn(),
      obtenerTodasVentas: jest.fn(),
      obtenerVentaPorId: jest.fn(),
      actualizarVenta: jest.fn(),
      eliminarVenta: jest.fn()
    }));

    await jest.unstable_mockModule('../../src/api/clientes/dto.clientes.js', () => ({
      esquemaCrearCliente: { parse: jest.fn(data => data) },
      esquemaActualizarCliente: { parse: jest.fn(data => data) }
    }));

    await jest.unstable_mockModule('../../src/api/productos/dto.productos.js', () => ({
      esquemaCrearProducto: { parse: jest.fn(data => data) },
      esquemaActualizarProducto: { parse: jest.fn(data => data) }
    }));

    await jest.unstable_mockModule('../../src/api/ventas/dto.ventas.js', () => ({
      esquemaCrearVenta: { parse: jest.fn(data => data) },
      esquemaActualizarVenta: { parse: jest.fn(data => data) }
    }));

    validacionesNegocio = await import('../../src/utils/validacionesNegocio.js');
    repositorioClientes = await import('../../src/api/clientes/repositorio.clientes.js');
    repositorioProductos = await import('../../src/api/productos/repositorio.productos.js');
    repositorioVentas = await import('../../src/api/ventas/repositorio.ventas.js');
    ({ crearCliente } = await import('../../src/api/clientes/servicio.clientes.js'));
    ({ crearProducto } = await import('../../src/api/productos/servicio.productos.js'));
    ({ crearVenta } = await import('../../src/api/ventas/servicio.ventas.js'));
  });

  // Datos de prueba
  const usuarioMock = {
    id: 1,
    idEmpresa: 1,
    idSucursal: 1,
    nombre: 'Usuario Test'
  };

  const clienteMock = {
    id: 1,
    idEmpresa: 1,
    codigo: 'CLI001',
    nombre: 'Cliente Test',
    email: 'cliente@test.com',
    telefono: '123456789',
    direccion: 'Dirección Test'
  };

  const productoMock = {
    id: 1,
    idEmpresa: 1,
    codigo: 'PROD001',
    nombre: 'Producto Test',
    precio: 100,
    stock: 10
  };

  const ventaMock = {
    id: 1,
    idEmpresa: 1,
    idSucursal: 1,
    idCliente: 1,
    fechaVenta: '2024-01-15T10:00:00Z',
    total: 200,
    estado: 'completada',
    productos: [{
      idProducto: 1,
      cantidad: 2,
      precio: 100
    }]
  };

  beforeEach(() => {
    jest.clearAllMocks();
    validacionesNegocio.validarAccesoEmpresa.mockReturnValue({ esValido: true });
    validacionesNegocio.validarAccesoSucursal.mockReturnValue({ esValido: true });
    validacionesNegocio.validarDatosCliente.mockReturnValue({ esValido: true });
    validacionesNegocio.validarCodigoProductoUnico.mockResolvedValue({ esValido: true });
    validacionesNegocio.validarPrecios.mockReturnValue({ esValido: true });
    validacionesNegocio.validarStockProducto.mockReturnValue({ esValido: true });
    validacionesNegocio.validarVenta.mockReturnValue({ esValido: true });
    validacionesNegocio.validarFechaComercial.mockReturnValue({ esValido: true });
  });

  describe('Servicio de Clientes', () => {
    it('debería crear un cliente exitosamente', async () => {
      validacionesNegocio.validarAccesoEmpresa.mockReturnValue({ esValido: true });
      validacionesNegocio.validarDatosCliente.mockReturnValue({ esValido: true });
      repositorioClientes.crearCliente.mockResolvedValue(clienteMock);

      const resultado = await crearCliente(clienteMock, usuarioMock);

      expect(validacionesNegocio.validarAccesoEmpresa).toHaveBeenCalledWith(usuarioMock, clienteMock.idEmpresa);
      expect(validacionesNegocio.validarDatosCliente).toHaveBeenCalled();
      expect(repositorioClientes.crearCliente).toHaveBeenCalled();
      expect(resultado).toEqual(clienteMock);
    });

    it('debería rechazar cliente con validación fallida', async () => {
      validacionesNegocio.validarAccesoEmpresa.mockReturnValue({ esValido: true });
      validacionesNegocio.validarDatosCliente.mockReturnValue({ esValido: false, mensaje: 'Datos de cliente inválidos' });

      let error;
      try {
        await crearCliente(clienteMock, usuarioMock);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Datos de cliente inválidos');
      expect(validacionesNegocio.validarDatosCliente).toHaveBeenCalled();
    });

    it('debería rechazar acceso no autorizado', async () => {
      validacionesNegocio.validarAccesoEmpresa.mockReturnValue({esValido: false, mensaje: 'Acceso no autorizado'});

      let error;
      try {
        await crearCliente(clienteMock, usuarioMock);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Acceso no autorizado');
      expect(validacionesNegocio.validarAccesoEmpresa).toHaveBeenCalledWith(usuarioMock, clienteMock.idEmpresa);
    });
  });

  describe('Servicio de Productos', () => {
    it('debería crear un producto exitosamente', async () => {
      repositorioProductos.crearProducto.mockResolvedValue(productoMock);

      const resultado = await crearProducto(productoMock, usuarioMock);

      expect(validacionesNegocio.validarAccesoEmpresa).toHaveBeenCalledWith(usuarioMock, productoMock.idEmpresa);
      expect(validacionesNegocio.validarCodigoProductoUnico).toHaveBeenCalled();
      expect(repositorioProductos.crearProducto).toHaveBeenCalled();
      expect(resultado).toEqual(productoMock);
    });

    it('debería rechazar producto con código duplicado', async () => {
      validacionesNegocio.validarAccesoEmpresa.mockReturnValue({ esValido: true });
      validacionesNegocio.validarCodigoProductoUnico.mockResolvedValue({esValido: false, mensaje: 'El código del producto ya existe'});

      let error;
      try {
        await crearProducto(productoMock, usuarioMock);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('El código del producto ya existe');
      expect(validacionesNegocio.validarCodigoProductoUnico).toHaveBeenCalled();
    });

    it('debería rechazar acceso no autorizado', async () => {
      validacionesNegocio.validarAccesoEmpresa.mockReturnValue({ esValido: false, mensaje: 'Acceso no autorizado' });

      let error;
      try {
        await crearProducto(productoMock, usuarioMock);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Acceso no autorizado');
      expect(validacionesNegocio.validarAccesoEmpresa).toHaveBeenCalledWith(usuarioMock, productoMock.idEmpresa);
    });
  });

  describe('Servicio de Ventas', () => {
    it('debería crear una venta exitosamente', async () => {
      repositorioVentas.crearVenta.mockResolvedValue(ventaMock);

      const resultado = await crearVenta(ventaMock, usuarioMock);

      expect(validacionesNegocio.validarAccesoSucursal).toHaveBeenCalledWith(usuarioMock, ventaMock.idSucursal);
      expect(validacionesNegocio.validarVenta).toHaveBeenCalled();
      expect(repositorioVentas.crearVenta).toHaveBeenCalled();
      expect(resultado).toEqual(ventaMock);
    });

    it('debería rechazar venta con stock insuficiente', async () => {
      const ventaConStockInsuficiente = {
        ...ventaMock,
        productos: [{ idProducto: 1, cantidad: 20, precio: 100 }]
      };

      validacionesNegocio.validarAccesoSucursal.mockReturnValue({ esValido: true });
      validacionesNegocio.validarVenta.mockReturnValue({ esValido: true });
      validacionesNegocio.validarStockProducto.mockReturnValue({esValido: false, mensaje: 'Stock insuficiente para el producto'});

      let error;
      try {
        await crearVenta(ventaConStockInsuficiente, usuarioMock);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe('Stock insuficiente para el producto');
      expect(validacionesNegocio.validarStockProducto).toHaveBeenCalled();
    });

    it('debería rechazar acceso no autorizado a la sucursal', async () => {
      validacionesNegocio.validarAccesoSucursal.mockReturnValue({esValido: false, mensaje: 'Acceso no autorizado a la sucursal'});

      let error;
      try {
        await crearVenta(ventaMock, usuarioMock);
      } catch (e) {
        error = e;
      }

      expect(error.message).toBe('Acceso no autorizado a la sucursal');
      expect(validacionesNegocio.validarAccesoSucursal).toHaveBeenCalledWith(usuarioMock, ventaMock.idSucursal);
    });

    it('debería rechazar venta con datos inválidos', async () => {
      const ventaConDatosInvalidos = {
        ...ventaMock,
        productos: [{ idProducto: 1, cantidad: 2, precio: 100 }]
      };
      
      validacionesNegocio.validarAccesoSucursal.mockReturnValue({ esValido: true });
      validacionesNegocio.validarVenta.mockReturnValue({esValido: false, mensaje: 'Datos de venta inválidos'});

      let error;
      try {
        await crearVenta(ventaConDatosInvalidos, usuarioMock);
      } catch (e) {
        error = e;
      }

      expect(error).toBeDefined();
      expect(error.message).toBe('Datos de venta inválidos');
      expect(validacionesNegocio.validarVenta).toHaveBeenCalled();
    });
  });
});