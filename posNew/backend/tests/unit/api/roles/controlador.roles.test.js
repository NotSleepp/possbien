import { jest, describe, test, expect, beforeAll, afterEach } from '@jest/globals';
let controlador;
let servicio;

beforeAll(async () => {
  jest.unstable_mockModule('../../../../src/api/roles/servicio.roles.js', () => ({
    crearRol: jest.fn(),
    obtenerTodosRoles: jest.fn(),
    obtenerRolPorId: jest.fn(),
    actualizarRol: jest.fn(),
    eliminarRol: jest.fn(),
  }));
  const controllerModule = await import('../../../../src/api/roles/controlador.roles.js');
  controlador = controllerModule;
  servicio = await import('../../../../src/api/roles/servicio.roles.js');
});

describe('Controlador Roles', () => {
  let req, res, next;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
    jest.clearAllMocks();
  });

  test('crearRol debería crear un rol y retornar 201', async () => {
    const mockRol = { id: 1, nombre: 'Admin' };
    servicio.crearRol.mockResolvedValue(mockRol);
    req.body = { nombre: 'Admin', id_empresa: 1 };
    await controlador.crearRol(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Rol creado exitosamente', datos: mockRol });
  });

  test('crearRol debería llamar next en error', async () => {
    const error = new Error('Error');
    servicio.crearRol.mockRejectedValue(error);
    await controlador.crearRol(req, res, next);
    expect(next).toHaveBeenCalledWith(error);
  });

  test('obtenerTodosRoles debería retornar todos los roles', async () => {
    const mockRoles = [{ id: 1, nombre: 'Admin' }];
    servicio.obtenerTodosRoles.mockResolvedValue(mockRoles);
    req.params.idEmpresa = '1';
    await controlador.obtenerTodosRoles(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockRoles);
  });

  test('obtenerRolPorId debería retornar el rol', async () => {
    const mockRol = { id: 1, nombre: 'Admin' };
    servicio.obtenerRolPorId.mockResolvedValue(mockRol);
    req.params.id = '1';
    await controlador.obtenerRolPorId(req, res, next);
    expect(res.json).toHaveBeenCalledWith(mockRol);
  });

  test('actualizarRol debería actualizar y retornar mensaje', async () => {
    const mockUpdated = { id: 1, nombre: 'Super Admin' };
    servicio.actualizarRol.mockResolvedValue(mockUpdated);
    req.params.id = '1';
    req.body = { nombre: 'Super Admin', id_empresa: 1 };
    await controlador.actualizarRol(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Rol actualizado exitosamente', datos: mockUpdated });
  });

  test('eliminarRol debería eliminar y retornar mensaje', async () => {
    servicio.eliminarRol.mockResolvedValue();
    req.params.id = '1';
    await controlador.eliminarRol(req, res, next);
    expect(res.json).toHaveBeenCalledWith({ mensaje: 'Rol eliminado exitosamente' });
  });
});