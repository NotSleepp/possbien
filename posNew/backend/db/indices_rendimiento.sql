-- =====================================================
-- ÍNDICES DE RENDIMIENTO PARA TABLAS EXISTENTES
-- Optimización de consultas frecuentes
-- =====================================================

-- ÍNDICES PARA TABLA SUCURSALES
CREATE INDEX idx_sucursal_empresa_activo ON sucursales(id_empresa, activo, eliminado_logico);
CREATE INDEX idx_sucursal_codigo ON sucursales(codigo);

-- ÍNDICES PARA TABLA ALMACEN
CREATE INDEX idx_almacen_sucursal ON almacen(id_sucursal, activo, eliminado);
CREATE INDEX idx_almacen_default ON almacen(id_empresa, `default`, activo);

-- ÍNDICES PARA TABLA CAJA
CREATE INDEX idx_caja_sucursal ON caja(id_sucursal, activo, eliminado);
CREATE INDEX idx_caja_codigo ON caja(codigo);

-- ÍNDICES PARA TABLA IMPRESORAS
CREATE INDEX idx_impresora_caja ON impresoras(id_caja, state);
CREATE INDEX idx_impresora_sucursal ON impresoras(id_sucursal, state);

-- ÍNDICES PARA TABLA CATEGORIAS
CREATE INDEX idx_categoria_empresa_activo ON categorias(id_empresa, activo, eliminado);
CREATE INDEX idx_categoria_nombre ON categorias(nombre);

-- ÍNDICES PARA TABLA PRODUCTOS
CREATE INDEX idx_producto_categoria ON productos(id_categoria, activo, eliminado);
CREATE INDEX idx_producto_empresa_activo ON productos(id_empresa, activo, eliminado);
CREATE INDEX idx_producto_codigo_interno ON productos(codigo_interno);
CREATE INDEX idx_producto_maneja_inventario ON productos(maneja_inventarios);

-- ÍNDICES PARA TABLA STOCK
CREATE INDEX idx_stock_empresa ON stock(id_empresa, id_almacen);

-- ÍNDICES PARA TABLA MOVIMIENTOS_STOCK
CREATE INDEX idx_mov_stock_producto_fecha ON movimientos_stock(id_producto, fecha_movimiento);
CREATE INDEX idx_mov_stock_almacen_fecha ON movimientos_stock(id_almacen, fecha_movimiento);
CREATE INDEX idx_mov_stock_empresa_tipo ON movimientos_stock(id_empresa, tipo_movimiento);

-- ÍNDICES PARA TABLA MULTIPRECIOS
CREATE INDEX idx_multiprecio_producto_activo ON multiprecios(id_producto, activo, eliminado);

-- ÍNDICES PARA TABLA CLIENTES_PROVEEDORES
CREATE INDEX idx_cliente_tipo ON clientes_proveedores(id_empresa, tipo, activo, eliminado);
CREATE INDEX idx_cliente_tipo_doc ON clientes_proveedores(tipo_documento, documento);
CREATE INDEX idx_cliente_razon_social ON clientes_proveedores(razon_social);

-- ÍNDICES PARA TABLA ROLES
CREATE INDEX idx_rol_empresa_activo ON roles(id_empresa, activo, eliminado);

-- ÍNDICES PARA TABLA USUARIOS
CREATE INDEX idx_usuario_empresa_rol ON usuarios(id_empresa, id_rol, activo, eliminado);
CREATE INDEX idx_usuario_estado ON usuarios(estado, activo);
CREATE INDEX idx_usuario_id_auth ON usuarios(id_auth);

-- ÍNDICES PARA TABLA SESIONES
CREATE INDEX idx_sesion_usuario_activo ON sesiones(id_usuario, activo, eliminado);
CREATE INDEX idx_sesion_expiracion_activo ON sesiones(fecha_expiracion, activo);

-- ÍNDICES PARA TABLA ASIGNACION_SUCURSAL
CREATE INDEX idx_asignacion_usuario_activo ON asignacion_sucursal(id_usuario, activo, eliminado);
CREATE INDEX idx_asignacion_sucursal_activo ON asignacion_sucursal(id_sucursal, activo);

-- ÍNDICES PARA TABLA PERMISOS
CREATE INDEX idx_permiso_rol_modulo ON permisos(id_rol, id_modulo, eliminado);
CREATE INDEX idx_permiso_empresa ON permisos(id_empresa, eliminado);

-- ÍNDICES PARA TABLA METODOS_PAGO
CREATE INDEX idx_metodo_pago_empresa_activo ON metodos_pago(id_empresa, activo, eliminado);

-- ÍNDICES PARA TABLA TIPO_COMPROBANTES
CREATE INDEX idx_tipo_comp_empresa_destino ON tipo_comprobantes(id_empresa, destino, activo, eliminado);

-- ÍNDICES PARA TABLA SERIALIZACION_COMPROBANTES
CREATE INDEX idx_serial_sucursal_tipo ON serializacion_comprobantes(id_sucursal, id_tipo_comprobante, activo);
CREATE INDEX idx_serial_default ON serializacion_comprobantes(id_sucursal, por_default, activo);

-- ÍNDICES PARA TABLA VENTAS
CREATE INDEX idx_venta_empresa_fecha ON ventas(id_empresa, fecha_venta, estado);
CREATE INDEX idx_venta_sucursal_fecha ON ventas(id_sucursal, fecha_venta);
CREATE INDEX idx_venta_caja_fecha ON ventas(id_caja, fecha_venta);
CREATE INDEX idx_venta_usuario ON ventas(id_usuario, fecha_venta);
CREATE INDEX idx_venta_cliente ON ventas(id_cliente, fecha_venta);
CREATE INDEX idx_venta_cierre_caja ON ventas(id_cierre_caja);
CREATE INDEX idx_venta_serie_numero ON ventas(serie, numero);
CREATE INDEX idx_venta_estado_fecha ON ventas(estado, fecha_venta);

-- ÍNDICES PARA TABLA DETALLE_VENTA
CREATE INDEX idx_detalle_venta_producto ON detalle_venta(id_producto, fecha_creacion);
CREATE INDEX idx_detalle_venta_almacen ON detalle_venta(id_almacen);
CREATE INDEX idx_detalle_venta_estado ON detalle_venta(estado);

-- ÍNDICES PARA TABLA FORMAS_PAGO_VENTA
CREATE INDEX idx_forma_pago_venta ON formas_pago_venta(id_venta);
CREATE INDEX idx_forma_pago_metodo ON formas_pago_venta(id_metodo_pago, fecha_creacion);

-- ÍNDICES PARA TABLA DEVOLUCIONES
CREATE INDEX idx_devolucion_venta ON devoluciones(id_venta);
CREATE INDEX idx_devolucion_sucursal_fecha ON devoluciones(id_sucursal, fecha_devolucion);
CREATE INDEX idx_devolucion_usuario ON devoluciones(id_usuario, fecha_devolucion);

-- ÍNDICES PARA TABLA DETALLE_DEVOLUCION
CREATE INDEX idx_detalle_devolucion_producto ON detalle_devolucion(id_producto);

-- ÍNDICES PARA TABLA CIERRECAJA
CREATE INDEX idx_cierre_caja_fecha ON cierrecaja(id_caja, fecha_cierre, estado);
CREATE INDEX idx_cierre_sucursal_fecha ON cierrecaja(id_sucursal, fecha_cierre);
CREATE INDEX idx_cierre_usuario ON cierrecaja(id_usuario, fecha_cierre);
CREATE INDEX idx_cierre_estado ON cierrecaja(estado, fecha_cierre);

-- ÍNDICES PARA TABLA MOVIMIENTOS_CAJA
CREATE INDEX idx_mov_caja_fecha ON movimientos_caja(id_caja, fecha_movimiento);
CREATE INDEX idx_mov_caja_tipo ON movimientos_caja(tipo_movimiento, fecha_movimiento);
CREATE INDEX idx_mov_caja_usuario ON movimientos_caja(id_usuario, fecha_movimiento);
CREATE INDEX idx_mov_caja_cierre ON movimientos_caja(id_cierre_caja);
CREATE INDEX idx_mov_caja_venta ON movimientos_caja(id_ventas);
CREATE INDEX idx_mov_caja_metodo_pago ON movimientos_caja(id_metodo_pago, fecha_movimiento);

-- ÍNDICES PARA TABLA SYSTEM_LOGS
CREATE INDEX idx_log_empresa_fecha ON system_logs(id_empresa, fecha_log);
CREATE INDEX idx_log_nivel_fecha ON system_logs(nivel, fecha_log);
CREATE INDEX idx_log_usuario_fecha ON system_logs(id_usuario, fecha_log);

-- ÍNDICES PARA TABLA AUDIT_TRAIL
CREATE INDEX idx_audit_empresa_fecha ON audit_trail(id_empresa, fecha_accion);
CREATE INDEX idx_audit_tabla_registro ON audit_trail(tabla, id_registro);
CREATE INDEX idx_audit_usuario_fecha ON audit_trail(id_usuario, fecha_accion);
CREATE INDEX idx_audit_accion_fecha ON audit_trail(accion, fecha_accion);

-- ÍNDICES COMPUESTOS PARA REPORTES COMUNES
CREATE INDEX idx_reporte_ventas_diarias ON ventas(id_empresa, id_sucursal, estado);
CREATE INDEX idx_reporte_productos_vendidos ON detalle_venta(id_empresa, id_producto);
CREATE INDEX idx_reporte_ventas_usuario ON ventas(id_empresa, id_usuario);

-- ÍNDICES PARA CONFIGURACION_EMPRESA
CREATE INDEX idx_config_empresa_clave ON configuracion_empresa(id_empresa, clave, activo);

-- ÍNDICES PARA MODULOS
CREATE INDEX idx_modulo_activo_orden ON modulos(activo, orden, eliminado);
CREATE INDEX idx_modulo_ruta ON modulos(ruta);

-- Mensaje de confirmación
SELECT 'Índices de rendimiento creados exitosamente' as mensaje;
