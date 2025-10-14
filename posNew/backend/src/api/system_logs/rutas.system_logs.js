import express from 'express';
import * as controlador from './controlador.system_logs.js';

const router = express.Router();

// Rutas para system logs
router.post('/', controlador.crearSystemLog);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodosSystemLogs);
router.get('/:id', controlador.obtenerSystemLogPorId);
router.put('/:id', controlador.actualizarSystemLog);
router.delete('/:id', controlador.eliminarSystemLog);

export default router;
