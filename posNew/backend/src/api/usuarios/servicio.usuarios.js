import { esquemaCrearUsuario, esquemaActualizarUsuario } from './dto.usuarios.js';
import * as repositorio from './repositorio.usuarios.js';
import clienteBaseDeDatos from '../../config/baseDeDatos.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Helper: map backend role name to canonical frontend role ID
function mapRolCanonico(nombre) {
  const n = (nombre || '').toLowerCase();
  if (n === 'superadmin' || n === 'super administrador') return 1;
  if (n === 'administrador' || n === 'admin') return 2;
  if (n === 'gerente' || n === 'manager') return 3;
  if (n === 'cajero' || n === 'cashier') return 4;
  return 5;
}

// Función para crear usuario con flujo atómico de registro inicial
async function crearUsuario(datos) {
  const datosValidados = esquemaCrearUsuario.parse(datos);

  try {
    const resultado = await clienteBaseDeDatos.transaction(async (trx) => {
      // Crear usuario
      const hashedPassword = await bcrypt.hash(datosValidados.contrasena, 10);
      const usuarioId = await trx('usuarios').insert({
        id_empresa: datosValidados.idEmpresa || null,
        id_rol: datosValidados.idRol,
        codigo: `USR-${Date.now()}`,
        username: datosValidados.nombreUsuario,
        nombre: `${datosValidados.nombres} ${datosValidados.apellidos}`,
        email: datosValidados.correo,
        password: hashedPassword,
        telefono: datosValidados.telefono,
        activo: true,
      });
      const usuario = await trx('usuarios').where('id', usuarioId).first();

      // Crear empresa
      const empresaId = await trx('empresa').insert({
        codigo: `EMP-${Date.now()}`,
        nombre: `Empresa de ${datosValidados.nombres} ${datosValidados.apellidos}`,
        email: datosValidados.correo,
        telefono: datosValidados.telefono,
        simbolo_moneda: '$',
      });
      const empresa = await trx('empresa').where('id', empresaId).first();

      // Actualizar usuario con id_empresa
      await trx('usuarios').where('id', usuario.id).update({ id_empresa: empresa.id });

      // Crear sucursal por defecto
      const sucursalId = await trx('sucursales').insert({
        id_empresa: empresa.id,
        codigo: 'SUC-001',
        nombre: 'Sucursal Principal',
        activo: true,
      });
      const sucursal = await trx('sucursales').where('id', sucursalId).first();

      // Crear almacén por defecto
      await trx('almacen').insert({
        id_empresa: empresa.id,
        id_sucursal: sucursal.id,
        codigo: 'ALM-001',
        nombre: 'Almacén Principal',
        default: true,
        activo: true,
      });

      // Crear caja por defecto
      await trx('caja').insert({
        id_empresa: empresa.id,
        id_sucursal: sucursal.id,
        codigo: 'CAJ-001',
        nombre: 'Caja 1',
        monto_inicial: 0.00,
        activo: true,
      });

      // Crear cliente genérico
      await trx('clientes_proveedores').insert({
        id_empresa: empresa.id,
        codigo: 'CLI-000',
        nombre: 'Cliente Genérico',
        tipo: 'CLIENTE',
        activo: true,
      });

      // Crear métodos de pago por defecto
      await trx('metodos_pago').insert([
        { id_empresa: empresa.id, codigo: 'EFEC', nombre: 'Efectivo', activo: true },
        { id_empresa: empresa.id, codigo: 'TARJ', nombre: 'Tarjeta', activo: true },
      ]);

      // Crear categoría general
      await trx('categorias').insert({
        id_empresa: empresa.id,
        codigo: 'CAT-000',
        nombre: 'General',
        activo: true,
      });

      return usuario;
    });

    return resultado;
  } catch (error) {
    throw new Error('Error en la transacción de creación de usuario: ' + error.message);
  }
}

async function obtenerTodosUsuarios(idEmpresa) {
  return await repositorio.obtenerTodosUsuarios(idEmpresa);
}

async function obtenerUsuarioPorId(id) {
  const usuario = await repositorio.obtenerUsuarioPorId(id);
  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }
  // Enriquecer con nombre de rol y normalizar id_rol a canónico para frontend
  const rol = await clienteBaseDeDatos('roles').where('id', usuario.id_rol).first();
  const idRolCanonico = mapRolCanonico(rol?.nombre);
  return { ...usuario, id_rol: idRolCanonico, rol_nombre: rol?.nombre };
}

async function actualizarUsuario(id, datos) {
  const datosValidados = esquemaActualizarUsuario.parse({ id, ...datos });
  return await repositorio.actualizarUsuario(id, datosValidados);
}

async function eliminarUsuario(id) {
  await obtenerUsuarioPorId(id); // Verifica existencia
  return await repositorio.eliminarUsuario(id);
}

// Función de login
async function login(datos) {
  const { username, password } = datos;
  const usuario = await repositorio.obtenerUsuarioPorUsername(username);

  if (!usuario || !usuario.activo) {
    throw new Error('Usuario no encontrado o inactivo');
  }

  // Determinar rol real por nombre y canónico
  const rol = await clienteBaseDeDatos('roles').where('id', usuario.id_rol).first();
  const rolCanonico = mapRolCanonico(rol?.nombre);

  if (rolCanonico === 1) { // SUPER_ADMIN
    throw new Error('Superadmins deben usar login con Google');
  }

  const passwordValida = await bcrypt.compare(password, usuario.password);
  if (!passwordValida) {
    throw new Error('Credenciales inválidas');
  }

  const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
  const token = jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      empresaId: usuario.id_empresa,
      rolId: rolCanonico,
      sucursalId: usuario.id_sucursal // Asumir que se asigna en asignaciones
    },
    jwtSecret,
    { expiresIn: '24h' }
  );

  return { token, usuario: { id: usuario.id, username: usuario.username, rol: rolCanonico } };
}

// Función para crear usuario regular por admin
async function crearUsuarioPorAdmin(datos, adminUser) {
  const { username, password, nombres, apellidos, email, telefono, id_rol } = datos;
  if (adminUser.id_rol !== 1) { // Asumir 1 es superadmin
    throw new Error('Solo superadmin puede crear usuarios');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const [userId] = await knex('usuarios').insert({
    id_empresa: adminUser.id_empresa,
    id_rol,
    username,
    password: hashedPassword,
    nombres,
    apellidos,
    email,
    telefono,
    activo: true
  });
  return await knex('usuarios').where('id', userId).first();
}

async function createSuperAdminUser(profile, trx) {
  try {
    console.log('Iniciando creación de superadmin user');
    // Validaciones de seguridad
    if (!profile.id || !profile.emails || !profile.emails[0] || !profile.name) {
      throw new Error('Datos de perfil Google incompletos');
    }

    const hashedPassword = await bcrypt.hash('default_password', 10);

    // Crear o obtener empresa existente
    let empresa = await trx('empresa').where('id_auth', profile.id).first();
    if (!empresa) {
      const empresaInsert = {
        nombre: `Empresa de ${profile.name.givenName} ${profile.name.familyName}`,
        id_fiscal: `ruc_${profile.id.substring(0,16)}`,
        id_auth: profile.id,
        id_usuario: null
      };
      const empresaId = (await trx('empresa').insert(empresaInsert))[0];
      empresa = await trx('empresa').where('id', empresaId).first();
    }

    // Crear o obtener rol Superadmin
    let rol = await trx('roles').where({ id_empresa: empresa.id, nombre: 'Superadmin' }).first();
    let rolId;
    if (!rol) {
      const rolInsert = {
        id_empresa: empresa.id,
        nombre: 'Superadmin',
        descripcion: 'Rol con todos los permisos',
        activo: true
      };
      rolId = (await trx('roles').insert(rolInsert))[0];
      rol = await trx('roles').where('id', rolId).first();
    } else {
      rolId = rol.id;
    }

    // Crear usuario (asumiendo que no existe, como se verifica en la estrategia)
    const userInsert = {
      id_auth: profile.id,
      username: profile.emails[0].value,
      email: profile.emails[0].value,
      nombres: profile.name.givenName,
      apellidos: profile.name.familyName,
      password: hashedPassword,
      id_rol: rolId,
      activo: true,
      id_empresa: empresa.id
    };
    const userId = (await trx('usuarios').insert(userInsert))[0];
    const user = await trx('usuarios').where('id', userId).first();

    // Actualizar empresa si es necesario
    if (!empresa.id_usuario) {
      await trx('empresa').where('id', empresa.id).update({ id_usuario: user.id });
    }

    // Crear o obtener sucursal
    let sucursal = await trx('sucursales').where({ id_empresa: empresa.id, codigo: '001' }).first();
    if (!sucursal) {
      const sucursalInsert = {
        id_empresa: empresa.id,
        codigo: '001',
        nombre: 'Sucursal Principal',
        activo: true
      };
      const sucursalId = (await trx('sucursales').insert(sucursalInsert))[0];
      sucursal = await trx('sucursales').where('id', sucursalId).first();
    }

    // Crear almacén si no existe
    const existingAlmacen = await trx('almacen').where({ id_empresa: empresa.id, codigo: '001' }).first();
    if (!existingAlmacen) {
      await trx('almacen').insert({
        id_empresa: empresa.id,
        id_sucursal: sucursal.id,
        codigo: '001',
        nombre: 'Almacén Principal',
        default: true,
        activo: true
      });
    }

    // Crear caja si no existe
    const existingCaja = await trx('caja').where({ id_empresa: empresa.id, codigo: '001' }).first();
    if (!existingCaja) {
      await trx('caja').insert({
        id_empresa: empresa.id,
        id_sucursal: sucursal.id,
        codigo: '001',
        nombre: 'Caja 1',
        activo: true
      });
    }

    // Crear entidades básicas si no existen
    const existingCliente = await trx('clientes_proveedores').where({ id_empresa: empresa.id, documento: '00000000' }).first();
    if (!existingCliente) {
      await trx('clientes_proveedores').insert({
        id_empresa: empresa.id,
        tipo: 'CLIENTE',
        documento: '00000000',
        tipo_documento: 'DNI',
        nombres: 'Cliente Genérico',
        activo: true
      });
    }

    for (const metodo of [
      { codigo: '001', nombre: 'Efectivo' },
      { codigo: '002', nombre: 'Tarjeta' }
    ]) {
      const existingMetodo = await trx('metodos_pago').where({ id_empresa: empresa.id, codigo: metodo.codigo }).first();
      if (!existingMetodo) {
        await trx('metodos_pago').insert({ id_empresa: empresa.id, ...metodo, activo: true });
      }
    }

    const existingCategoria = await trx('categorias').where({ id_empresa: empresa.id, codigo: '001' }).first();
    if (!existingCategoria) {
      await trx('categorias').insert({
        id_empresa: empresa.id,
        codigo: '001',
        nombre: 'General',
        activo: true
      });
    }

    // Asignar permisos completos a Superadmin sobre todos los módulos
    const modulos = await trx('modulos').where({ activo: true });
    for (const modulo of modulos) {
      const yaExiste = await trx('permisos')
        .where({ id_rol: rolId, id_modulo: modulo.id, id_empresa: empresa.id })
        .first();
      if (!yaExiste) {
        await trx('permisos').insert({
          id_empresa: empresa.id,
          id_rol: rolId,
          id_modulo: modulo.id,
          puede_ver: true,
          puede_crear: true,
          puede_editar: true,
          puede_eliminar: true,
        });
      }
    }

    console.log('Creación de superadmin completada');
    return user;
  } catch (err) {
    console.error('Error en creación de superadmin:', err);
    throw err;
  }
}

export { crearUsuario, obtenerTodosUsuarios, obtenerUsuarioPorId, actualizarUsuario, eliminarUsuario, login, crearUsuarioPorAdmin, createSuperAdminUser };