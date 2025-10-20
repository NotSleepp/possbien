import express from 'express';
import * as controlador from './controlador.metodos_pago.js';
import { seguridadMultiTenant, soloAutenticar } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', seguridadMultiTenant, controlador.crearMetodoPago);
router.get('/por-empresa/:idEmpresa', soloAutenticar, controlador.obtenerMetodosPagoPorEmpresa);
router.get('/:id', soloAutenticar, controlador.obtenerMetodoPagoPorId);
router.put('/:id', seguridadMultiTenant, controlador.actualizarMetodoPago);
router.delete('/:id', seguridadMultiTenant, controlador.eliminarMetodoPago);

export default router;