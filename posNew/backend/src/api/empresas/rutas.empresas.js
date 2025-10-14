import express from 'express';
import * as controlador from './controlador.empresas.js';

const router = express.Router();

// Rutas para empresas
router.post('/', controlador.crearEmpresa);
router.get('/', controlador.obtenerTodasEmpresas);
router.get('/:id', controlador.obtenerEmpresaPorId);
router.put('/:id', controlador.actualizarEmpresa);
router.delete('/:id', controlador.eliminarEmpresa);

export default router;