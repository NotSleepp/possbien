import express from 'express';
import * as controlador from './controlador.audit_trails.js';

const router = express.Router();

// Rutas para audit trails
router.post('/', controlador.crearAuditTrail);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodosAuditTrails);
router.get('/:id', controlador.obtenerAuditTrailPorId);
router.put('/:id', controlador.actualizarAuditTrail);
router.delete('/:id', controlador.eliminarAuditTrail);

export default router;
