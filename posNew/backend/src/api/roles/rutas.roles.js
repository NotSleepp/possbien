import express from 'express';
import * as controlador from './controlador.roles.js';

const router = express.Router();

// Rutas para roles
router.post('/', controlador.crearRol);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodosRoles);
router.get('/:id', controlador.obtenerRolPorId);
router.put('/:id', controlador.actualizarRol);
router.delete('/:id', controlador.eliminarRol);

export default router;