# Documentación Exhaustiva de Base de Datos (POS Multitenant)

## Tabla de Contenidos
- [Convenciones y Tipos de Datos](#convenciones-y-tipos-de-datos)
- [Tablas Principales](#tablas-principales-estructura-resumida)
- [Tablas Avanzadas](#tablas-avanzadas-mejoras_schema)
- [Tablas Adicionales](#tablas-adicionales-correcciones_criticas)
- [Checks y Reglas Clave](#checks-y-reglas-clave)
- [Índices y Optimización](#índices-y-optimización)
- [Vistas, Procedimientos y Triggers](#vistas-procedimientos-y-triggers)
- [Patrón Multitenant y Eliminación Lógica](#patrón-multitenant-y-eliminación-lógica)
- [Notas Operativas](#notas-operativas)
- [Diccionario de Datos Detallado](#diccionario-de-datos-detallado-completo)
- [Mapa de Objetos ↔ SQL](#mapa-de-objetos-↔-sql)
- [Orden de Scripts y Comandos](#orden-de-scripts-y-comandos)

Esta base de datos es multitenant y todas las tablas incluyen `id_empresa` para el aislamiento por empresa. Se usa eliminación lógica (`eliminado`, `fecha_eliminacion`) y timestamps (`fecha_creacion`, `fecha_actualizacion`). Motor y collation: InnoDB, `utf8mb4_unicode_ci`.

## Convenciones y Tipos de Datos
- Identificadores: `INT AUTO_INCREMENT` para PK, FKs como `INT`.
- Texto: `VARCHAR(n)` para cadenas acotadas, `TEXT` para descripciones largas.
- Números: `DECIMAL(p,s)` para montos; usualmente `DECIMAL(10,2)`.
- Fechas/horas: `TIMESTAMP`, `DATE`, `TIME`.
- Estados: `BOOLEAN` y `ENUM` según catálogo de cada tabla.
- Estructurados: `JSON` en campos de configuración y logs.
- Columnas generadas: `GENERATED ALWAYS AS (...) STORED` para subtotales y diferencias.

## Tablas Principales (estructura resumida)

### empresa
- PK: `id`.
- Campos clave: `nombre (VARCHAR)`, `id_fiscal (VARCHAR, UNIQUE)`, `direccion_fiscal (TEXT)`, moneda e impuesto (`currency, simbolo_moneda, nombre_moneda, impuesto, valor_impuesto DECIMAL(5,2)`), contacto (`correo`), compatibilidad (`ruc, razon_social, direccion, telefono, email, logo_url`).
- Índices: `idx_empresa_activo (id, activo)`.

### configuracion_empresa
- PK: `id` | FK: `id_empresa -> empresa(id)`.
- Campos: `clave (VARCHAR)`, `valor (TEXT)`, `tipo ENUM('STRING','NUMBER','BOOLEAN','JSON')`, `activo`.
- Unique: `(id_empresa, clave)`.

### sucursales
- PK: `id` | FK: `id_empresa`.
- Campos: `codigo (VARCHAR, UNIQUE por empresa)`, `nombre`, `direccion`, `direccion_fiscal`, `activo`, `eliminado_logico`.
- Índices: por empresa y activo.

### almacen
- PK: `id` | FK: `id_empresa`, `id_sucursal`.
- Campos: `codigo (UNIQUE por sucursal)`, `nombre`, `descripcion`, ``default`` (BOOLEAN), `activo`.

### caja
- PK: `id` | FK: `id_empresa`, `id_sucursal`.
- Campos: `codigo (UNIQUE por sucursal)`, `nombre`, `monto_inicial DECIMAL`, `print BOOLEAN`, `activo`.

### impresoras
- PK: `id` | FK: `id_empresa`, `id_sucursal`, `id_caja`.
- Campos: `name`, `tipo ENUM('termica','matricial','laser')`, `puerto`, `pc_name`, `ip_local`, `state BOOLEAN`, `configuracion JSON`.

### categorias
- PK: `id` | FK: `id_empresa`.
- Campos: `codigo (UNIQUE por empresa)`, `nombre`, `descripcion`, `color (HEX)`, `icono`, `activo`.

### productos
- PK: `id` | FK: `id_empresa`, `id_categoria`.
- Campos: `codigo (UNIQUE por empresa)`, `codigo_interno`, `codigo_barras`, `nombre`, `descripcion`, `precio_compra DECIMAL`, `precio_venta DECIMAL`, `stock_minimo INT`, `unidad_medida`, `sevende_por`, `maneja_inventarios BOOLEAN`, `maneja_multiprecios BOOLEAN`, `imagen_url`, `activo`.
- Checks: `precio_venta >= 0`, `precio_compra >= 0`.
- Índices: `idx_codigo_barras`, `idx_nombre`, fulltext `(nombre, descripcion)`.

### stock
- PK: `id` | FK: `id_empresa`, `id_producto`, `id_almacen`.
- Campos: `cantidad_actual INT`, `cantidad_reservada INT`, `cantidad_disponible GENERATED(cantidad_actual - cantidad_reservada)`, `stock_minimo INT`, `stock_maximo INT`, `ubicacion`, `fecha_actualizacion`.
- Unique: `(id_producto, id_almacen)`.
- Checks: no negativos y `reservada <= actual`.

### movimientos_stock
- PK: `id` | FKs: `id_empresa`, `id_producto`, `id_almacen`.
- Campos: `tipo_movimiento ENUM('ENTRADA','SALIDA','AJUSTE','TRANSFERENCIA')`, `cantidad INT`, `precio_unitario DECIMAL`, `motivo`, `documento_referencia`, `id_usuario`, `fecha_movimiento`.

### multiprecios
- PK: `id` | FKs: `id_empresa`, `id_producto`.
- Campos: `nombre_precio`, `precio DECIMAL`, `cantidad_minima INT`, `activo`.
- Unique: `(id_producto, nombre_precio)`.

### clientes_proveedores
- PK: `id` | FK: `id_empresa`.
- Campos: `tipo ENUM('CLIENTE','PROVEEDOR','AMBOS')`, `documento`, `tipo_documento ENUM('DNI','RUC','PASAPORTE','CARNET')`, `nombres`, `apellidos`, `razon_social`, `direccion`, `telefono`, `email`, `activo`.
- Unique: `(id_empresa, documento)`.
- Fulltext: `(nombres, apellidos, razon_social)`.

### tipos_documento
- PK: `id`.
- Campos: `codigo (UNIQUE)`, `nombre`, `descripcion`, límites y patrón (`longitud_minima, longitud_maxima, patron_validacion`), `requiere_validacion BOOLEAN`, `activo`.
- Índices: `idx_codigo_tipo_doc`, `idx_activo_tipo_doc`.

### roles
- PK: `id` | FK: `id_empresa`.
- Campos: `nombre (UNIQUE por empresa)`, `descripcion`, `activo`.

### usuarios
- PK: `id` | FKs: `id_empresa`, `id_rol`, `id_tipodocumento -> tipos_documento(id)`.
- Campos: `username (UNIQUE)`, `password`, `nombres`, `apellidos`, `email`, `telefono`, `activo`, `ultimo_acceso`, alias y estados (`correo`, `id_auth`, `tema ENUM('light','dark')`, `fecharegistro`, `estado ENUM('ACTIVO','INACTIVO')`).
- Índices: `idx_username`, `idx_email`, `idx_nro_doc`, por empresa/rol/estado.

### sesiones
- PK: `id` | FKs: `id_empresa`, `id_usuario`.
- Campos: `token (UNIQUE)`, `refresh_token`, `ip_address`, `user_agent`, `fecha_inicio`, `fecha_expiracion`, `activo`.

### asignacion_sucursal
- PK: `id` | FKs: `id_empresa`, `id_usuario`, `id_sucursal`, `id_caja`.
- Campos: `activo`, `fecha_asignacion`.
- Unique: `(id_usuario, id_sucursal)`.

### modulos
- PK: `id`.
- Campos: `nombre (UNIQUE)`, `descripcion`, `icono`, `ruta`, `activo`, `orden`.

### permisos
- PK: `id` | FKs: `id_empresa`, `id_rol`, `id_modulo`.
- Campos: flags `puede_ver/crear/editar/eliminar (BOOLEAN)`.
- Unique: `(id_rol, id_modulo)`.

### metodos_pago
- PK: `id` | FK: `id_empresa`.
- Campos: `codigo (UNIQUE por empresa)`, `nombre`, `descripcion`, `imagen`, `requiere_referencia BOOLEAN`, `activo`.

### tipo_comprobantes
- PK: `id` | FK: `id_empresa`.
- Campos: `codigo (UNIQUE por empresa)`, `nombre`, `descripcion`, `destino ENUM('VENTA','COMPRA','INTERNO')`, `activo`.

### serializacion_comprobantes
- PK: `id` | FKs: `id_empresa`, `id_sucursal`, `id_tipo_comprobante`.
- Campos: `serie`, `numero_inicial INT`, `numero_actual INT`, `numero_final INT`, `cantidad_numeros INT`, `por_default BOOLEAN`, `activo`.
- Unique: `(id_sucursal, id_tipo_comprobante, serie)`.

### ventas
- PK: `id` | FKs: `id_empresa`, `id_sucursal`, `id_caja`, `id_usuario`, `id_cliente`, `id_tipo_comprobante`.
- Campos: `serie`, `numero`, `fecha_venta`, totales (`sub_total DECIMAL`, `descuento DECIMAL`, `total_impuestos DECIMAL`, `monto_total DECIMAL`, `saldo DECIMAL`), pago (`pago_con`, `referencia_tarjeta`, `vuelto`), `cantidad_productos`, `valor_impuesto DECIMAL(5,2)`, referencias (`id_cierre_caja`, `nro_comprobante`), `estado ENUM('PENDIENTE','COMPLETADA','ANULADA')`.
- Nota: columnas `subtotal` e `impuesto` fueron eliminadas por correcciones.

### detalle_venta
- PK: `id` | FKs: `id_empresa`, `id_venta`, `id_producto`, `id_sucursal`, `id_almacen`.
- Campos: `cantidad INT`, `precio_unitario DECIMAL`, `descuento DECIMAL`, `precio_venta DECIMAL`, `subtotal GENERATED((cantidad*precio_venta) - descuento)`, `estado VARCHAR(20)`.
- Nota: columna `total` eliminada.

### formas_pago_venta
- PK: `id` | FKs: `id_empresa`, `id_venta`, `id_metodo_pago`.
- Campos: `monto DECIMAL`, `referencia`.

### devoluciones / detalle_devolucion
- PKs: `id` | FKs: empresa/sucursal/venta/usuario y empresa/devolucion/producto.
- Campos: motivo/observaciones, `estado ENUM('PENDIENTE','APROBADA','RECHAZADA')`, subtotales generados.

### cierrecaja
- PK: `id` | FKs: empresa/sucursal/caja/usuario.
- Campos: `fecha_apertura`, `fecha_cierre`, montos (`monto_inicial/monto_final`), totales, diferencias generadas, `estado ENUM('ABIERTO','CERRADO')`.

### movimientos_caja
- PK: `id` | FKs: empresa/sucursal/caja/usuario, `id_metodo_pago`, `id_cierre_caja`, `id_ventas`.
- Campos: `tipo_movimiento ENUM('INGRESO','EGRESO','VENTA')`, `monto DECIMAL`, `concepto/descripcion`, `documento_referencia`, `fecha_movimiento`, `vuelto`.
- Check: `monto > 0`.

### system_logs
- PK: `id` | FKs: `id_empresa`, `id_usuario`.
- Campos: `nivel ENUM('DEBUG','INFO','WARN','ERROR','FATAL')`, `mensaje TEXT`, `contexto JSON`, `ip_address`, `user_agent`, `fecha_log`.

### audit_trail
- PK: `id` | FKs: `id_empresa`, `id_usuario`.
- Campos: `tabla`, `id_registro`, `accion ENUM('CREATE','UPDATE','DELETE','LOGIN','LOGOUT')`, `datos_anteriores JSON`, `datos_nuevos JSON`, `ip_address`, `user_agent`, `fecha_accion`.

## Tablas Avanzadas (mejoras_schema)
- promociones: tipos `ENUM('DESCUENTO_PORCENTAJE','DESCUENTO_MONTO','PRECIO_FIJO','2X1','3X2','COMBO')`, fechas/hours, `SET dias_semana`, límites, `acumulable`.
- promocion_productos / promocion_categorias / uso_promociones: relaciones con ventas/clientes, índices por fecha/cliente.
- combos / combo_productos: `ahorro GENERATED`, relaciones a productos.
- programas_fidelizacion / puntos_clientes / movimientos_puntos: puntos, tipos `ENUM('ACUMULACION','CANJE','EXPIRACION','AJUSTE')`.
- cupones / uso_cupones: `tipo ENUM('PORCENTAJE','MONTO_FIJO','ENVIO_GRATIS')`, límites y fechas.
- compras / detalle_compra: totales, `subtotal GENERATED`, estados `ENUM('PENDIENTE','RECIBIDA','PARCIAL','CANCELADA')`.
- gastos: `categoria_gasto ENUM('SERVICIOS','SUELDOS','ALQUILER','MANTENIMIENTO','MARKETING','OTROS')`, montos/fechas.
- cuentas_por_cobrar / pagos_cuentas_cobrar: `saldo GENERATED`, estado `ENUM('PENDIENTE','PARCIAL','PAGADA','VENCIDA')`.
- cuentas_por_pagar / pagos_cuentas_pagar: similar a CxC.
- turnos / asignacion_turnos: `SET dias_semana`, asignaciones por fecha.
- notificaciones: `tipo ENUM('INFO','ALERTA','ERROR','EXITO')`, `leida BOOLEAN`.
- alertas_stock: `tipo_alerta ENUM('STOCK_MINIMO','STOCK_AGOTADO','STOCK_EXCESO')`, `resuelta BOOLEAN`.

## Tablas Adicionales (correcciones_criticas)
- tipos_documento: catálogo y validaciones.
- historial_precios: cambios de precio, `tipo_precio ENUM('VENTA','COMPRA')`.
- impuestos: catálogo por empresa, `tipo ENUM('IVA','IGV','ISC','IEPS','OTRO')`, flags de aplicación.
- lotes_productos: manejo de lotes con vencimiento y cantidades.

## Checks y Reglas Clave
- Precios/ montos no negativos: productos, detalle_venta, ventas, movimientos_caja.
- Stock: no negativos y `reservada <= actual`.
- Fechas de validez: `promociones.fecha_fin >= fecha_inicio`, vencimientos CxC/CxP `>= fecha_creacion`.

## Índices y Optimización
- Índices compuestos y por actividad en la mayoría de tablas (sucursales, almacen, caja, impresoras, categorias, productos, stock, movimientos_stock, multiprecios, clientes_proveedores, roles, usuarios, sesiones, asignaciones, permisos, metodos_pago, tipo_comprobantes, serializacion, ventas, detalle_venta, formas_pago_venta, devoluciones, cierrecaja, movimientos_caja, system_logs, audit_trail, configuracion_empresa, modulos).
- Fulltext: productos(nombre, descripcion), clientes_proveedores(nombres, apellidos, razon_social).
- Varios índices de reporte y limpieza (ver `indices_rendimiento.sql`).

## Mapa de Objetos ↔ SQL
- `schema.sql`: Tablas núcleo del POS y claves FK/UNIQUE. Incluye `empresa`, `sucursales`, `almacen`, `caja`, `impresoras`, `categorias`, `productos`, `stock`, `movimientos_stock`, `multiprecios`, `clientes_proveedores`, `roles`, `usuarios`, `sesiones`, `asignacion_sucursal`, `modulos`, `permisos`, `metodos_pago`, `tipo_comprobantes`, `serializacion_comprobantes`, `ventas`, `detalle_venta`, `cierrecaja`, `movimientos_caja`, `system_logs`, `audit_trail`, e índices multitenant.
- `mejoras_schema.sql`: Tablas avanzadas de negocio: `compras`, `detalle_compra`, `gastos`, `cuentas_por_cobrar`, `pagos_cuentas_cobrar`, `cuentas_por_pagar`, `pagos_cuentas_pagar`, `promociones`, `promocion_productos`, `promocion_categorias`, `uso_promociones`, `combos`, `combo_productos`, `programas_fidelizacion`, `puntos_clientes`, `movimientos_puntos`, `cupones`, `uso_cupones`, `turnos`, `asignacion_turnos`, `notificaciones`, `alertas_stock`.
- `correcciones_criticas.sql`: Correcciones y objetos adicionales: `tipos_documento`, `historial_precios`, `impuestos`, `lotes_productos`; `CHECK` de precios/fechas/cantidades; vistas `v_productos_stock_bajo`, `v_ventas_hoy`, `v_productos_mas_vendidos`, `v_cajas_abiertas`, `v_cuentas_cobrar_vencidas`; SPs `sp_limpiar_sesiones_expiradas`, `sp_obtener_stock_disponible`, `sp_calcular_totales_venta`; triggers `trg_productos_precio_audit`, `trg_stock_alerta_bajo`; índices compuestos y FULLTEXT.
- `indices_rendimiento.sql`: Índices complementarios para rutas, reportes y limpieza (ej. `modulos(ruta)`), orientados a rendimiento.
- `seeds.sql`: Datos semilla iniciales (catálogos, ejemplos). Ejecutar después de crear el esquema.
- `init.js`: Inicialización y orquestación de carga de scripts.

## Orden de Scripts y Comandos
- Orden recomendado de carga:
  1. `schema.sql`
  2. `mejoras_schema.sql`
  3. `correcciones_criticas.sql`
  4. `indices_rendimiento.sql`
  5. `seeds.sql` (opcional según entorno)
- Comando sugerido: `npm run db:reset` en `posNew/backend` para recrear el esquema y datos.

## Vistas, Procedimientos y Triggers
- Vistas: `v_productos_stock_bajo`, `v_ventas_hoy`, `v_productos_mas_vendidos`, `v_cajas_abiertas`, `v_cuentas_cobrar_vencidas`.
- SPs: `sp_limpiar_sesiones_expiradas`, `sp_obtener_stock_disponible`, `sp_calcular_totales_venta`.
- Triggers: `trg_productos_precio_audit` (audita cambios de precio), `trg_stock_alerta_bajo` (genera/resuelve alertas de stock).

## Patrón Multitenant y Eliminación Lógica
- Todas las tablas incluyen `id_empresa` y soportan `eliminado/fecha_eliminacion`.
- Integridad referencial mediante FKs, `ON DELETE CASCADE` donde aplica (ej. multiprecios, combos, promociones).

## Notas Operativas
- Serialización de comprobantes: control por `id_sucursal + id_tipo_comprobante + serie`, con `numero_actual`.
- Ventas: `monto_total` y totales calculados por SP; columnas duplicadas antiguas (`subtotal`, `impuesto`, `total`) fueron normalizadas.
- Stock y alertas: reglas de negocio reforzadas por checks y triggers.

## Diccionario de Datos Detallado (completo)

### empresa
- Columnas: `id` PK; `nombre`; `id_fiscal` UNIQUE; `direccion_fiscal`; `simbolo_moneda`; `logo`; `id_auth`; `id_usuario`; `iso`; `pais`; `currency`; `impuesto`; `valor_impuesto` DECIMAL(5,2); `nombre_moneda`; `correo`; `pie_pagina_ticket`; compat (`ruc`, `razon_social`, `nombre_comercial`, `direccion`, `telefono`, `email`, `logo_url`); `activo`; `fecha_creacion`; `fecha_actualizacion`; `eliminado`; `fecha_eliminacion`.
- Claves: PK `id`; UNIQUE `id_fiscal`.

### configuracion_empresa
- Columnas: `id` PK; `id_empresa` FK→`empresa(id)`; `clave` UNIQUE por empresa; `valor`; `descripcion`; `tipo` ENUM('STRING','NUMBER','BOOLEAN','JSON'); `activo`; timestamps y soft delete.
- Claves: UNIQUE `(id_empresa, clave)`.

### sucursales
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `direccion`; `direccion_fiscal`; `telefono`; `email`; `activo`; `eliminado_logico`; timestamps.
- Claves: UNIQUE `(id_empresa, codigo)`.

### almacen
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `codigo` UNIQUE por sucursal; `nombre`; `descripcion`; `default` BOOLEAN; `activo`; timestamps.
- Claves: UNIQUE `(id_sucursal, codigo)`.

### caja
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `codigo` UNIQUE por sucursal; `nombre`; `descripcion`; `monto_inicial`; `print` BOOLEAN; `activo`; timestamps.

### impresoras
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_caja` FK NULL; `name`; `nombre` compat; `tipo` ENUM('termica','matricial','laser'); `puerto`; `pc_name`; `ip_local`; `state` BOOLEAN; `configuracion` JSON; `activo`; timestamps.

### categorias
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `descripcion`; `color`; `icono`; `activo`; timestamps.

### productos
- Columnas: `id` PK; `id_empresa` FK; `id_categoria` FK; `codigo` UNIQUE por empresa; `codigo_interno`; `codigo_barras`; `nombre`; `descripcion`; `precio_compra` DECIMAL≥0; `precio_venta` DECIMAL≥0; `stock_minimo`; `unidad_medida` 'UND'; `sevende_por` 'UNIDAD'; `maneja_inventarios`; `maneja_multiprecios`; `imagen_url`; `activo`; timestamps.
- Checks: `precio_venta >= 0`, `precio_compra >= 0`.
- Índices: `idx_codigo_barras`, `idx_nombre`, FULLTEXT (`nombre`,`descripcion`).

### stock (estado final)
- Columnas: `id` PK; `id_empresa` FK; `id_producto` FK; `id_almacen` FK; `cantidad_actual` INT≥0; `cantidad_reservada` INT≥0≤`cantidad_actual`; `cantidad_disponible` GENERATED(`cantidad_actual - cantidad_reservada`); `stock_minimo`; `stock_maximo`; `ubicacion`; `fecha_actualizacion` ON UPDATE.
- Claves: UNIQUE `(id_producto, id_almacen)`.
- Checks: no negativos; `reservada <= actual`.

### movimientos_stock
- Columnas: `id` PK; `id_empresa` FK; `id_producto` FK; `id_almacen` FK; `tipo_movimiento` ENUM('ENTRADA','SALIDA','AJUSTE','TRANSFERENCIA'); `cantidad`; `precio_unitario`; `motivo`; `documento_referencia`; `id_usuario`; `fecha_movimiento`.

### multiprecios
- Columnas: `id` PK; `id_empresa` FK CASCADE; `id_producto` FK CASCADE; `nombre_precio`; `precio`; `cantidad_minima`; `activo`; timestamps.
- Claves: UNIQUE `(id_producto, nombre_precio)`.

### clientes_proveedores
- Columnas: `id` PK; `id_empresa` FK; `tipo` ENUM('CLIENTE','PROVEEDOR','AMBOS'); `documento` UNIQUE por empresa; `tipo_documento`; `nombres`; `apellidos`; `razon_social`; `direccion`; `telefono`; `email`; `activo`; timestamps.
- Fulltext: (`nombres`,`apellidos`,`razon_social`).

### tipos_documento
- Columnas: `id` PK; `codigo` UNIQUE; `nombre`; `descripcion`; `longitud_minima`; `longitud_maxima`; `patron_validacion`; `requiere_validacion`; `activo`; timestamps.

### roles
- Columnas: `id` PK; `id_empresa` FK; `nombre` UNIQUE por empresa; `descripcion`; `activo`; timestamps.

### usuarios
- Columnas: `id` PK; `id_empresa` FK; `id_rol` FK; `username` UNIQUE por empresa; `password`; `nombres`; `apellidos`; `email`; `telefono`; `activo`; `ultimo_acceso`; `id_tipodocumento` FK; `nro_doc`; `correo`; `id_auth`; `tema` ENUM('light','dark'); `fecharegistro`; `estado` ENUM('ACTIVO','INACTIVO'); timestamps.
- Índices: `idx_username`, `idx_email`, `idx_nro_doc` + compuestos por empresa/rol/estado.

### sesiones
- Columnas: `id` PK; `id_empresa` FK; `id_usuario` FK; `token` UNIQUE; `refresh_token`; `ip_address`; `user_agent`; `fecha_inicio`; `fecha_expiracion` NOT NULL; `activo`; timestamps.

### asignacion_sucursal
- Columnas: `id` PK; `id_empresa` FK; `id_usuario` FK; `id_sucursal` FK; `id_caja` FK; `activo`; `fecha_asignacion`; soft delete.
- Claves: UNIQUE `(id_usuario, id_sucursal)`.

### modulos
- Columnas: `id` PK; `nombre` UNIQUE; `descripcion`; `icono`; `ruta`; `activo`; `orden`; timestamps.

### permisos
- Columnas: `id` PK; `id_empresa` FK; `id_rol` FK; `id_modulo` FK; `puede_ver`; `puede_crear`; `puede_editar`; `puede_eliminar`; timestamps.
- Claves: UNIQUE `(id_rol, id_modulo)`.

### metodos_pago
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `descripcion`; `imagen`; `requiere_referencia`; `activo`; timestamps.

### tipo_comprobantes
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `descripcion`; `destino` ENUM('VENTA','COMPRA','INTERNO'); `activo`; timestamps.

### serializacion_comprobantes (estado final)
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_tipo_comprobante` FK; `serie`; `numero_inicial`; `numero_actual`; `numero_final`; `cantidad_numeros`; `por_default`; `activo`; timestamps.
- Claves: UNIQUE `(id_sucursal, id_tipo_comprobante, serie)`.
- Nota: campo `correlativo` eliminado por correcciones críticas.

### ventas (estado final)
- Identificación/relaciones: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_caja` FK; `id_usuario` FK; `id_cliente` FK; `id_tipo_comprobante` FK; `serie`; `numero`.
- Fechas/estado: `fecha_venta`; `estado` ENUM('PENDIENTE','COMPLETADA','ANULADA').
- Totales: `sub_total` DECIMAL; `descuento` DECIMAL≥0; `total_impuestos` DECIMAL; `monto_total` DECIMAL≥0; `saldo` DECIMAL.
- Pago: `pago_con` DECIMAL; `referencia_tarjeta`; `vuelto` DECIMAL.
- Otros: `cantidad_productos`; `valor_impuesto` DECIMAL(5,2); `id_cierre_caja`; `nro_comprobante`; timestamps.

### detalle_venta (estado final)
- Columnas: `id` PK; `id_empresa` FK; `id_venta` FK; `id_producto` FK; `cantidad` INT>0; `precio_unitario` DECIMAL; `descuento` DECIMAL≥0; `precio_venta` DECIMAL≥0; `descripcion`; `precio_compra`; `id_sucursal`; `estado`; `id_almacen`; `subtotal` GENERATED((cantidad*precio_venta) - descuento); timestamps.
- Nota: columna `total` eliminada.

### formas_pago_venta
- Columnas: `id` PK; `id_empresa` FK; `id_venta` FK; `id_metodo_pago` FK; `monto` DECIMAL; `referencia`; timestamps.

### devoluciones
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_venta` FK; `id_usuario` FK; `motivo` TEXT; `total_devolucion` DECIMAL; `estado` ENUM('PENDIENTE','APROBADA','RECHAZADA'); `fecha_devolucion`; `observaciones`; timestamps.

### detalle_devolucion
- Columnas: `id` PK; `id_empresa` FK; `id_devolucion` FK; `id_producto` FK; `cantidad_devuelta` INT>0; `precio_unitario` DECIMAL≥0; `subtotal` GENERATED(cantidad_devuelta*precio_unitario); timestamps.

### cierrecaja
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_caja` FK; `id_usuario` FK; `fecha_apertura` NOT NULL; `fecha_cierre`; `monto_inicial` DECIMAL; `monto_final` DECIMAL; `total_ventas`; `total_ingresos`; `total_egresos`; `diferencia` GENERATED; alias (`fechainicio`,`fechacierre`); diferencias de efectivo (`total_efectivo_calculado`,`total_efectivo_real`,`diferencia_efectivo`); `estado`; timestamps.

### movimientos_caja
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_caja` FK; `id_usuario` FK; `tipo_movimiento` ENUM('INGRESO','EGRESO','VENTA'); `monto` DECIMAL>0; `concepto`; `documento_referencia`; `fecha_movimiento`; `id_metodo_pago`; `descripcion`; `id_cierre_caja`; `id_ventas`; `vuelto`; timestamps.
- Checks: `monto > 0`.

### system_logs
- Columnas: `id` PK; `id_empresa` FK; `id_usuario` FK NULL; `nivel` ENUM('DEBUG','INFO','WARN','ERROR','FATAL'); `mensaje` TEXT; `contexto` JSON; `ip_address`; `user_agent`; `fecha_log`; timestamps.

### audit_trail
- Columnas: `id` PK; `id_empresa` FK; `id_usuario` FK NULL; `tabla`; `id_registro`; `accion` ENUM('CREATE','UPDATE','DELETE','LOGIN','LOGOUT'); `datos_anteriores` JSON; `datos_nuevos` JSON; `ip_address`; `user_agent`; `fecha_accion`; timestamps.

### promociones
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `descripcion`; `tipo` ENUM('DESCUENTO_PORCENTAJE','DESCUENTO_MONTO','PRECIO_FIJO','2X1','3X2','COMBO'); `valor` DECIMAL≥0; fechas (`fecha_inicio`,`fecha_fin`≥inicio); horas (`hora_inicio`,`hora_fin`); `dias_semana` SET; límites (`cantidad_minima`,`cantidad_maxima`,`monto_minimo_compra`,`limite_uso_total`,`limite_uso_cliente`); `usos_actuales`; `prioridad`; `acumulable`; `activo`; timestamps.

### promocion_productos
- Columnas: `id` PK; `id_empresa` FK; `id_promocion` FK CASCADE; `id_producto` FK CASCADE; timestamps.
- Claves: UNIQUE `(id_promocion, id_producto)`.

### promocion_categorias
- Columnas: `id` PK; `id_empresa` FK; `id_promocion` FK CASCADE; `id_categoria` FK CASCADE; timestamps.
- Claves: UNIQUE `(id_promocion, id_categoria)`.

### uso_promociones
- Columnas: `id` PK; `id_empresa` FK; `id_promocion` FK; `id_venta` FK; `id_cliente` FK; `monto_descuento`; `fecha_uso`.

### combos
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `descripcion`; `precio_combo` DECIMAL; `precio_regular` DECIMAL; `ahorro` GENERATED(precio_regular - precio_combo); `imagen_url`; `activo`; timestamps.

### combo_productos
- Columnas: `id` PK; `id_empresa` FK; `id_combo` FK CASCADE; `id_producto` FK CASCADE; `cantidad` INT; timestamps.

### programas_fidelizacion
- Columnas: `id` PK; `id_empresa` FK; `nombre`; `descripcion`; `puntos_por_monto`; `monto_por_punto`; `puntos_minimos_canje`; `fecha_inicio` DATE; `fecha_fin` DATE NULL; `activo`; timestamps.

### puntos_clientes
- Columnas: `id` PK; `id_empresa` FK; `id_cliente` FK; `id_programa` FK; `puntos_acumulados`; `puntos_canjeados`; `puntos_disponibles` GENERATED; fechas de última acumulación/canje; timestamps.
- Claves: UNIQUE `(id_cliente, id_programa)`.

### movimientos_puntos
- Columnas: `id` PK; `id_empresa` FK; `id_cliente` FK; `id_programa` FK; `tipo` ENUM('ACUMULACION','CANJE','EXPIRACION','AJUSTE'); `puntos`; `id_venta` NULL; `descripcion`; `fecha_movimiento`.

### cupones
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `descripcion`; `tipo` ENUM('PORCENTAJE','MONTO_FIJO','ENVIO_GRATIS'); `valor`; `monto_minimo_compra`; `fecha_inicio`; `fecha_fin`; `limite_uso_total`; `limite_uso_cliente`; `usos_actuales`; `activo`; timestamps.

### uso_cupones
- Columnas: `id` PK; `id_empresa` FK; `id_cupon` FK; `id_venta` FK; `id_cliente` FK; `monto_descuento`; `fecha_uso`.

### compras
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_proveedor` FK; `id_usuario` FK; `id_almacen` FK; `numero_compra` UNIQUE por empresa; `fecha_compra`; `fecha_entrega`; `subtotal`; `descuento`; `impuesto`; `total`; `estado` ENUM('PENDIENTE','RECIBIDA','PARCIAL','CANCELADA'); `observaciones`; timestamps.

### detalle_compra
- Columnas: `id` PK; `id_empresa` FK; `id_compra` FK CASCADE; `id_producto` FK; `cantidad_pedida`; `cantidad_recibida`; `precio_unitario`; `descuento`; `subtotal` GENERATED; timestamps.

### gastos
- Columnas: `id` PK; `id_empresa` FK; `id_sucursal` FK; `id_usuario` FK; `categoria_gasto` ENUM('SERVICIOS','SUELDOS','ALQUILER','MANTENIMIENTO','MARKETING','OTROS'); `descripcion`; `monto`; `id_metodo_pago`; `documento_referencia`; `fecha_gasto` DATE; `observaciones`; timestamps.

### cuentas_por_cobrar
- Columnas: `id` PK; `id_empresa` FK; `id_cliente` FK; `id_venta` FK; `monto_total`; `monto_pagado`; `saldo` GENERATED(monto_total - monto_pagado); `fecha_vencimiento` DATE≥creación; `estado` ENUM('PENDIENTE','PARCIAL','PAGADA','VENCIDA'); `observaciones`; timestamps.

### pagos_cuentas_cobrar
- Columnas: `id` PK; `id_empresa` FK; `id_cuenta_cobrar` FK; `monto_pago`; `id_metodo_pago`; `referencia`; `fecha_pago`; `observaciones`; timestamps.

### cuentas_por_pagar
- Columnas: `id` PK; `id_empresa` FK; `id_proveedor` FK; `id_compra` INT NULL FK; `monto_total`; `monto_pagado`; `saldo` GENERATED; `fecha_vencimiento` DATE≥creación; `estado` ENUM('PENDIENTE','PARCIAL','PAGADA','VENCIDA'); `observaciones`; timestamps.

### pagos_cuentas_pagar
- Columnas: `id` PK; `id_empresa` FK; `id_cuenta_pagar` FK; `monto_pago`; `id_metodo_pago`; `referencia`; `fecha_pago`; `observaciones`; timestamps.

### turnos
- Columnas: `id` PK; `id_empresa` FK; `nombre`; `hora_inicio` TIME; `hora_fin` TIME; `dias_semana` SET; `activo`; timestamps.

### asignacion_turnos
- Columnas: `id` PK; `id_empresa` FK; `id_usuario` FK; `id_turno` FK; `fecha_asignacion`; `activo`; `fecha_creacion`.

### notificaciones
- Columnas: `id` PK; `id_empresa` FK; `id_usuario` FK NULL; `tipo` ENUM('INFO','ALERTA','ERROR','EXITO'); `titulo`; `mensaje`; `leida`; `fecha_lectura`; `url_accion`; `fecha_creacion`.

### alertas_stock
- Columnas: `id` PK; `id_empresa` FK; `id_producto` FK; `id_almacen` FK; `tipo_alerta` ENUM('STOCK_MINIMO','STOCK_AGOTADO','STOCK_EXCESO'); `stock_actual`; `stock_referencia`; `resuelta`; `fecha_resolucion`; `fecha_creacion`.

### historial_precios
- Columnas: `id` PK; `id_empresa` FK; `id_producto` FK; `precio_anterior`; `precio_nuevo`; `tipo_precio` ENUM('VENTA','COMPRA'); `id_usuario` FK; `motivo`; `fecha_cambio`.

### impuestos
- Columnas: `id` PK; `id_empresa` FK; `codigo` UNIQUE por empresa; `nombre`; `descripcion`; `porcentaje` DECIMAL(5,2); `tipo` ENUM('IVA','IGV','ISC','IEPS','OTRO'); `por_defecto`; `aplica_ventas`; `aplica_compras`; `activo`; timestamps.
- Nota: IGV por defecto para `id_empresa = 1` según seeds.

### lotes_productos
- Columnas: `id` PK; `id_empresa` FK; `id_producto` FK; `id_almacen` FK; `codigo_lote`; `fecha_fabricacion`; `fecha_vencimiento`; `cantidad`; `precio_compra`; `activo`; timestamps.
- Claves: UNIQUE `(id_producto, id_almacen, codigo_lote)`.

## Relaciones Principales (ERD textual)
- Multi‑tenant: casi todas referencian `empresa(id)` para aislamiento.
- Ventas: `ventas` 1→N `detalle_venta`, 1→N `formas_pago_venta`, 1→N `devoluciones`; referencia `clientes_proveedores`, `usuarios`, `sucursales`, `caja`, `tipo_comprobantes`, `cierrecaja`.
- Productos: `productos` 1→N `stock` por `almacen`; 1→N `movimientos_stock`; N↔N `promociones` via `promocion_productos`; N↔N `combos` via `combo_productos`; 1→N `multiprecios`; 1→N `detalle_venta`; 1→N `detalle_compra`.
- Comprobantes: `tipo_comprobantes` 1→N `serializacion_comprobantes`; `ventas` referencia `tipo_comprobantes`.
- Caja: `cierrecaja` 1→N `movimientos_caja`; `ventas` referencia `caja` y opcionalmente `cierrecaja`.
- Seguridad: `roles` 1→N `usuarios`; `usuarios` 1→N `sesiones`; `permisos` mapea `roles`↔`modulos`; `asignacion_sucursal` vincula `usuarios`↔`sucursales`/`caja`.
- Clientes/Proveedores: `clientes_proveedores` 1→N `ventas` (cliente), 1→N `cuentas_por_cobrar`; como proveedor: 1→N `compras`, 1→N `cuentas_por_pagar`.
- Fidelización: `programas_fidelizacion` 1→N `puntos_clientes` y `movimientos_puntos`; `cupones` y `promociones` se aplican en `ventas`.
- Inventario avanzado: `lotes_productos` por `producto`/`almacen`; `historial_precios` audita cambios; `impuestos` define reglas tributarias por empresa.

## Índices Clave y Optimización
- Multi‑tenant: índice en `id_empresa` + (`activo`/`eliminado`) en tablas operativas.
- `productos`: `idx_codigo_barras`, `idx_nombre`, FULLTEXT (`nombre`,`descripcion`).
- `stock`: `id_empresa,id_producto`; `id_producto,id_almacen` (UNIQUE); `idx_stock_minimo`; `idx_fecha_actualizacion`.
- `movimientos_stock`: por `fecha_movimiento` y `tipo_movimiento`.
- `multiprecios`: por `id_producto, activo`.
- `clientes_proveedores`: `idx_documento`, `idx_nombres`, FULLTEXT.
- `roles`: `id_empresa, activo`.
- `usuarios`: `idx_usuario_empresa_estado`, `idx_username`, `idx_email`, `idx_nro_doc`.
- `sesiones`: `idx_sesion_usuario_activo`, `idx_fecha_expiracion`.
- `asignacion_sucursal`: `idx_asignacion_usuario_sucursal`.
- `permisos`: `idx_permisos_rol_modulo`.
- `metodos_pago`: `id_empresa, codigo`.
- `tipo_comprobantes`: `id_empresa, codigo`.
- `serializacion_comprobantes`: compuesto `id_empresa,id_sucursal,id_tipo_comprobante,serie`.
- `ventas`: `idx_ventas_fecha_sucursal`, `idx_ventas_cliente`, `idx_ventas_numero`, compuesto de reportes (`id_empresa,fecha_venta,id_sucursal,id_tipo_comprobante`).
- `detalle_venta`: `id_venta`, `id_producto,id_sucursal`.
- `formas_pago_venta`: `id_venta,id_metodo_pago`.
- `devoluciones`: `fecha_devolucion, estado`.
- `detalle_devolucion`: `id_devolucion`.
- `cierrecaja`: `estado,fecha_apertura,fecha_cierre`.
- `movimientos_caja`: `fecha_movimiento`, `tipo_movimiento`, `id_cierre_caja`.
- `system_logs`: `nivel`, `fecha_log`, `id_usuario`.
- `audit_trail`: `tabla`, `accion`, `fecha_accion`, `id_usuario`.
- `configuracion_empresa`: `id_empresa, clave`.
- `modulos`: `nombre`.
- `promociones`: `id_empresa,fecha_inicio,fecha_fin`, `activo,prioridad`.
- `compras`: `fecha_compra,id_sucursal`, `id_empresa,numero_compra`.
- `detalle_compra`: `id_compra`, `id_producto`.
- `gastos`: `fecha_gasto`, `categoria_gasto`.
- `cuentas_por_cobrar`: `id_cliente,estado`, `fecha_vencimiento`.
- `pagos_cuentas_cobrar`: `id_cuenta_cobrar,fecha_pago`.
- `cuentas_por_pagar`: `id_proveedor,estado`, `fecha_vencimiento`.
- `pagos_cuentas_pagar`: `id_cuenta_pagar,fecha_pago`.
- `turnos`: `activo`.
- `asignacion_turnos`: `id_usuario,id_turno`.
- `notificaciones`: `id_usuario,leida`.
- `alertas_stock`: `resuelta,fecha_creacion`, `tipo_alerta`, `id_producto,id_almacen`.
- `historial_precios`: `id_producto,fecha_cambio`.
- `impuestos`: `id_empresa,codigo`.
- `lotes_productos`: `id_producto,id_almacen,codigo_lote`, `fecha_vencimiento`.

## Vistas, Procedimientos y Triggers
- Vistas: `v_productos_stock_bajo`, `v_ventas_hoy`, `v_productos_mas_vendidos`, `v_cajas_abiertas`, `v_cuentas_cobrar_vencidas`.
- SPs: `sp_limpiar_sesiones_expiradas`, `sp_obtener_stock_disponible`, `sp_calcular_totales_venta`.
- Triggers: `trg_productos_precio_audit` (audita cambios de precio), `trg_stock_alerta_bajo` (genera alertas de stock bajo).

## Patrón Multitenant y Eliminación Lógica
- Todas las tablas incluyen `id_empresa` y soportan `eliminado/fecha_eliminacion`.
- Integridad referencial mediante FKs, `ON DELETE CASCADE` donde aplica (ej. multiprecios, combos, promociones).

## Notas Operativas
- Serialización de comprobantes: control por `id_sucursal + id_tipo_comprobante + serie`, con `numero_actual`.
- Ventas: `monto_total` y totales calculados por SP; columnas duplicadas antiguas (`subtotal`, `impuesto`, `total`) fueron normalizadas.
- Stock y alertas: reglas de negocio reforzadas por checks y triggers.