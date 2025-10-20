import express from 'express';
import * as controlador from './controlador.ventas.js';
import { soloAutenticar } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para ventas
router.post('/', soloAutenticar, controlador.crearVenta);
router.get('/por-sucursal/:idSucursal', soloAutenticar, controlador.obtenerTodasVentas);
router.get('/:id', soloAutenticar, controlador.obtenerVentaPorId);
router.put('/:id', soloAutenticar, controlador.actualizarVenta);
router.delete('/:id', soloAutenticar, controlador.eliminarVenta);

export default router;
