import { jest, describe, test, beforeAll, afterEach, expect } from '@jest/globals';
import mockKnex from 'mock-knex';

let repositorio;
let clienteBaseDeDatos;

beforeAll(async () => {
  

  const module = await import('../../../../src/config/baseDeDatos.js');
  clienteBaseDeDatos = module.default;
  mockKnex.mock(clienteBaseDeDatos);
  repositorio = await import('../../../../src/api/usuarios/repositorio.usuarios.js');
});

describe('Repositorio Usuarios', () => {
  let tracker;
  beforeEach(() => {
    tracker = mockKnex.getTracker();
    tracker.install();
  });
  afterEach(() => {
    tracker.uninstall();
    jest.clearAllMocks();
  });

  test('obtenerTodosUsuarios should return all usuarios', async () => {
    const mockUsuarios = [{ id: 1, nombre: 'Usuario1' }];
    tracker.on('query', (query) => {
      query.response(mockUsuarios);
    });
    const result = await repositorio.obtenerTodosUsuarios(1);
    expect(result).toEqual(mockUsuarios);
  });

  test('obtenerUsuarioPorId should return usuario by id', async () => {
    const mockUsuario = { id: 1, nombre: 'Usuario1' };
    tracker.on('query', (query) => {
      query.response(mockUsuario);
    });
    const result = await repositorio.obtenerUsuarioPorId(1);
    expect(result).toEqual(mockUsuario);
  });

  test('crearUsuario should create a new usuario', async () => {
    const mockData = { nombre: 'NuevoUsuario' };
    const mockUsuario = { id: 1, ...mockData };
    tracker.on('query', (query, step) => [
      () => query.response([1]),
      () => query.response(mockUsuario)
    ][step - 1]());
    const result = await repositorio.crearUsuario(mockData);
    expect(result).toEqual(mockUsuario);
  });

  test('actualizarUsuario should update usuario', async () => {
    const mockData = { nombre: 'UsuarioActualizado' };
    const mockUsuario = { id: 1, ...mockData };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockUsuario)
    ][step - 1]());
    const result = await repositorio.actualizarUsuario(1, mockData);
    expect(result).toEqual(mockUsuario);
  });

  test('eliminarUsuario should logically delete usuario', async () => {
    const mockDeleted = { id: 1, eliminado: true, fecha_eliminacion: new Date() };
    tracker.on('query', (query, step) => [
      () => query.response(1),
      () => query.response(mockDeleted)
    ][step - 1]());
    const result = await repositorio.eliminarUsuario(1);
    expect(result.eliminado).toBe(true);
  });
});