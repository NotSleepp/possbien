import express from 'express';
import {
  crearSerializacion,
  obtenerTodas,
  obtenerPorId,
  obtenerPorSucursal,
  obtenerPorTipo,
  actualizarSerializacion,
  eliminarSerializacion,
} from './controlador.serializaciones_comprobante.js';

const router = express.Router();

router.post('/', crearSerializacion);
router.get('/', obtenerTodas);
router.get('/:id', obtenerPorId);
router.get('/sucursal/:idSucursal', obtenerPorSucursal);
router.get('/tipo/:idTipoComprobante', obtenerPorTipo);
router.put('/:id', actualizarSerializacion);
router.delete('/:id', eliminarSerializacion);

export default router;