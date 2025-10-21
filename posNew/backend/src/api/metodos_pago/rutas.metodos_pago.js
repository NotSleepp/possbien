import express from 'express';
import * as controlador from './controlador.metodos_pago.js';
import { seguridadMultiTenant, soloAutenticar } from '../../middlewares/auth.middleware.js';
import { validarEsquema, validarIds } from '../../middlewares/validacion.middleware.js';
import { transformarMetodosPago } from '../../middlewares/dataTransform.middleware.js';
import { esquemaCrearMetodoPago, esquemaActualizarMetodoPago } from './dto.metodos_pago.js';

const router = express.Router();

// Crear método de pago con validación
router.post('/', seguridadMultiTenant, transformarMetodosPago, validarEsquema(esquemaCrearMetodoPago, 'body'), controlador.crearMetodoPago);

// Listar por empresa con validación
router.get('/por-empresa/:idEmpresa', soloAutenticar, validarIds(['idEmpresa']), controlador.obtenerMetodosPagoPorEmpresa);

// Obtener por id con validación
router.get('/:id', soloAutenticar, validarIds(['id']), controlador.obtenerMetodoPagoPorId);

// Actualizar con validación de id y esquema (omitimos id)
router.put('/:id', seguridadMultiTenant, validarIds(['id']), transformarMetodosPago, validarEsquema(esquemaActualizarMetodoPago.omit({ id: true }), 'body'), controlador.actualizarMetodoPago);

router.delete('/:id', seguridadMultiTenant, controlador.eliminarMetodoPago);

export default router;