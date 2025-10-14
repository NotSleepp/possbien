
import { jest, describe, test, beforeAll, afterEach, expect } from '@jest/globals';
import mockKnex from 'mock-knex';
let clienteBaseDeDatos;
let repositorio;



describe('Repositorio Cajas', () => {
  let tracker;
  

  beforeAll(async () => {
    const module = await import('../../../../src/config/baseDeDatos.js');
    clienteBaseDeDatos = module.default;
    mockKnex.mock(clienteBaseDeDatos);
    repositorio = await import('../../../../src/api/cajas/repositorio.cajas.js');
  });

  beforeEach(() => {
    tracker = mockKnex.getTracker();
    tracker.install();
  });
  afterEach(() => {
    tracker.uninstall();
    jest.clearAllMocks();
  });

  test('obtenerTodasCajas should return all cajas', async () => {
    const mockCajas = [{ id: 1, nombre: 'Caja1' }];
    tracker.on('query', (query) => {
      query.response(mockCajas);
    });
    const result = await repositorio.obtenerTodasCajas(1);
    expect(result).toEqual(mockCajas);
  });

  test('obtenerCajaPorId should return caja by id', async () => {
    const mockCaja = { id: 1, nombre: 'Caja1' };
    tracker.on('query', (query) => {
      query.response(mockCaja);
    });
    const result = await repositorio.obtenerCajaPorId(1);
    expect(result).toEqual(mockCaja);
  });

  test('crearCaja should create a new caja', async () => {
    const datos = { nombre: 'Nueva Caja', id_sucursal: 1 };
    const mockCreated = { id: 1, ...datos };
    tracker.on('query', (query, step) => [
      () => query.response([1]),
      () => query.response(mockCreated)
    ][step - 1]());
    const result = await repositorio.crearCaja(datos);
    expect(result).toEqual(mockCreated);
  });

  test('actualizarCaja should update caja', async () => {
    const datos = { nombre: 'Updated Caja' };
    const mockUpdated = { id: 1, nombre: 'Updated Caja' };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockUpdated)
    ][step - 1]());
    const result = await repositorio.actualizarCaja(1, datos);
    expect(result).toEqual(mockUpdated);
  });

  test('eliminarCaja should logically delete caja', async () => {
    const mockDeleted = { id: 1, eliminado: true };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockDeleted)
    ][step - 1]());
    const result = await repositorio.eliminarCaja(1);
    expect(result).toEqual(mockDeleted);
  });
});



