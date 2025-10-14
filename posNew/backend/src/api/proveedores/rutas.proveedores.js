import express from 'express';
import * as controlador from './controlador.proveedores.js';

const router = express.Router();

// Rutas para proveedores
router.post('/', controlador.crearProveedor);
router.get('/por-empresa/:idEmpresa', controlador.obtenerTodosProveedores);
router.get('/:id', controlador.obtenerProveedorPorId);
router.put('/:id', controlador.actualizarProveedor);
router.delete('/:id', controlador.eliminarProveedor);

export default router;
