import express from 'express';
import * as controlador from './controlador.usuarios.js';
import { autenticar, autorizarRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas públicas
router.post('/', controlador.crearUsuario);
router.post('/login', controlador.login);

// Rutas protegidas
router.get('/por-empresa/:idEmpresa', autenticar, autorizarRoles(['ADMIN', 'GERENTE']), controlador.obtenerTodosUsuarios);
router.get('/:id', autenticar, autorizarRoles(['ADMIN', 'GERENTE', 'EMPLEADO']), controlador.obtenerUsuarioPorId);
router.put('/:id', autenticar, autorizarRoles(['ADMIN', 'GERENTE']), controlador.actualizarUsuario);
router.delete('/:id', autenticar, autorizarRoles(['ADMIN']), controlador.eliminarUsuario);

// Ruta protegida para crear usuario por admin
router.post('/crear-por-admin', autenticar, autorizarRoles(['SUPERADMIN']), controlador.crearUsuarioPorAdmin);

export default router;