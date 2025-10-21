import express from 'express';
import rutasUsuarios from './usuarios/rutas.usuarios.js';
import rutasEmpresas from './empresas/rutas.empresas.js';
import rutasSucursales from './sucursales/rutas.sucursales.js';
import rutasProductos from './productos/rutas.productos.js';
import rutasProveedores from './proveedores/rutas.proveedores.js';
import rutasAsignacionesCaja from './asignaciones_caja/rutas.asignaciones_caja.js';
import rutasCajas from './cajas/rutas.cajas.js';
import rutasAuditTrails from './audit_trails/rutas.audit_trails.js';
import rutasCategorias from './categorias/rutas.categorias.js';
import rutasStocks from './stocks/rutas.stocks.js';
import rutasSerializacionesComprobante from './serializaciones_comprobante/rutas.serializaciones_comprobante.js';
import rutasTiposComprobante from './tipos_comprobante/rutas.tipos_comprobante.js';

const router = express.Router();

router.use('/usuarios', rutasUsuarios);
router.use('/empresas', rutasEmpresas);
router.use('/sucursales', rutasSucursales);
router.use('/productos', rutasProductos);
router.use('/proveedores', rutasProveedores);
router.use('/asignaciones-caja', rutasAsignacionesCaja);
router.use('/cajas', rutasCajas);
router.use('/audit-trails', rutasAuditTrails);
router.use('/categorias', rutasCategorias);
router.use('/stocks', rutasStocks);
router.use('/serializaciones-comprobante', rutasSerializacionesComprobante);
router.use('/tipos-comprobante', rutasTiposComprobante);

export default router;