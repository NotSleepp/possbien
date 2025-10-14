import express from 'express';
import * as controlador from './controlador.ventas.js';

const router = express.Router();

// Rutas para ventas
router.post('/', controlador.crearVenta);
router.get('/por-sucursal/:idSucursal', controlador.obtenerTodasVentas);
router.get('/:id', controlador.obtenerVentaPorId);
router.put('/:id', controlador.actualizarVenta);
router.delete('/:id', controlador.eliminarVenta);

export default router;
