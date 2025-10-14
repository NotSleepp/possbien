
import { jest, describe, test, beforeAll, afterEach, expect } from '@jest/globals';
import mockKnex from 'mock-knex';

let clienteBaseDeDatos;
let repositorio;

beforeAll(async () => {
  

  const module = await import('../../../../src/config/baseDeDatos.js');
  clienteBaseDeDatos = module.default;
  mockKnex.mock(clienteBaseDeDatos);
  repositorio = await import('../../../../src/api/productos/repositorio.productos.js');
});

describe('Repositorio Productos', () => {
  let tracker;
  beforeEach(() => {
    tracker = mockKnex.getTracker();
    tracker.install();
  });
  afterEach(() => {
    tracker.uninstall();
    jest.clearAllMocks();
  });

  test('obtenerTodosProductos should return all productos', async () => {
    const mockProductos = [{ id: 1, nombre: 'Producto1' }];
    tracker.on('query', (query) => {
      query.response(mockProductos);
    });
    const result = await repositorio.obtenerTodosProductos(1);
    expect(result).toEqual(mockProductos);
  });

  test('obtenerProductoPorId should return product by id', async () => {
    const mockProducto = { id: 1, nombre: 'Producto1' };
    tracker.on('query', (query) => {
      query.response(mockProducto);
    });
    const result = await repositorio.obtenerProductoPorId(1);
    expect(result).toEqual(mockProducto);
  });

  test('obtenerPorCodigo should return product by codigo', async () => {
    const mockProducto = { id: 1, nombre: 'Producto1' };
    tracker.on('query', (query) => {
      query.response(mockProducto);
    });
    const result = await repositorio.obtenerPorCodigo('COD1', 1);
    expect(result).toEqual(mockProducto);
  });

  test('crearProducto should create a new product', async () => {
    const datos = { nombre: 'Nuevo Producto', id_empresa: 1 };
    const mockCreated = { id: 1, ...datos };
    tracker.on('query', (query, step) => [
      () => query.response([1]),
      () => query.response(mockCreated)
    ][step - 1]());
    const result = await repositorio.crearProducto(datos);
    expect(result).toEqual(mockCreated);
  });

  test('actualizarProducto should update product', async () => {
    const datos = { nombre: 'Updated Producto' };
    const mockUpdated = { id: 1, nombre: 'Updated Producto' };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockUpdated)
    ][step - 1]());
    const result = await repositorio.actualizarProducto(1, datos);
    expect(result).toEqual(mockUpdated);
  });

  test('eliminarProducto should logically delete product', async () => {
    const mockDeleted = { id: 1, eliminado: true };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockDeleted)
    ][step - 1]());
    const result = await repositorio.eliminarProducto(1);
    expect(result).toEqual(mockDeleted);
  });
});



