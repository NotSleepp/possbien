import express from 'express';
import * as controlador from './controlador.detalles_compra.js';

const router = express.Router();

// Rutas para detalles de compra
router.post('/', controlador.crearDetalleCompra);
router.get('/por-compra/:idCompra', controlador.obtenerTodosDetallesCompra);
router.get('/:id', controlador.obtenerDetalleCompraPorId);
router.put('/:id', controlador.actualizarDetalleCompra);
router.delete('/:id', controlador.eliminarDetalleCompra);

export default router;
