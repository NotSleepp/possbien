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
// Soportar ambas convenciones: '/sucursal' y '/por-sucursal'
router.get('/sucursal/:idSucursal', obtenerPorSucursal);
router.get('/por-sucursal/:idSucursal', obtenerPorSucursal);
// Soportar ambas convenciones: '/tipo' y '/por-tipo'
router.get('/tipo/:idTipoComprobante', obtenerPorTipo);
router.get('/por-tipo/:idTipoComprobante', obtenerPorTipo);
router.put('/:id', actualizarSerializacion);
router.delete('/:id', eliminarSerializacion);

export default router;