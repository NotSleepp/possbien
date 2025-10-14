import express from 'express';
import * as controlador from './controlador.sucursales.js';

const router = express.Router();

// Rutas para sucursales
router.post('/', controlador.crearSucursal);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodasSucursales);
router.get('/:id', controlador.obtenerSucursalPorId);
router.put('/:id', controlador.actualizarSucursal);
router.delete('/:id', controlador.eliminarSucursal);

export default router;
