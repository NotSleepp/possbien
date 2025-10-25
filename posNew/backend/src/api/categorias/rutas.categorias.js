import express from 'express';
import * as controlador from './controlador.categorias.js';
import { seguridadMultiTenant, soloAutenticar } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para categorias
router.post('/', seguridadMultiTenant, controlador.crearCategoria);
router.get('/por-empresa/:idEmpresa', soloAutenticar, controlador.obtenerTodasCategorias);
router.get('/:id', soloAutenticar, controlador.obtenerCategoriaPorId);
router.put('/:id', seguridadMultiTenant, controlador.actualizarCategoria);
router.delete('/:id', soloAutenticar, controlador.eliminarCategoria);

export default router;
