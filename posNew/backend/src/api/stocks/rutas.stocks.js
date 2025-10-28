import express from 'express';
import {
  crearStock,
  obtenerStockPorId,
  obtenerStocksPorProducto,
  obtenerStocksPorAlmacen,
  actualizarStock,
} from './controlador.stocks.js';

const router = express.Router();

router.post('/', crearStock);
// Register more specific routes BEFORE parameterized ':id' to avoid shadowing
router.get('/por-producto/:idProducto', obtenerStocksPorProducto);
router.get('/por-almacen/:idAlmacen', obtenerStocksPorAlmacen);
router.get('/:id', obtenerStockPorId);
router.put('/:id', actualizarStock);

export default router;