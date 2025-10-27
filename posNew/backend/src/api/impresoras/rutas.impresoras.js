import express from 'express';
import * as controlador from './controlador.impresoras.js';
import { seguridadMultiTenant, soloAutenticar } from '../../middlewares/auth.middleware.js';
import { validarEsquema, validarIds } from '../../middlewares/validacion.middleware.js';
import { transformarImpresoras } from '../../middlewares/dataTransform.middleware.js';
import { esquemaCrearImpresora, esquemaActualizarImpresoraBody } from './dto.impresoras.js';

const router = express.Router();

// Crear impresora con validación de esquema
router.post('/', seguridadMultiTenant, transformarImpresoras, validarEsquema(esquemaCrearImpresora, 'body'), controlador.crearImpresora);

// Listar por empresa con validación de parámetro
router.get('/por-empresa/:idEmpresa', soloAutenticar, validarIds(['idEmpresa']), controlador.obtenerImpresorasPorEmpresa);

// Obtener por id con validación de parámetro
router.get('/:id', soloAutenticar, validarIds(['id']), controlador.obtenerImpresoraPorId);

// Actualizar con validación de id y esquema (usamos el schema sin id)
router.put('/:id', seguridadMultiTenant, validarIds(['id']), transformarImpresoras, validarEsquema(esquemaActualizarImpresoraBody, 'body'), controlador.actualizarImpresora);

router.delete('/:id', seguridadMultiTenant, controlador.eliminarImpresora);

export default router;