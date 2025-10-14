-- =====================================================
-- CORRECCIONES CRÍTICAS Y MEJORAS - SISTEMA POS
-- Ejecutar después de crear la base de datos inicial
-- =====================================================

-- =====================================================
-- PARTE 1: CORRECCIONES CRÍTICAS
-- =====================================================

-- 1. CREAR TABLA DE TIPOS DE DOCUMENTO (FALTANTE)
-- =====================================================
CREATE TABLE IF NOT EXISTS tipos_documento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    longitud_minima INT DEFAULT 8,
    longitud_maxima INT DEFAULT 20,
    patron_validacion VARCHAR(100),
    requiere_validacion BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_codigo_tipo_doc (codigo),
    INDEX idx_activo_tipo_doc (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar tipos de documento comunes en Perú
INSERT INTO tipos_documento (codigo, nombre, descripcion, longitud_minima, longitud_maxima, patron_validacion, requiere_validacion) VALUES
('DNI', 'Documento Nacional de Identidad', 'DNI para personas naturales peruanas', 8, 8, '^[0-9]{8}$', TRUE),
('RUC', 'Registro Único de Contribuyentes', 'RUC para empresas y personas jurídicas', 11, 11, '^[0-9]{11}$', TRUE),
('CE', 'Carnet de Extranjería', 'Documento para extranjeros residentes', 9, 12, '^[0-9A-Z]{9,12}$', FALSE),
('PAS', 'Pasaporte', 'Pasaporte internacional', 8, 12, '^[0-9A-Z]{8,12}$', FALSE),
('OTRO', 'Otro Documento', 'Otros tipos de documentos', 1, 20, NULL, FALSE);

-- 2. AGREGAR FOREIGN KEY EN USUARIOS PARA TIPO DE DOCUMENTO
-- =====================================================
-- Primero, actualizar registros existentes con tipo de documento por defecto
UPDATE usuarios 
SET id_tipodocumento = (SELECT id FROM tipos_documento WHERE codigo = 'DNI' LIMIT 1)
WHERE id_tipodocumento IS NULL;

-- Agregar la foreign key
ALTER TABLE usuarios
  ADD CONSTRAINT fk_usuarios_tipo_documento
  FOREIGN KEY (id_tipodocumento) REFERENCES tipos_documento(id);

-- 3. CORREGIR DUPLICACIÓN DE CAMPOS EN TABLA VENTAS
-- =====================================================
-- Eliminar campos duplicados en inglés, mantener solo español
ALTER TABLE ventas
  DROP COLUMN IF EXISTS subtotal,
  DROP COLUMN IF EXISTS impuesto;

-- Renombrar 'total' a 'monto_total' si existe
-- (Nota: Verificar primero si existe antes de ejecutar)
-- ALTER TABLE ventas CHANGE COLUMN total monto_total DECIMAL(10,2) NOT NULL DEFAULT 0.00;

-- 4. CORREGIR DUPLICACIÓN EN DETALLE_VENTA
-- =====================================================
-- Eliminar campo 'total' calculado duplicado
ALTER TABLE detalle_venta
  DROP COLUMN IF EXISTS total;

-- Modificar subtotal para usar precio_venta en lugar de precio_unitario
ALTER TABLE detalle_venta
  DROP COLUMN IF EXISTS subtotal;

ALTER TABLE detalle_venta
  ADD COLUMN subtotal DECIMAL(10,2) 
    GENERATED ALWAYS AS ((cantidad * precio_venta) - descuento) STORED
    AFTER descuento;

-- 5. CORREGIR DUPLICACIÓN EN TABLA STOCK
-- =====================================================
-- Eliminar campo 'stock' duplicado, mantener 'cantidad_actual'
ALTER TABLE stock
  DROP COLUMN IF EXISTS stock;

-- 6. CORREGIR DUPLICACIÓN EN SERIALIZACION_COMPROBANTES
-- =====================================================
-- Eliminar campo 'correlativo' duplicado
ALTER TABLE serializacion_comprobantes
  DROP COLUMN IF EXISTS correlativo;

-- =====================================================
-- PARTE 2: AGREGAR VALIDACIONES (CONSTRAINTS)
-- =====================================================

-- Validar precios positivos en productos
ALTER TABLE productos
  ADD CONSTRAINT chk_precio_venta_positivo 
    CHECK (precio_venta >= 0);

ALTER TABLE productos
  ADD CONSTRAINT chk_precio_compra_no_negativo 
    CHECK (precio_compra >= 0);

-- Validar stock no negativo (si no permites stock negativo)
ALTER TABLE stock
  ADD CONSTRAINT chk_cantidad_no_negativa 
    CHECK (cantidad_actual >= 0);

ALTER TABLE stock
  ADD CONSTRAINT chk_cantidad_reservada_no_negativa 
    CHECK (cantidad_reservada >= 0);

-- Validar que cantidad reservada no supere cantidad actual
ALTER TABLE stock
  ADD CONSTRAINT chk_reservada_menor_actual 
    CHECK (cantidad_reservada <= cantidad_actual);

-- Validar montos en ventas
ALTER TABLE ventas
  ADD CONSTRAINT chk_monto_total_positivo 
    CHECK (monto_total >= 0);

ALTER TABLE ventas
  ADD CONSTRAINT chk_descuento_no_negativo 
    CHECK (descuento >= 0);

-- Validar cantidades en detalle_venta
ALTER TABLE detalle_venta
  ADD CONSTRAINT chk_cantidad_positiva 
    CHECK (cantidad > 0);

ALTER TABLE detalle_venta
  ADD CONSTRAINT chk_precio_venta_positivo_detalle 
    CHECK (precio_venta >= 0);

-- Validar fechas de vencimiento en cuentas por cobrar
ALTER TABLE cuentas_por_cobrar
  ADD CONSTRAINT chk_fecha_vencimiento_valida 
    CHECK (fecha_vencimiento >= DATE(fecha_creacion));

-- Validar fechas de vencimiento en cuentas por pagar
ALTER TABLE cuentas_por_pagar
  ADD CONSTRAINT chk_fecha_vencimiento_valida_cxp 
    CHECK (fecha_vencimiento >= DATE(fecha_creacion));

-- Validar montos en movimientos de caja
ALTER TABLE movimientos_caja
  ADD CONSTRAINT chk_monto_positivo_movimiento 
    CHECK (monto > 0);

-- Validar fechas en promociones
ALTER TABLE promociones
  ADD CONSTRAINT chk_fechas_promocion_validas 
    CHECK (fecha_fin >= fecha_inicio);

-- Validar valor de promoción
ALTER TABLE promociones
  ADD CONSTRAINT chk_valor_promocion_positivo 
    CHECK (valor >= 0);

-- =====================================================
-- PARTE 3: TABLAS ADICIONALES RECOMENDADAS
-- =====================================================

-- TABLA DE HISTORIAL DE PRECIOS
-- =====================================================
CREATE TABLE IF NOT EXISTS historial_precios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_producto INT NOT NULL,
    precio_anterior DECIMAL(10,2) NOT NULL,
    precio_nuevo DECIMAL(10,2) NOT NULL,
    tipo_precio ENUM('VENTA', 'COMPRA') NOT NULL,
    id_usuario INT NOT NULL,
    motivo VARCHAR(255),
    fecha_cambio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_producto_fecha (id_producto, fecha_cambio),
    INDEX idx_empresa_fecha (id_empresa, fecha_cambio),
    INDEX idx_tipo_precio (tipo_precio)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE IMPUESTOS (SEPARADA DE EMPRESA)
-- =====================================================
CREATE TABLE IF NOT EXISTS impuestos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    porcentaje DECIMAL(5,2) NOT NULL,
    tipo ENUM('IVA', 'IGV', 'ISC', 'IEPS', 'OTRO') NOT NULL,
    por_defecto BOOLEAN DEFAULT FALSE,
    aplica_ventas BOOLEAN DEFAULT TRUE,
    aplica_compras BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa_impuesto (id_empresa, codigo),
    INDEX idx_empresa_activo_impuesto (id_empresa, activo, eliminado),
    INDEX idx_por_defecto (id_empresa, por_defecto, activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insertar IGV por defecto para la empresa demo
INSERT INTO impuestos (id_empresa, codigo, nombre, descripcion, porcentaje, tipo, por_defecto)
SELECT id, 'IGV', 'Impuesto General a las Ventas', 'IGV 18% Perú', 18.00, 'IGV', TRUE
FROM empresa
WHERE id = 1
ON DUPLICATE KEY UPDATE id=id;

-- TABLA DE LOTES/BATCH (Para productos con fecha de vencimiento)
-- =====================================================
CREATE TABLE IF NOT EXISTS lotes_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_producto INT NOT NULL,
    id_almacen INT NOT NULL,
    codigo_lote VARCHAR(50) NOT NULL,
    fecha_fabricacion DATE,
    fecha_vencimiento DATE,
    cantidad INT NOT NULL DEFAULT 0,
    precio_compra DECIMAL(10,2),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    UNIQUE KEY unique_lote_producto_almacen (id_producto, id_almacen, codigo_lote),
    INDEX idx_fecha_vencimiento (fecha_vencimiento, activo),
    INDEX idx_producto_almacen_lote (id_producto, id_almacen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- PARTE 4: ÍNDICES ADICIONALES PARA RENDIMIENTO
-- =====================================================

-- Índice FULLTEXT para búsqueda de productos
ALTER TABLE productos
  ADD FULLTEXT INDEX idx_productos_busqueda (nombre, descripcion);

-- Índice FULLTEXT para búsqueda de clientes
ALTER TABLE clientes_proveedores
  ADD FULLTEXT INDEX idx_clientes_busqueda (nombres, apellidos, razon_social);

-- Índice compuesto para reportes de ventas
CREATE INDEX idx_ventas_reporte_completo 
  ON ventas(id_empresa, estado, fecha_venta, monto_total);

-- Índice para stock bajo
CREATE INDEX idx_stock_bajo 
  ON stock(id_empresa, id_almacen, cantidad_actual, stock_minimo);

-- Índice para limpieza de sesiones expiradas
CREATE INDEX idx_sesiones_limpieza 
  ON sesiones(activo, fecha_expiracion, eliminado);

-- Índice para auditoría por tabla
CREATE INDEX idx_audit_tabla_fecha 
  ON audit_trail(tabla, id_registro, fecha_accion);

-- =====================================================
-- PARTE 5: VISTAS PARA REPORTES
-- =====================================================

-- Vista de productos con stock bajo
CREATE OR REPLACE VIEW v_productos_stock_bajo AS
SELECT 
  p.id,
  p.id_empresa,
  p.codigo,
  p.nombre,
  c.nombre AS categoria,
  s.cantidad_actual,
  s.stock_minimo,
  (s.stock_minimo - s.cantidad_actual) AS faltante,
  a.nombre AS almacen,
  suc.nombre AS sucursal
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id
INNER JOIN stock s ON p.id = s.id_producto
INNER JOIN almacen a ON s.id_almacen = a.id
INNER JOIN sucursales suc ON a.id_sucursal = suc.id
WHERE s.cantidad_actual <= s.stock_minimo
  AND p.activo = TRUE
  AND p.eliminado = FALSE
  AND s.cantidad_actual >= 0;

-- Vista de ventas del día
CREATE OR REPLACE VIEW v_ventas_hoy AS
SELECT 
  v.id,
  v.id_empresa,
  v.serie,
  v.numero,
  CONCAT(v.serie, '-', LPAD(v.numero, 8, '0')) AS numero_comprobante,
  v.fecha_venta,
  v.monto_total,
  v.estado,
  CONCAT(u.nombres, ' ', u.apellidos) AS vendedor,
  COALESCE(CONCAT(c.nombres, ' ', c.apellidos), c.razon_social, 'Cliente Genérico') AS cliente,
  suc.nombre AS sucursal,
  caj.nombre AS caja
FROM ventas v
INNER JOIN usuarios u ON v.id_usuario = u.id
LEFT JOIN clientes_proveedores c ON v.id_cliente = c.id
INNER JOIN sucursales suc ON v.id_sucursal = suc.id
INNER JOIN caja caj ON v.id_caja = caj.id
WHERE DATE(v.fecha_venta) = CURDATE()
  AND v.eliminado = FALSE;

-- Vista de productos más vendidos (últimos 30 días)
CREATE OR REPLACE VIEW v_productos_mas_vendidos AS
SELECT 
  p.id,
  p.id_empresa,
  p.codigo,
  p.nombre,
  c.nombre AS categoria,
  SUM(dv.cantidad) AS total_vendido,
  SUM(dv.subtotal) AS total_ingresos,
  COUNT(DISTINCT dv.id_venta) AS numero_ventas,
  AVG(dv.precio_venta) AS precio_promedio
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id
INNER JOIN detalle_venta dv ON p.id = dv.id_producto
INNER JOIN ventas v ON dv.id_venta = v.id
WHERE v.estado = 'COMPLETADA'
  AND v.eliminado = FALSE
  AND dv.eliminado = FALSE
  AND DATE(v.fecha_venta) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
GROUP BY p.id, p.codigo, p.nombre, c.nombre, p.id_empresa
ORDER BY total_vendido DESC;

-- Vista de caja actual (estado de cajas abiertas)
CREATE OR REPLACE VIEW v_cajas_abiertas AS
SELECT 
  cc.id,
  cc.id_empresa,
  cc.id_caja,
  caj.nombre AS caja,
  suc.nombre AS sucursal,
  CONCAT(u.nombres, ' ', u.apellidos) AS cajero,
  cc.fecha_apertura,
  cc.monto_inicial,
  COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'INGRESO' THEN mc.monto ELSE 0 END), 0) AS total_ingresos,
  COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'EGRESO' THEN mc.monto ELSE 0 END), 0) AS total_egresos,
  COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'VENTA' THEN mc.monto ELSE 0 END), 0) AS total_ventas,
  (cc.monto_inicial + 
   COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'INGRESO' THEN mc.monto ELSE 0 END), 0) +
   COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'VENTA' THEN mc.monto ELSE 0 END), 0) -
   COALESCE(SUM(CASE WHEN mc.tipo_movimiento = 'EGRESO' THEN mc.monto ELSE 0 END), 0)
  ) AS monto_actual_calculado
FROM cierrecaja cc
INNER JOIN caja caj ON cc.id_caja = caj.id
INNER JOIN sucursales suc ON cc.id_sucursal = suc.id
INNER JOIN usuarios u ON cc.id_usuario = u.id
LEFT JOIN movimientos_caja mc ON cc.id = mc.id_cierre_caja AND mc.eliminado = FALSE
WHERE cc.estado = 'ABIERTO'
  AND cc.eliminado = FALSE
GROUP BY cc.id, cc.id_empresa, cc.id_caja, caj.nombre, suc.nombre, 
         u.nombres, u.apellidos, cc.fecha_apertura, cc.monto_inicial;

-- Vista de cuentas por cobrar vencidas
CREATE OR REPLACE VIEW v_cuentas_cobrar_vencidas AS
SELECT 
  cxc.id,
  cxc.id_empresa,
  COALESCE(CONCAT(cp.nombres, ' ', cp.apellidos), cp.razon_social) AS cliente,
  cp.documento,
  cxc.monto_total,
  cxc.monto_pagado,
  cxc.saldo,
  cxc.fecha_vencimiento,
  DATEDIFF(CURDATE(), cxc.fecha_vencimiento) AS dias_vencidos,
  v.serie,
  v.numero,
  CONCAT(v.serie, '-', LPAD(v.numero, 8, '0')) AS comprobante
FROM cuentas_por_cobrar cxc
INNER JOIN clientes_proveedores cp ON cxc.id_cliente = cp.id
INNER JOIN ventas v ON cxc.id_venta = v.id
WHERE cxc.estado IN ('PENDIENTE', 'PARCIAL')
  AND cxc.fecha_vencimiento < CURDATE()
  AND cxc.eliminado = FALSE
ORDER BY dias_vencidos DESC;

-- =====================================================
-- PARTE 6: PROCEDIMIENTOS ALMACENADOS
-- =====================================================

-- Procedimiento para limpiar sesiones expiradas
DELIMITER //
CREATE PROCEDURE sp_limpiar_sesiones_expiradas()
BEGIN
  UPDATE sesiones 
  SET activo = FALSE, 
      eliminado = TRUE,
      fecha_eliminacion = CURRENT_TIMESTAMP
  WHERE fecha_expiracion < CURRENT_TIMESTAMP 
    AND activo = TRUE
    AND eliminado = FALSE;
    
  SELECT ROW_COUNT() AS sesiones_limpiadas;
END //
DELIMITER ;

-- Procedimiento para obtener stock disponible de un producto
DELIMITER //
CREATE PROCEDURE sp_obtener_stock_disponible(
  IN p_id_producto INT,
  IN p_id_almacen INT
)
BEGIN
  SELECT 
    p.id,
    p.codigo,
    p.nombre,
    s.cantidad_actual,
    s.cantidad_reservada,
    s.cantidad_disponible,
    s.stock_minimo,
    CASE 
      WHEN s.cantidad_disponible <= 0 THEN 'AGOTADO'
      WHEN s.cantidad_disponible <= s.stock_minimo THEN 'BAJO'
      ELSE 'DISPONIBLE'
    END AS estado_stock
  FROM productos p
  INNER JOIN stock s ON p.id = s.id_producto
  WHERE p.id = p_id_producto
    AND s.id_almacen = p_id_almacen
    AND p.activo = TRUE
    AND p.eliminado = FALSE;
END //
DELIMITER ;

-- Procedimiento para calcular totales de venta
DELIMITER //
CREATE PROCEDURE sp_calcular_totales_venta(
  IN p_id_venta INT
)
BEGIN
  DECLARE v_subtotal DECIMAL(10,2);
  DECLARE v_descuento DECIMAL(10,2);
  DECLARE v_impuesto DECIMAL(10,2);
  DECLARE v_total DECIMAL(10,2);
  DECLARE v_porcentaje_impuesto DECIMAL(5,2);
  
  -- Obtener porcentaje de impuesto de la empresa
  SELECT e.valor_impuesto INTO v_porcentaje_impuesto
  FROM ventas v
  INNER JOIN empresa e ON v.id_empresa = e.id
  WHERE v.id = p_id_venta;
  
  -- Calcular subtotal
  SELECT SUM(subtotal) INTO v_subtotal
  FROM detalle_venta
  WHERE id_venta = p_id_venta
    AND eliminado = FALSE;
  
  -- Obtener descuento de la venta
  SELECT descuento INTO v_descuento
  FROM ventas
  WHERE id = p_id_venta;
  
  -- Calcular impuesto
  SET v_impuesto = (v_subtotal - v_descuento) * (v_porcentaje_impuesto / 100);
  
  -- Calcular total
  SET v_total = v_subtotal - v_descuento + v_impuesto;
  
  -- Actualizar venta
  UPDATE ventas
  SET sub_total = v_subtotal,
      total_impuestos = v_impuesto,
      monto_total = v_total,
      cantidad_productos = (
        SELECT SUM(cantidad) 
        FROM detalle_venta 
        WHERE id_venta = p_id_venta AND eliminado = FALSE
      )
  WHERE id = p_id_venta;
  
  -- Retornar resultados
  SELECT v_subtotal AS subtotal, 
         v_descuento AS descuento, 
         v_impuesto AS impuesto, 
         v_total AS total;
END //
DELIMITER ;

-- =====================================================
-- PARTE 7: TRIGGERS PARA AUDITORÍA AUTOMÁTICA
-- =====================================================

-- Trigger para auditar cambios de precio en productos
DELIMITER //
CREATE TRIGGER trg_productos_precio_audit
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
  IF OLD.precio_venta != NEW.precio_venta THEN
    INSERT INTO historial_precios (
      id_empresa, id_producto, precio_anterior, precio_nuevo, 
      tipo_precio, id_usuario, motivo
    ) VALUES (
      NEW.id_empresa, NEW.id, OLD.precio_venta, NEW.precio_venta,
      'VENTA', COALESCE(@current_user_id, 1), 'Actualización de precio'
    );
  END IF;
  
  IF OLD.precio_compra != NEW.precio_compra THEN
    INSERT INTO historial_precios (
      id_empresa, id_producto, precio_anterior, precio_nuevo, 
      tipo_precio, id_usuario, motivo
    ) VALUES (
      NEW.id_empresa, NEW.id, OLD.precio_compra, NEW.precio_compra,
      'COMPRA', COALESCE(@current_user_id, 1), 'Actualización de costo'
    );
  END IF;
END //
DELIMITER ;

-- Trigger para crear alerta de stock bajo
DELIMITER //
CREATE TRIGGER trg_stock_alerta_bajo
AFTER UPDATE ON stock
FOR EACH ROW
BEGIN
  -- Si el stock actual es menor o igual al mínimo y antes no lo era
  IF NEW.cantidad_actual <= NEW.stock_minimo 
     AND OLD.cantidad_actual > OLD.stock_minimo THEN
    INSERT INTO alertas_stock (
      id_empresa, id_producto, id_almacen, 
      tipo_alerta, stock_actual, stock_referencia
    ) VALUES (
      NEW.id_empresa, NEW.id_producto, NEW.id_almacen,
      CASE 
        WHEN NEW.cantidad_actual = 0 THEN 'STOCK_AGOTADO'
        ELSE 'STOCK_MINIMO'
      END,
      NEW.cantidad_actual, NEW.stock_minimo
    );
  END IF;
  
  -- Resolver alerta si el stock vuelve a estar por encima del mínimo
  IF NEW.cantidad_actual > NEW.stock_minimo 
     AND OLD.cantidad_actual <= OLD.stock_minimo THEN
    UPDATE alertas_stock
    SET resuelta = TRUE,
        fecha_resolucion = CURRENT_TIMESTAMP
    WHERE id_producto = NEW.id_producto
      AND id_almacen = NEW.id_almacen
      AND resuelta = FALSE;
  END IF;
END //
DELIMITER ;

-- =====================================================
-- MENSAJE FINAL
-- =====================================================
SELECT '✅ Correcciones críticas y mejoras aplicadas exitosamente' AS mensaje;
SELECT 'ℹ️  Revisa las vistas creadas para reportes rápidos' AS info;
SELECT '⚠️  Recuerda ejecutar ANALYZE TABLE después de cargar datos' AS recomendacion;
