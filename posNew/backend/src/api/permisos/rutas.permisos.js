import express from 'express';
import * as controlador from './controlador.permisos.js';
import { autenticar, autorizarRoles } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas protegidas para permisos
router.get('/por-rol/:idRol', autenticar, autorizarRoles(['SUPERADMIN']), controlador.obtenerPermisosPorRol);
router.get('/modulos', autenticar, autorizarRoles(['SUPERADMIN']), controlador.obtenerModulos);
router.post('/actualizar-masivo', autenticar, autorizarRoles(['SUPERADMIN']), controlador.actualizarPermisosMasivo);

// Rutas legacy (mantener por compatibilidad)
router.post('/', autenticar, autorizarRoles(['SUPERADMIN']), controlador.asignarPermiso);
router.put('/:id', autenticar, autorizarRoles(['SUPERADMIN']), controlador.actualizarPermiso);
router.delete('/:id', autenticar, autorizarRoles(['SUPERADMIN']), controlador.eliminarPermiso);

export default router;