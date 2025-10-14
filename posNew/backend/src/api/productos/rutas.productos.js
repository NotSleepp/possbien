import express from 'express';
import * as controlador from './controlador.productos.js';

const router = express.Router();

// Rutas para productos
router.post('/', controlador.crearProducto);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodosProductos);
router.get('/:id', controlador.obtenerProductoPorId);
router.put('/:id', controlador.actualizarProducto);
router.delete('/:id', controlador.eliminarProducto);

export default router;
