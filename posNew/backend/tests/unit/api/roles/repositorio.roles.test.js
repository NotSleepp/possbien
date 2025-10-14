
import { jest, describe, test, beforeAll, afterEach, expect } from '@jest/globals';
import mockKnex from 'mock-knex';

let repositorio;
let clienteBaseDeDatos;

beforeAll(async () => {
  

  const module = await import('../../../../src/config/baseDeDatos.js');
  clienteBaseDeDatos = module.default;
  mockKnex.mock(clienteBaseDeDatos);
  repositorio = await import('../../../../src/api/roles/repositorio.roles.js');
});

describe('Repositorio Roles', () => {
  let tracker;
  beforeEach(() => {
    tracker = mockKnex.getTracker();
    tracker.install();
  });
  afterEach(() => {
    tracker.uninstall();
    jest.clearAllMocks();
  });

  test('obtenerTodosRoles debería retornar todos los roles', async () => {
    const mockRoles = [{ id: 1, nombre: 'Admin' }];
    tracker.on('query', (query) => {
      query.response(mockRoles);
    });
    const result = await repositorio.obtenerTodosRoles(1);
    expect(result).toEqual(mockRoles);
  });

  test('obtenerRolPorId debería retornar el rol por ID', async () => {
    const mockRol = { id: 1, nombre: 'Admin' };
    tracker.on('query', (query) => {
      query.response(mockRol);
    });
    const result = await repositorio.obtenerRolPorId(1);
    expect(result).toEqual(mockRol);
  });

  test('crearRol debería crear un nuevo rol', async () => {
    const datos = { nombre: 'User', descripcion: 'Usuario estándar' };
    const mockCreated = { id: 2, ...datos };
    tracker.on('query', (query, step) => {
      if (step === 1) {
        query.response([2]);
      } else if (step === 2) {
        query.response(mockCreated);
      }
    });
    const result = await repositorio.crearRol(datos);
    expect(result).toEqual(mockCreated);
  });

  test('actualizarRol debería actualizar el rol', async () => {
    const datos = { nombre: 'Super Admin' };
    const mockUpdated = { id: 1, nombre: 'Super Admin' };
    tracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(1);
      } else if (step === 2) {
        query.response(mockUpdated);
      }
    });
    const result = await repositorio.actualizarRol(1, datos);
    expect(result).toEqual(mockUpdated);
  });

  test('eliminarRol debería eliminar el rol lógicamente', async () => {
    const mockDeleted = { id: 1, eliminado: true };
    tracker.on('query', (query, step) => {
      if (step === 1) {
        query.response(1);
      } else if (step === 2) {
        query.response(mockDeleted);
      }
    });
    const result = await repositorio.eliminarRol(1);
    expect(result).toEqual(mockDeleted);
  });
});






