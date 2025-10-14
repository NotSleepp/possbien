import express from 'express';
import * as controlador from './controlador.inventarios.js';

const router = express.Router();

// Rutas para inventarios
router.post('/', controlador.crearInventario);
router.get('/por-sucursal/:idSucursal', controlador.obtenerTodosInventarios);
router.get('/:id', controlador.obtenerInventarioPorId);
router.put('/:id', controlador.actualizarInventario);
router.delete('/:id', controlador.eliminarInventario);

export default router;
