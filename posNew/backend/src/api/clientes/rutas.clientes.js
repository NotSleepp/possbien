import express from 'express';
import * as controlador from './controlador.clientes.js';
import { seguridadMultiTenant, soloAutenticar } from '../../middlewares/auth.middleware.js';

const router = express.Router();

// Rutas para clientes
router.post('/', seguridadMultiTenant, controlador.crearCliente);
router.get('/por-empresa/:idEmpresa', soloAutenticar, controlador.obtenerTodosClientes);
router.get('/:id', soloAutenticar, controlador.obtenerClientePorId);
router.put('/:id', seguridadMultiTenant, controlador.actualizarCliente);
router.delete('/:id', soloAutenticar, controlador.eliminarCliente);

export default router;
