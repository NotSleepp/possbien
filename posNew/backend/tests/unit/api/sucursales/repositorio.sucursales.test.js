
import { jest, describe, test, beforeAll, afterEach, expect } from '@jest/globals';
import mockKnex from 'mock-knex';

let repositorio;
let clienteBaseDeDatos;

beforeAll(async () => {
  

  const module = await import('../../../../src/config/baseDeDatos.js');
  clienteBaseDeDatos = module.default;
  mockKnex.mock(clienteBaseDeDatos);
  repositorio = await import('../../../../src/api/sucursales/repositorio.sucursales.js');
});

describe('Repositorio Sucursales', () => {
  let tracker;
  beforeEach(() => {
    tracker = mockKnex.getTracker();
    tracker.install();
  });
  afterEach(() => {
    tracker.uninstall();
    jest.clearAllMocks();
  });

  test('obtenerTodasSucursales should return all sucursales', async () => {
    const mockSucursales = [{ id: 1, nombre: 'Sucursal1' }];
    tracker.on('query', (query) => {
      query.response(mockSucursales);
    });
    const result = await repositorio.obtenerTodasSucursales(1);
    expect(result).toEqual(mockSucursales);
  });

  test('obtenerSucursalPorId should return sucursal by id', async () => {
    const mockSucursal = { id: 1, nombre: 'Sucursal1' };
    tracker.on('query', (query) => {
      query.response(mockSucursal);
    });
    const result = await repositorio.obtenerSucursalPorId(1);
    expect(result).toEqual(mockSucursal);
  });

  test('crearSucursal should create a new sucursal', async () => {
    const datos = { nombre: 'Nueva Sucursal', id_empresa: 1 };
    const mockCreated = { id: 1, ...datos };
    tracker.on('query', (query, step) => [
      () => query.response([1]),
      () => query.response(mockCreated)
    ][step - 1]());
    const result = await repositorio.crearSucursal(datos);
    expect(result).toEqual(mockCreated);
  });

  test('actualizarSucursal should update sucursal', async () => {
    const datos = { nombre: 'Updated Sucursal' };
    const mockUpdated = { id: 1, nombre: 'Updated Sucursal' };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockUpdated)
    ][step - 1]());
    const result = await repositorio.actualizarSucursal(1, datos);
    expect(result).toEqual(mockUpdated);
  });

  test('eliminarSucursal should logically delete sucursal', async () => {
    const mockDeleted = { id: 1, eliminado: true };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockDeleted)
    ][step - 1]());
    const result = await repositorio.eliminarSucursal(1);
    expect(result).toEqual(mockDeleted);
  });
});



