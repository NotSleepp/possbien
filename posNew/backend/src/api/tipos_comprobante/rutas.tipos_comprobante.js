import express from 'express';
import {
  crearTipoComprobante,
  obtenerTodos,
  obtenerPorEmpresa,
  obtenerPorId,
  actualizarTipoComprobante,
  eliminarTipoComprobante,
} from './controlador.tipos_comprobante.js';

const router = express.Router();

router.post('/', crearTipoComprobante);
router.get('/', obtenerTodos);
router.get('/por-empresa/:idEmpresa', obtenerPorEmpresa);
router.get('/:id', obtenerPorId);
router.put('/:id', actualizarTipoComprobante);
router.delete('/:id', eliminarTipoComprobante);

export default router;