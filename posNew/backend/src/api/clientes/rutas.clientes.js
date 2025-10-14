import express from 'express';
import * as controlador from './controlador.clientes.js';

const router = express.Router();

// Rutas para clientes
router.post('/', controlador.crearCliente);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodosClientes);
router.get('/:id', controlador.obtenerClientePorId);
router.put('/:id', controlador.actualizarCliente);
router.delete('/:id', controlador.eliminarCliente);

export default router;
