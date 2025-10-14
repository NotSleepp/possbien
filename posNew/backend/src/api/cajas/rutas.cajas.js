import express from 'express';
import * as controlador from './controlador.cajas.js';

const router = express.Router();

// Rutas para cajas
router.post('/', controlador.crearCaja);
router.get('/por-sucursal/:idSucursal', controlador.obtenerTodasCajas);
router.get('/:id', controlador.obtenerCajaPorId);
router.put('/:id', controlador.actualizarCaja);
router.delete('/:id', controlador.eliminarCaja);

export default router;
