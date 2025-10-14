import express from 'express';
import * as controlador from './controlador.compras.js';

const router = express.Router();

// Rutas para compras
router.post('/', controlador.crearCompra);
router.get('/por-sucursal/:idSucursal', controlador.obtenerTodasCompras);
router.get('/:id', controlador.obtenerCompraPorId);
router.put('/:id', controlador.actualizarCompra);
router.delete('/:id', controlador.eliminarCompra);

export default router;
