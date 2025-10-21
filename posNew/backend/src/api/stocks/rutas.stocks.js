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
router.get('/:id', obtenerStockPorId);
router.get('/por-producto/:idProducto', obtenerStocksPorProducto);
router.get('/por-almacen/:idAlmacen', obtenerStocksPorAlmacen);
router.put('/:id', actualizarStock);

export default router;