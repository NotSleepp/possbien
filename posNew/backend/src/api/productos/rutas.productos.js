import express from 'express';
import * as controlador from './controlador.productos.js';
import { seguridadMultiTenant, soloAutenticar } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para productos
router.post('/', seguridadMultiTenant, controlador.crearProducto);
router.get('/por-empresa/:idEmpresa', soloAutenticar, controlador.obtenerTodosProductos);
// Nuevas rutas compatibles con el frontend de caja
router.get('/empresa/:idEmpresa', soloAutenticar, controlador.obtenerProductosConStockPorEmpresa);
router.get('/empresa/:idEmpresa/search', soloAutenticar, controlador.buscarProductosPorEmpresa);
router.get('/:id', soloAutenticar, controlador.obtenerProductoPorId);
router.put('/:id', seguridadMultiTenant, controlador.actualizarProducto);
router.delete('/:id', soloAutenticar, controlador.eliminarProducto);

export default router;
