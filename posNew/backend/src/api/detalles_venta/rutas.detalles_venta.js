import express from 'express';
import * as controlador from './controlador.detalles_venta.js';

const router = express.Router();

// Rutas para detalles de venta
router.post('/', controlador.crearDetalleVenta);
router.get('/por-venta/:idVenta', controlador.obtenerTodosDetallesVenta);
router.get('/:id', controlador.obtenerDetalleVentaPorId);
router.put('/:id', controlador.actualizarDetalleVenta);
router.delete('/:id', controlador.eliminarDetalleVenta);

export default router;
