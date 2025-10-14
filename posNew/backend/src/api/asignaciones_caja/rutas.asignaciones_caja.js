import express from 'express';
import * as controlador from './controlador.asignaciones_caja.js';

const router = express.Router();

// Rutas para asignaciones de caja
router.post('/', controlador.crearAsignacionCaja);
router.get('/por-caja/:idCaja', controlador.obtenerTodasAsignacionesCaja);
router.get('/:id', controlador.obtenerAsignacionCajaPorId);
router.put('/:id', controlador.actualizarAsignacionCaja);
router.delete('/:id', controlador.eliminarAsignacionCaja);

export default router;
