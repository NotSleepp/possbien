import express from 'express';
import * as controlador from './controlador.categorias.js';

const router = express.Router();

// Rutas para categorias
router.post('/', controlador.crearCategoria);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodasCategorias);
router.get('/:id', controlador.obtenerCategoriaPorId);
router.put('/:id', controlador.actualizarCategoria);
router.delete('/:id', controlador.eliminarCategoria);

export default router;
