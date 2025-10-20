import express from 'express';
import * as controlador from './controlador.impresoras.js';
import { seguridadMultiTenant, soloAutenticar } from '../../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', seguridadMultiTenant, controlador.crearImpresora);
router.get('/por-empresa/:idEmpresa', soloAutenticar, controlador.obtenerImpresorasPorEmpresa);
router.get('/:id', soloAutenticar, controlador.obtenerImpresoraPorId);
router.put('/:id', seguridadMultiTenant, controlador.actualizarImpresora);
router.delete('/:id', seguridadMultiTenant, controlador.eliminarImpresora);

export default router;