
import { jest, describe, test, beforeAll, afterEach, expect } from '@jest/globals';
import mockKnex from 'mock-knex';

let clienteBaseDeDatos;
let repositorio;

beforeAll(async () => {
  

  const module = await import('../../../../src/config/baseDeDatos.js');
  clienteBaseDeDatos = module.default;
  mockKnex.mock(clienteBaseDeDatos);
  repositorio = await import('../../../../src/api/categorias/repositorio.categorias.js');
});

describe('Repositorio Categorias', () => {
  let tracker;
  beforeEach(() => {
    tracker = mockKnex.getTracker();
    tracker.install();
  });
  afterEach(() => {
    tracker.uninstall();
    jest.clearAllMocks();
  });

  test('obtenerTodasCategorias should return all categorias', async () => {
    const mockCategorias = [{ id: 1, nombre: 'Categoria1' }];
    tracker.on('query', (query) => {
      query.response(mockCategorias);
    });
    const result = await repositorio.obtenerTodasCategorias(1);
    expect(result).toEqual(mockCategorias);
  });

  test('obtenerCategoriaPorId should return categoria by id', async () => {
    const mockCategoria = { id: 1, nombre: 'Categoria1' };
    tracker.on('query', (query) => {
      query.response(mockCategoria);
    });
    const result = await repositorio.obtenerCategoriaPorId(1);
    expect(result).toEqual(mockCategoria);
  });

  test('crearCategoria should create a new categoria', async () => {
    const datos = { nombre: 'Nueva Categoria', id_empresa: 1 };
    const mockCreated = { id: 1, ...datos };
    tracker.on('query', (query, step) => [
      () => query.response([1]),
      () => query.response(mockCreated)
    ][step - 1]());
    const result = await repositorio.crearCategoria(datos);
    expect(result).toEqual(mockCreated);
  });

  test('actualizarCategoria should update categoria', async () => {
    const datos = { nombre: 'Updated Categoria' };
    const mockUpdated = { id: 1, nombre: 'Updated Categoria' };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockUpdated)
    ][step - 1]());
    const result = await repositorio.actualizarCategoria(1, datos);
    expect(result).toEqual(mockUpdated);
  });

  test('eliminarCategoria should logically delete categoria', async () => {
    const mockDeleted = { id: 1, eliminado: true };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockDeleted)
    ][step - 1]());
    const result = await repositorio.eliminarCategoria(1);
    expect(result).toEqual(mockDeleted);
  });
});



