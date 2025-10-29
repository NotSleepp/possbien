-- =====================================================
-- MEJORAS AL ESQUEMA - TABLAS ADICIONALES PARA POS PROFESIONAL
-- Ejecutar después del schema.sql principal
-- =====================================================

-- TABLA DE PROMOCIONES
CREATE TABLE IF NOT EXISTS promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('DESCUENTO_PORCENTAJE', 'DESCUENTO_MONTO', 'PRECIO_FIJO', '2X1', '3X2', 'COMBO') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    hora_inicio TIME,
    hora_fin TIME,
    dias_semana SET('LUN','MAR','MIE','JUE','VIE','SAB','DOM'),
    cantidad_minima INT DEFAULT 1,
    cantidad_maxima INT,
    monto_minimo_compra DECIMAL(10,2),
    limite_uso_total INT,
    limite_uso_cliente INT,
    usos_actuales INT DEFAULT 0,
    prioridad INT DEFAULT 0,
    acumulable BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa_promo (id_empresa, codigo),
    INDEX idx_fechas_promo (fecha_inicio, fecha_fin, activo),
    INDEX idx_tipo_promo (tipo, activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- TABLA DE PRODUCTOS EN PROMOCIÓN
CREATE TABLE IF NOT EXISTS promocion_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_promocion INT NOT NULL,
    id_producto INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_promocion) REFERENCES promociones(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promo_producto (id_promocion, id_producto),
    INDEX idx_producto_promo (id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE CATEGORÍAS EN PROMOCIÓN
CREATE TABLE IF NOT EXISTS promocion_categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_promocion INT NOT NULL,
    id_categoria INT NOT NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_promocion) REFERENCES promociones(id) ON DELETE CASCADE,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE,
    UNIQUE KEY unique_promo_categoria (id_promocion, id_categoria),
    INDEX idx_categoria_promo (id_categoria)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE USO DE PROMOCIONES
CREATE TABLE IF NOT EXISTS uso_promociones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_promocion INT NOT NULL,
    id_venta INT NOT NULL,
    id_cliente INT,
    monto_descuento DECIMAL(10,2) NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_promocion) REFERENCES promociones(id),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes_proveedores(id),
    INDEX idx_fecha_uso_promo (fecha_uso),
    INDEX idx_cliente_promo (id_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE COMBOS
CREATE TABLE IF NOT EXISTS combos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_combo DECIMAL(10,2) NOT NULL,
    precio_regular DECIMAL(10,2),
    ahorro DECIMAL(10,2) GENERATED ALWAYS AS (precio_regular - precio_combo) STORED,
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa_combo (id_empresa, codigo),
    INDEX idx_activo_combo (activo, eliminado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE PRODUCTOS EN COMBO
CREATE TABLE IF NOT EXISTS combo_productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_combo INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL DEFAULT 1,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_combo) REFERENCES combos(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
    INDEX idx_combo (id_combo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE PROGRAMAS DE FIDELIZACIÓN
CREATE TABLE IF NOT EXISTS programas_fidelizacion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    puntos_por_monto DECIMAL(10,2) DEFAULT 1.00,
    monto_por_punto DECIMAL(10,2) DEFAULT 1.00,
    puntos_minimos_canje INT DEFAULT 100,
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    INDEX idx_activo_fidelizacion (activo, eliminado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE PUNTOS DE CLIENTES
CREATE TABLE IF NOT EXISTS puntos_clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_cliente INT NOT NULL,
    id_programa INT NOT NULL,
    puntos_acumulados INT DEFAULT 0,
    puntos_canjeados INT DEFAULT 0,
    puntos_disponibles INT GENERATED ALWAYS AS (puntos_acumulados - puntos_canjeados) STORED,
    fecha_ultima_acumulacion TIMESTAMP NULL,
    fecha_ultima_canje TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes_proveedores(id),
    FOREIGN KEY (id_programa) REFERENCES programas_fidelizacion(id),
    UNIQUE KEY unique_cliente_programa (id_cliente, id_programa),
    INDEX idx_cliente_puntos (id_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE MOVIMIENTOS DE PUNTOS
CREATE TABLE IF NOT EXISTS movimientos_puntos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_cliente INT NOT NULL,
    id_programa INT NOT NULL,
    tipo ENUM('ACUMULACION', 'CANJE', 'EXPIRACION', 'AJUSTE') NOT NULL,
    puntos INT NOT NULL,
    id_venta INT,
    descripcion VARCHAR(255),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes_proveedores(id),
    FOREIGN KEY (id_programa) REFERENCES programas_fidelizacion(id),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    INDEX idx_cliente_movimiento (id_cliente, fecha_movimiento),
    INDEX idx_tipo_movimiento_puntos (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE CUPONES/VALES DE DESCUENTO
CREATE TABLE IF NOT EXISTS cupones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    tipo ENUM('PORCENTAJE', 'MONTO_FIJO', 'ENVIO_GRATIS') NOT NULL,
    valor DECIMAL(10,2) NOT NULL,
    monto_minimo_compra DECIMAL(10,2),
    fecha_inicio DATE NOT NULL,
    fecha_fin DATE NOT NULL,
    limite_uso_total INT,
    limite_uso_cliente INT DEFAULT 1,
    usos_actuales INT DEFAULT 0,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa_cupon (id_empresa, codigo),
    INDEX idx_codigo_cupon (codigo),
    INDEX idx_fechas_cupon (fecha_inicio, fecha_fin, activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE USO DE CUPONES
CREATE TABLE IF NOT EXISTS uso_cupones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_cupon INT NOT NULL,
    id_venta INT NOT NULL,
    id_cliente INT,
    monto_descuento DECIMAL(10,2) NOT NULL,
    fecha_uso TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_cupon) REFERENCES cupones(id),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes_proveedores(id),
    INDEX idx_cupon_uso (id_cupon),
    INDEX idx_cliente_cupon (id_cliente)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- AJUSTE DE UNICIDAD EN USUARIOS POR EMPRESA
-- Antes: username único global
-- Ahora: unicidad compuesta por (id_empresa, username)
-- =====================================================

-- Intentar eliminar índice único existente sobre username (nombre típico: 'username')
ALTER TABLE usuarios DROP INDEX username;

-- En caso de que el nombre del índice difiera (p.ej., 'usuarios_username_unique'), intentar también
ALTER TABLE usuarios DROP INDEX usuarios_username_unique;

-- Crear índice único compuesto por empresa y username
ALTER TABLE usuarios ADD UNIQUE KEY unique_empresa_username (id_empresa, username);

-- TABLA DE COMPRAS A PROVEEDORES
CREATE TABLE IF NOT EXISTS compras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_proveedor INT NOT NULL,
    id_usuario INT NOT NULL,
    id_almacen INT NOT NULL,
    numero_compra VARCHAR(50) NOT NULL,
    fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_entrega DATE,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    impuesto DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('PENDIENTE', 'RECIBIDA', 'PARCIAL', 'CANCELADA') DEFAULT 'PENDIENTE',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_proveedor) REFERENCES clientes_proveedores(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    UNIQUE KEY unique_numero_compra_empresa (id_empresa, numero_compra),
    INDEX idx_fecha_compra (fecha_compra),
    INDEX idx_estado_compra (estado),
    INDEX idx_proveedor (id_proveedor)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE DETALLE DE COMPRAS
CREATE TABLE IF NOT EXISTS detalle_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_compra INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad_pedida INT NOT NULL,
    cantidad_recibida INT DEFAULT 0,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS ((cantidad_pedida * precio_unitario) - descuento) STORED,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_compra) REFERENCES compras(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    INDEX idx_compra (id_compra),
    INDEX idx_producto_compra (id_producto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE GASTOS/EGRESOS
CREATE TABLE IF NOT EXISTS gastos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_usuario INT NOT NULL,
    categoria_gasto ENUM('SERVICIOS', 'SUELDOS', 'ALQUILER', 'MANTENIMIENTO', 'MARKETING', 'OTROS') NOT NULL,
    descripcion VARCHAR(255) NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    id_metodo_pago INT,
    documento_referencia VARCHAR(100),
    fecha_gasto DATE NOT NULL,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id),
    INDEX idx_fecha_gasto (fecha_gasto),
    INDEX idx_categoria_gasto (categoria_gasto)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE CUENTAS POR COBRAR
CREATE TABLE IF NOT EXISTS cuentas_por_cobrar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_cliente INT NOT NULL,
    id_venta INT NOT NULL,
    monto_total DECIMAL(10,2) NOT NULL,
    monto_pagado DECIMAL(10,2) DEFAULT 0.00,
    saldo DECIMAL(10,2) GENERATED ALWAYS AS (monto_total - monto_pagado) STORED,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('PENDIENTE', 'PARCIAL', 'PAGADA', 'VENCIDA') DEFAULT 'PENDIENTE',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes_proveedores(id),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    INDEX idx_cliente_cxc (id_cliente),
    INDEX idx_estado_cxc (estado),
    INDEX idx_fecha_vencimiento (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE PAGOS DE CUENTAS POR COBRAR
CREATE TABLE IF NOT EXISTS pagos_cuentas_cobrar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_cuenta_cobrar INT NOT NULL,
    monto_pago DECIMAL(10,2) NOT NULL,
    id_metodo_pago INT NOT NULL,
    referencia VARCHAR(100),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_cuenta_cobrar) REFERENCES cuentas_por_cobrar(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id),
    INDEX idx_cuenta_cobrar (id_cuenta_cobrar),
    INDEX idx_fecha_pago (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE CUENTAS POR PAGAR
CREATE TABLE IF NOT EXISTS cuentas_por_pagar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_proveedor INT NOT NULL,
    id_compra INT,
    monto_total DECIMAL(10,2) NOT NULL,
    monto_pagado DECIMAL(10,2) DEFAULT 0.00,
    saldo DECIMAL(10,2) GENERATED ALWAYS AS (monto_total - monto_pagado) STORED,
    fecha_vencimiento DATE NOT NULL,
    estado ENUM('PENDIENTE', 'PARCIAL', 'PAGADA', 'VENCIDA') DEFAULT 'PENDIENTE',
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_proveedor) REFERENCES clientes_proveedores(id),
    FOREIGN KEY (id_compra) REFERENCES compras(id),
    INDEX idx_proveedor_cxp (id_proveedor),
    INDEX idx_estado_cxp (estado),
    INDEX idx_fecha_vencimiento_cxp (fecha_vencimiento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE PAGOS DE CUENTAS POR PAGAR
CREATE TABLE IF NOT EXISTS pagos_cuentas_pagar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_cuenta_pagar INT NOT NULL,
    monto_pago DECIMAL(10,2) NOT NULL,
    id_metodo_pago INT NOT NULL,
    referencia VARCHAR(100),
    fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_cuenta_pagar) REFERENCES cuentas_por_pagar(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id),
    INDEX idx_cuenta_pagar (id_cuenta_pagar),
    INDEX idx_fecha_pago_cxp (fecha_pago)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE TURNOS DE TRABAJO
CREATE TABLE IF NOT EXISTS turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    dias_semana SET('LUN','MAR','MIE','JUE','VIE','SAB','DOM') NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    INDEX idx_activo_turno (activo, eliminado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE ASIGNACIÓN DE TURNOS A USUARIOS
CREATE TABLE IF NOT EXISTS asignacion_turnos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_usuario INT NOT NULL,
    id_turno INT NOT NULL,
    fecha_asignacion DATE NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_turno) REFERENCES turnos(id),
    INDEX idx_usuario_turno (id_usuario, fecha_asignacion),
    INDEX idx_fecha_asignacion (fecha_asignacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE NOTIFICACIONES
CREATE TABLE IF NOT EXISTS notificaciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_usuario INT,
    tipo ENUM('INFO', 'ALERTA', 'ERROR', 'EXITO') NOT NULL,
    titulo VARCHAR(200) NOT NULL,
    mensaje TEXT NOT NULL,
    leida BOOLEAN DEFAULT FALSE,
    fecha_lectura TIMESTAMP NULL,
    url_accion VARCHAR(255),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_usuario_leida (id_usuario, leida),
    INDEX idx_fecha_creacion_notif (fecha_creacion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- TABLA DE ALERTAS DE STOCK
CREATE TABLE IF NOT EXISTS alertas_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_producto INT NOT NULL,
    id_almacen INT NOT NULL,
    tipo_alerta ENUM('STOCK_MINIMO', 'STOCK_AGOTADO', 'STOCK_EXCESO') NOT NULL,
    stock_actual INT NOT NULL,
    stock_referencia INT NOT NULL,
    resuelta BOOLEAN DEFAULT FALSE,
    fecha_resolucion TIMESTAMP NULL,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    INDEX idx_resuelta (resuelta),
    INDEX idx_tipo_alerta (tipo_alerta),
    INDEX idx_producto_almacen_alerta (id_producto, id_almacen)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
