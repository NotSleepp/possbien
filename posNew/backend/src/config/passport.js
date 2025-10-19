import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import clienteBaseDeDatos from './baseDeDatos.js';
import { createSuperAdminUser } from '../api/usuarios/servicio.usuarios.js';

// Helper: map backend role name to canonical frontend role ID
function mapRolCanonico(nombre) {
  const n = (nombre || '').toLowerCase();
  if (n === 'superadmin' || n === 'super administrador') return 1;
  if (n === 'administrador' || n === 'admin') return 2;
  if (n === 'gerente' || n === 'manager') return 3;
  if (n === 'cajero' || n === 'cashier') return 4;
  return 5; // empleado u otros
}

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/api/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const trx = await clienteBaseDeDatos.transaction();
    try {
      console.log('Iniciando autenticación Google para profile:', profile.id);
      let user = await trx('usuarios').where('id_auth', profile.id).first();
      if (!user) {
        console.log('Usuario no encontrado, iniciando creación de nuevo usuario');
        user = await createSuperAdminUser(profile, trx);
        await trx.commit();
        console.log('Transacción completada exitosamente para nuevo usuario');
      } else {
        console.log('Usuario existente encontrado:', user.id);
        await trx.commit();
      }

      // Obtener rol real desde DB y mapear a ID canónico
      const rol = await clienteBaseDeDatos('roles').where('id', user.id_rol).first();
      const rolCanonico = mapRolCanonico(rol?.nombre);

      const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
      const token = jwt.sign({ id: user.id, empresaId: user.id_empresa, rolId: rolCanonico }, jwtSecret, { expiresIn: '24h' });
      console.log('Token JWT generado para usuario:', user.id);
      done(null, { user, token });
    } catch (err) {
      await trx.rollback();
      console.error('Error en transacción de autenticación:', err);
      done(err);
    }
  } catch (err) {
    console.error('Error general en autenticación Google:', err);
    done(err);
  }
}));

passport.serializeUser((obj, done) => done(null, obj.user.id));
passport.deserializeUser(async (id, done) => {
  const user = await clienteBaseDeDatos('usuarios').where('id', id).first();
  done(null, user);
});

export default passport;