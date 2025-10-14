import { describe, it, expect, afterEach, jest } from '@jest/globals';
const mockRepositorio = {
  obtenerTodosUsuarios: jest.fn(),
  obtenerUsuarioPorId: jest.fn(),
  actualizarUsuario: jest.fn(),
  eliminarUsuario: jest.fn(),
  obtenerUsuarioPorUsername: jest.fn(),
  crearUsuario: jest.fn()
};
jest.unstable_mockModule('../../../../src/api/usuarios/repositorio.usuarios.js', () => mockRepositorio);
jest.unstable_mockModule('../../../../src/config/baseDeDatos.js', () => ({
  default: {
    transaction: jest.fn()
  }
}));
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: { sign: jest.fn() },
}));
jest.unstable_mockModule('bcryptjs', () => ({
  default: { compare: jest.fn(), hash: jest.fn() },
}));
describe('Servicio Usuarios', () => {
  let servicio, repositorio, jwt, bcrypt, baseDeDatos;
  beforeAll(async () => {
    servicio = await import('../../../../src/api/usuarios/servicio.usuarios.js');
    repositorio = await import('../../../../src/api/usuarios/repositorio.usuarios.js');
    jwt = (await import('jsonwebtoken')).default;
    bcrypt = (await import('bcryptjs')).default;
    baseDeDatos = await import('../../../../src/config/baseDeDatos.js');
  });
  const mockUsuario = { id: 1, username: 'test', password: 'hashed', activo: true };
  afterEach(() => {
    jest.clearAllMocks();
  });
  test('crearUsuario should create user with transaction', async () => {
    const datos = { idEmpresa: 1, idRol: 1, nombreUsuario: 'test', nombres: 'Test', apellidos: 'User', correo: 'test@example.com', contrasena: 'password123', telefono: '123' };
    const mockQuery = (resolves) => {
      let index = 0;
      return jest.fn().mockImplementation(() => {
        const builder = {};
        builder.insert = jest.fn().mockReturnValue(builder);
        builder.update = jest.fn().mockReturnValue(builder);
        builder.where = jest.fn().mockReturnValue(builder);
        builder.first = jest.fn().mockReturnValue(builder);
        builder.then = (resolve) => resolve(resolves[index++]);
        return builder;
      });
    };
    const resolves = [1, mockUsuario, 1, {id:1}, 1, 1, {id:1}, 1, 1, 1, [1,2], 1];
    const trx = mockQuery(resolves);
    baseDeDatos.default.transaction.mockImplementation(async (cb) => await cb(trx));
    bcrypt.hash.mockResolvedValue('hashed');
    const result = await servicio.crearUsuario(datos);
    expect(result).toEqual(mockUsuario);
  });

  test('obtenerTodosUsuarios should return all users', async () => {
    repositorio.obtenerTodosUsuarios.mockResolvedValue([mockUsuario]);
    const result = await servicio.obtenerTodosUsuarios(1);
    expect(result).toEqual([mockUsuario]);
  });

  test('obtenerUsuarioPorId should return user by id', async () => {
    repositorio.obtenerUsuarioPorId.mockResolvedValue(mockUsuario);
    const result = await servicio.obtenerUsuarioPorId(1);
    expect(result).toEqual(mockUsuario);
  });

  test('actualizarUsuario should update user', async () => {
    repositorio.actualizarUsuario.mockResolvedValue(mockUsuario);
    const result = await servicio.actualizarUsuario(1, { nombre: 'Updated' });
    expect(result).toEqual(mockUsuario);
  });

  test('eliminarUsuario should delete user', async () => {
    repositorio.obtenerUsuarioPorId.mockResolvedValue(mockUsuario);
    repositorio.eliminarUsuario.mockResolvedValue(mockUsuario);
    const result = await servicio.eliminarUsuario(1);
    expect(result).toEqual(mockUsuario);
  });

  test('login should return token for valid credentials', async () => {
    repositorio.obtenerUsuarioPorUsername.mockResolvedValue(mockUsuario);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('token');
    const result = await servicio.login({ username: 'test', password: 'pass' });
    expect(result.token).toBe('token');
  });

  test('login should throw error for invalid credentials', async () => {
    repositorio.obtenerUsuarioPorUsername.mockResolvedValue(mockUsuario);
    bcrypt.compare.mockResolvedValue(false);
    await expect(servicio.login({ username: 'test', password: 'wrong' })).rejects.toThrow('Credenciales inválidas');
  });
});