import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from './config/passport.js';
import session from 'express-session';
import { obtenerUsuarioPorId } from './api/usuarios/servicio.usuarios.js';
import { autenticar } from './middlewares/auth.middleware.js';

// Importar el sistema de logging ANTES que cualquier otra cosa
import './utils/logger.js';
import { requestLogger, errorLogger, performanceLogger, authLogger } from './middlewares/logging.middleware.js';

// Importar middleware de manejo de errores personalizado
import { errorMiddleware } from './shared/utils/errorHandler.js';

dotenv.config();

const app = express();

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true
};

// Middlewares de logging (ANTES de otros middlewares)
app.use(requestLogger);
app.use(performanceLogger);

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: process.env.SESSION_SECRET || 'default_secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware de logging de autenticación (después de passport)
app.use(authLogger);

// Rutas de auth
app.get('/api/auth/google', (req, res, next) => {
  console.log('Iniciando autenticación Google');
  next();
}, passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/api/auth/google/callback', (req, res, next) => {
  console.log('Callback de Google recibido');
  next();
}, passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed` }),
  (req, res) => {
    try {
      console.log('Autenticación exitosa, redirigiendo con token');
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/oauth?token=${req.user.token}`);
    } catch (err) {
      console.error('Error en callback de autenticación:', err);
      res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=server_error`);
    }
  }
);

// Ruta para obtener info del usuario actual
app.get('/api/auth/me', autenticar, async (req, res, next) => {
  try {
    const usuario = await obtenerUsuarioPorId(req.user.id);
    res.json(usuario);
  } catch (error) {
    next(error);
  }
});

import usuariosRouter from './api/usuarios/rutas.usuarios.js';
import empresasRouter from './api/empresas/rutas.empresas.js';
import rolesRouter from './api/roles/rutas.roles.js';
import sucursalesRouter from './api/sucursales/rutas.sucursales.js';
import cajasRouter from './api/cajas/rutas.cajas.js';
import asignacionesCajaRouter from './api/asignaciones_caja/rutas.asignaciones_caja.js';
import categoriasRouter from './api/categorias/rutas.categorias.js';
import productosRouter from './api/productos/rutas.productos.js';
import clientesRouter from './api/clientes/rutas.clientes.js';
import proveedoresRouter from './api/proveedores/rutas.proveedores.js';
import ventasRouter from './api/ventas/rutas.ventas.js';
import detallesVentaRouter from './api/detalles_venta/rutas.detalles_venta.js';
import comprasRouter from './api/compras/rutas.compras.js';
import detallesCompraRouter from './api/detalles_compra/rutas.detalles_compra.js';
import inventariosRouter from './api/inventarios/rutas.inventarios.js';
import stocksRouter from './api/stocks/rutas.stocks.js';
import movimientosCajaRouter from './api/movimientos_caja/rutas.movimientos_caja.js';
import systemLogsRouter from './api/system_logs/rutas.system_logs.js';
import auditTrailsRouter from './api/audit_trails/rutas.audit_trails.js';
import almacenesRouter from './api/almacenes/router.almacenes.js';
import impresorasRouter from './api/impresoras/rutas.impresoras.js';
import metodosPagoRouter from './api/metodos_pago/rutas.metodos_pago.js';
import tiposComprobanteRouter from './api/tipos_comprobante/rutas.tipos_comprobante.js';
import serializacionesComprobanteRouter from './api/serializaciones_comprobante/rutas.serializaciones_comprobante.js';
import modulosRouter from './api/modulos/rutas.modulos.js';
import permisosRouter from './api/permisos/rutas.permisos.js';

app.use('/api/usuarios', usuariosRouter);
app.use('/api/empresas', empresasRouter);
app.use('/api/roles', rolesRouter);
app.use('/api/sucursales', sucursalesRouter);
app.use('/api/cajas', cajasRouter);
app.use('/api/asignaciones_caja', asignacionesCajaRouter);
app.use('/api/categorias', categoriasRouter);
app.use('/api/productos', productosRouter);
app.use('/api/clientes', clientesRouter);
app.use('/api/proveedores', proveedoresRouter);
app.use('/api/ventas', ventasRouter);
app.use('/api/detalles_venta', detallesVentaRouter);
app.use('/api/compras', comprasRouter);
app.use('/api/detalles_compra', detallesCompraRouter);
app.use('/api/inventarios', inventariosRouter);
app.use('/api/stocks', stocksRouter);
app.use('/api/movimientos_caja', movimientosCajaRouter);
app.use('/api/system_logs', systemLogsRouter);
app.use('/api/audit_trails', auditTrailsRouter);
app.use('/api/almacenes', almacenesRouter);
app.use('/api/impresoras', impresorasRouter);
app.use('/api/metodos_pago', metodosPagoRouter);
app.use('/api/tipos-comprobante', tiposComprobanteRouter);
app.use('/api/serializacion-comprobantes', serializacionesComprobanteRouter);
app.use('/api/modulos', modulosRouter);
app.use('/api/permisos', permisosRouter);

// Middleware de manejo de errores (DEBE ir al final)
app.use(errorLogger);

// Middleware de errores personalizado (ÚLTIMO en la cadena)
app.use(errorMiddleware);

export default app;