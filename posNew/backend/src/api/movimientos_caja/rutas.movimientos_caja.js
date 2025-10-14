import express from 'express';
import * as controlador from './controlador.movimientos_caja.js';

const router = express.Router();

// Rutas para movimientos de caja
router.post('/', controlador.crearMovimientoCaja);
router.get('/por-caja/:idCaja', controlador.obtenerTodosMovimientosCaja);
router.get('/:id', controlador.obtenerMovimientoCajaPorId);
router.put('/:id', controlador.actualizarMovimientoCaja);
router.delete('/:id', controlador.eliminarMovimientoCaja);

export default router;
