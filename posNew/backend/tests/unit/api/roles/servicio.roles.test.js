import { jest, describe, test, afterEach, expect, beforeAll } from '@jest/globals';
import { esquemaCrearRol, esquemaActualizarRol } from '../../../../src/api/roles/dto.roles.js';

let repositorio;
let servicio;

beforeAll(async () => {
  jest.unstable_mockModule('../../../../src/api/roles/repositorio.roles.js', () => ({
    crearRol: jest.fn(),
    obtenerTodosRoles: jest.fn(),
    obtenerRolPorId: jest.fn(),
    actualizarRol: jest.fn(),
    eliminarRol: jest.fn(),
  }));
  repositorio = await import('../../../../src/api/roles/repositorio.roles.js');
  servicio = await import('../../../../src/api/roles/servicio.roles.js');
});

describe('Servicio Roles', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('crearRol debería validar y crear un rol', async () => {
    const datos = { idEmpresa: 1, codigo: 'ADM', nombre: 'Admin', descripcion: 'Administrador' };
    const mockCreated = { id: 1, ...datos };
    repositorio.crearRol.mockResolvedValue(mockCreated);
    const result = await servicio.crearRol(datos);
    expect(result).toEqual(mockCreated);
    expect(repositorio.crearRol).toHaveBeenCalledWith({ id_empresa: 1, codigo: 'ADM', nombre: 'Admin', descripcion: 'Administrador' });
  });

  test('obtenerTodosRoles debería retornar todos los roles', async () => {
    const mockRoles = [{ id: 1, nombre: 'Admin' }];
    repositorio.obtenerTodosRoles.mockResolvedValue(mockRoles);
    const result = await servicio.obtenerTodosRoles(1);
    expect(result).toEqual(mockRoles);
    expect(repositorio.obtenerTodosRoles).toHaveBeenCalledWith(1);
  });

  test('obtenerRolPorId debería retornar el rol si existe', async () => {
    const mockRol = { id: 1, nombre: 'Admin' };
    repositorio.obtenerRolPorId.mockResolvedValue(mockRol);
    const result = await servicio.obtenerRolPorId(1);
    expect(result).toEqual(mockRol);
  });

  test('obtenerRolPorId debería lanzar error si no existe', async () => {
    repositorio.obtenerRolPorId.mockResolvedValue(null);
    await expect(servicio.obtenerRolPorId(999)).rejects.toThrow('Rol no encontrado');
  });

  test('actualizarRol debería validar y actualizar el rol', async () => {
    const datos = { nombre: 'Super Admin' };
    const mockUpdated = { id: 1, nombre: 'Super Admin' };
    repositorio.actualizarRol.mockResolvedValue(mockUpdated);
    const result = await servicio.actualizarRol(1, datos);
    expect(result).toEqual(mockUpdated);
    expect(repositorio.actualizarRol).toHaveBeenCalledWith(1, expect.objectContaining(datos));
  });
  test('eliminarRol debería eliminar el rol si existe', async () => {
    const mockRol = { id: 1 };
    repositorio.obtenerRolPorId.mockResolvedValue(mockRol);
    const mockDeleted = { id: 1, eliminado: true };
    repositorio.eliminarRol.mockResolvedValue(mockDeleted);
    const result = await servicio.eliminarRol(1);
    expect(result).toEqual(mockDeleted);
    expect(repositorio.eliminarRol).toHaveBeenCalledWith(1);
  });
});