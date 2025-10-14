import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import clienteBaseDeDatos from './baseDeDatos.js';
import { createSuperAdminUser } from '../api/usuarios/servicio.usuarios.js';

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
      }
      const jwtSecret = process.env.JWT_SECRET || 'default_jwt_secret';
      const token = jwt.sign({ id: user.id, empresaId: user.id_empresa, rolId: user.id_rol }, jwtSecret, { expiresIn: '24h' });
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