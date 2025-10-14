import { jest, describe, test, afterEach, expect } from '@jest/globals';

let servicio;
let controlador;

beforeAll(async () => {
  jest.unstable_mockModule('../../../../src/api/usuarios/servicio.usuarios.js', () => ({
    crearUsuario: jest.fn(),
    obtenerTodosUsuarios: jest.fn(),
    obtenerUsuarioPorId: jest.fn(),
    actualizarUsuario: jest.fn(),
    eliminarUsuario: jest.fn(),
    login: jest.fn(),
  }));

  servicio = await import('../../../../src/api/usuarios/servicio.usuarios.js');
  controlador = await import('../../../../src/api/usuarios/controlador.usuarios.js');
});

describe('Controlador Usuarios', () => {
  const mockReq = { body: {}, params: {} };
  const mockRes = { json: jest.fn() };
  mockRes.status = jest.fn().mockImplementation(() => mockRes);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('crearUsuario should create user and return 201', async () => {
    servicio.crearUsuario.mockResolvedValue({ id: 1 });
    mockReq.body = { idRol: 1, nombreUsuario: 'test' };
    await controlador.crearUsuario(mockReq, mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith({ mensaje: 'Usuario creado exitosamente', datos: { id: 1 } });
  });

  test('obtenerTodosUsuarios should return all users', async () => {
    servicio.obtenerTodosUsuarios.mockResolvedValue([{ id: 1 }]);
    mockReq.params = { idEmpresa: 1 };
    await controlador.obtenerTodosUsuarios(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith([{ id: 1 }]);
  });

  test('obtenerUsuarioPorId should return user by id', async () => {
    servicio.obtenerUsuarioPorId.mockResolvedValue({ id: 1 });
    mockReq.params = { id: 1 };
    await controlador.obtenerUsuarioPorId(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ id: 1 });
  });

  test('actualizarUsuario should update user', async () => {
    servicio.actualizarUsuario.mockResolvedValue({ id: 1 });
    mockReq.params = { id: 1 };
    mockReq.body = { nombre: 'Updated' };
    await controlador.actualizarUsuario(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ mensaje: 'Usuario actualizado exitosamente', datos: { id: 1 } });
  });

  test('eliminarUsuario should delete user', async () => {
    servicio.eliminarUsuario.mockResolvedValue({ id: 1 });
    mockReq.params = { id: 1 };
    await controlador.eliminarUsuario(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ mensaje: 'Usuario eliminado exitosamente' });
  });

  test('login should return token', async () => {
    servicio.login.mockResolvedValue({ token: 'token', usuario: { id: 1 } });
    mockReq.body = { username: 'test', password: 'pass' };
    await controlador.login(mockReq, mockRes);
    expect(mockRes.json).toHaveBeenCalledWith({ mensaje: 'Login exitoso', token: 'token', usuario: { id: 1 } });
  });
});