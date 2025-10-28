import express from 'express';
import { obtenerTodosModulos, obtenerModuloPorId } from './controlador.modulos.js';
import { soloAutenticar } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para módulos
router.get('/', soloAutenticar, obtenerTodosModulos);
router.get('/:id', soloAutenticar, obtenerModuloPorId);

export default router;