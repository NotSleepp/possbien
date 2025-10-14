-- =====================================================
-- ESQUEMA DE BASE DE DATOS MULTITENANT - POS SYSTEM
-- Todas las tablas incluyen id_empresa para aislamiento
-- Soporte para eliminación lógica (soft delete)
-- =====================================================

-- Tabla de empresas (tenant principal)
CREATE TABLE IF NOT EXISTS empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL, -- Nombre comercial del negocio
    id_fiscal VARCHAR(20) NOT NULL UNIQUE, -- RUC, CUIT, etc.
    direccion_fiscal TEXT, -- Domicilio legal
    simbolo_moneda VARCHAR(10) DEFAULT '$', -- Símbolo de la moneda
    logo VARCHAR(500), -- URL de la imagen del logo
    id_auth VARCHAR(100), -- ID del usuario propietario en el sistema de autenticación
    id_usuario INT, -- ID del usuario superadmin de la empresa
    iso VARCHAR(3) DEFAULT 'PE', -- Código del país
    pais VARCHAR(100) DEFAULT 'Perú', -- Nombre del país
    currency VARCHAR(3) DEFAULT 'PEN', -- Código de la moneda
    impuesto VARCHAR(50) DEFAULT 'IGV', -- Nombre del impuesto principal
    valor_impuesto DECIMAL(5,2) DEFAULT 18.00, -- Porcentaje del impuesto
    nombre_moneda VARCHAR(50) DEFAULT 'Soles', -- Nombre completo de la moneda
    correo VARCHAR(100), -- Email principal de la empresa
    pie_pagina_ticket TEXT, -- Texto que aparece al final de los tickets
    -- Campos originales mantenidos para compatibilidad
    ruc VARCHAR(20), -- Mantenido como alias de id_fiscal
    razon_social VARCHAR(255), -- Mantenido para compatibilidad
    nombre_comercial VARCHAR(255), -- Mantenido como alias de nombre
    direccion TEXT, -- Mantenido como alias de direccion_fiscal
    telefono VARCHAR(20),
    email VARCHAR(100), -- Mantenido como alias de correo
    logo_url VARCHAR(500), -- Mantenido como alias de logo
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL
);

-- Tabla de configuración por empresa
CREATE TABLE IF NOT EXISTS configuracion_empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    clave VARCHAR(100) NOT NULL,
    valor TEXT,
    descripcion TEXT,
    tipo ENUM('STRING', 'NUMBER', 'BOOLEAN', 'JSON') DEFAULT 'STRING',
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_clave_empresa (id_empresa, clave)
);

-- Tabla de sucursales
CREATE TABLE IF NOT EXISTS sucursales (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    direccion TEXT,
    direccion_fiscal TEXT, -- Dirección fiscal de la sucursal
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado_logico BOOLEAN DEFAULT FALSE, -- Campo para eliminación lógica
    eliminado BOOLEAN DEFAULT FALSE, -- Mantenido para compatibilidad
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa (id_empresa, codigo)
);

-- Tabla de almacenes
CREATE TABLE IF NOT EXISTS almacen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    `default` BOOLEAN DEFAULT FALSE, -- Indica si es el almacén por defecto
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    UNIQUE KEY unique_codigo_sucursal (id_sucursal, codigo)
);

-- Tabla de cajas
CREATE TABLE IF NOT EXISTS caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    monto_inicial DECIMAL(10,2) DEFAULT 0.00,
    print BOOLEAN DEFAULT TRUE, -- Campo para indicar si imprime tickets
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    UNIQUE KEY unique_codigo_sucursal_caja (id_sucursal, codigo)
);

-- Tabla de impresoras
CREATE TABLE IF NOT EXISTS impresoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_caja INT, -- ID de la caja asociada
    name VARCHAR(255) NOT NULL, -- Cambio de nombre a name
    nombre VARCHAR(100), -- Mantenido para compatibilidad
    tipo ENUM('termica', 'matricial', 'laser') DEFAULT 'termica',
    puerto VARCHAR(50),
    pc_name VARCHAR(255), -- Nombre del PC donde está conectada
    ip_local VARCHAR(45), -- IP local de la impresora
    state BOOLEAN DEFAULT TRUE, -- Estado de la impresora (activa/inactiva)
    configuracion JSON,
    activo BOOLEAN DEFAULT TRUE, -- Mantenido para compatibilidad
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_caja) REFERENCES caja(id)
);

-- Tabla de categorías
CREATE TABLE IF NOT EXISTS categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#007bff', -- Color hexadecimal para la categoría
    icono VARCHAR(50) DEFAULT 'folder', -- Nombre del icono para la categoría
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa_cat (id_empresa, codigo)
);

-- Tabla de productos
CREATE TABLE IF NOT EXISTS productos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_categoria INT NOT NULL,
    codigo VARCHAR(50) NOT NULL,
    codigo_interno VARCHAR(50), -- Código interno del producto
    codigo_barras VARCHAR(100),
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    precio_compra DECIMAL(10,2) DEFAULT 0.00,
    precio_venta DECIMAL(10,2) NOT NULL,
    stock_minimo INT DEFAULT 0,
    unidad_medida VARCHAR(20) DEFAULT 'UND',
    sevende_por VARCHAR(20) DEFAULT 'UNIDAD', -- Por qué unidad se vende (unidad, peso, etc.)
    maneja_inventarios BOOLEAN DEFAULT TRUE, -- Si maneja control de inventarios
    maneja_multiprecios BOOLEAN DEFAULT FALSE, -- Si maneja múltiples precios
    imagen_url VARCHAR(500),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_categoria) REFERENCES categorias(id),
    UNIQUE KEY unique_codigo_empresa_prod (id_empresa, codigo),
    INDEX idx_codigo_barras (codigo_barras),
    INDEX idx_nombre (nombre)
);

-- Tabla de stock por almacén
CREATE TABLE IF NOT EXISTS stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_producto INT NOT NULL,
    id_almacen INT NOT NULL,
    stock INT DEFAULT 0, -- Cambio de cantidad_actual a stock
    cantidad_actual INT DEFAULT 0, -- Mantenido para compatibilidad
    cantidad_reservada INT DEFAULT 0,
    cantidad_disponible INT GENERATED ALWAYS AS (cantidad_actual - cantidad_reservada) STORED,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 0,
    ubicacion VARCHAR(100), -- Ubicación física del producto en el almacén
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    UNIQUE KEY unique_producto_almacen (id_producto, id_almacen)
);

-- Tabla de movimientos de stock
CREATE TABLE IF NOT EXISTS movimientos_stock (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_producto INT NOT NULL,
    id_almacen INT NOT NULL,
    tipo_movimiento ENUM('ENTRADA', 'SALIDA', 'AJUSTE', 'TRANSFERENCIA') NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2),
    motivo VARCHAR(200),
    documento_referencia VARCHAR(100),
    id_usuario INT,
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id),
    INDEX idx_fecha_movimiento (fecha_movimiento),
    INDEX idx_tipo_movimiento (tipo_movimiento)
);

-- Tabla de multiprecios
CREATE TABLE IF NOT EXISTS multiprecios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_producto INT NOT NULL,
    nombre_precio VARCHAR(50) NOT NULL, -- Nombre del tipo de precio (mayorista, minorista, etc.)
    precio DECIMAL(10,2) NOT NULL,
    cantidad_minima INT DEFAULT 1, -- Cantidad mínima para aplicar este precio
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (id_producto) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_producto_nombre_precio (id_producto, nombre_precio)
);

-- Tabla de clientes y proveedores
CREATE TABLE IF NOT EXISTS clientes_proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    tipo ENUM('CLIENTE', 'PROVEEDOR', 'AMBOS') NOT NULL,
    documento VARCHAR(20) NOT NULL,
    tipo_documento ENUM('DNI', 'RUC', 'PASAPORTE', 'CARNET') NOT NULL,
    nombres VARCHAR(200) NOT NULL,
    apellidos VARCHAR(200),
    razon_social VARCHAR(255),
    direccion TEXT,
    telefono VARCHAR(20),
    email VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_documento_empresa (id_empresa, documento),
    INDEX idx_nombres (nombres),
    INDEX idx_documento (documento)
);

-- Tabla de roles
CREATE TABLE IF NOT EXISTS roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_nombre_empresa_rol (id_empresa, nombre)
);

-- Tabla de usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_rol INT NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombres VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    telefono VARCHAR(20),
    activo BOOLEAN DEFAULT TRUE,
    ultimo_acceso TIMESTAMP NULL,
    -- Campos adicionales según bd.txt
    id_tipodocumento INT, -- ID del tipo de documento
    nro_doc VARCHAR(20), -- Número de documento
    correo VARCHAR(100), -- Alias para email
    id_auth VARCHAR(100), -- ID de autenticación del sistema
    tema ENUM('light', 'dark') DEFAULT 'light', -- Preferencia de tema
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Alias para fecha_creacion
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO', -- Estado del usuario
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_rol) REFERENCES roles(id),
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_nro_doc (nro_doc)
);

-- Tabla de sesiones de usuario
CREATE TABLE IF NOT EXISTS sesiones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_usuario INT NOT NULL,
    token VARCHAR(500) NOT NULL UNIQUE,
    refresh_token VARCHAR(500),
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_expiracion TIMESTAMP NOT NULL,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_token (token),
    INDEX idx_refresh_token (refresh_token),
    INDEX idx_fecha_expiracion (fecha_expiracion)
);

-- Tabla de asignación de sucursales a usuarios
CREATE TABLE IF NOT EXISTS asignacion_sucursal (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_usuario INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_caja INT, -- ID de la caja asignada según bd.txt
    activo BOOLEAN DEFAULT TRUE,
    fecha_asignacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_caja) REFERENCES caja(id),
    UNIQUE KEY unique_usuario_sucursal (id_usuario, id_sucursal)
);

-- Tabla de módulos del sistema
CREATE TABLE IF NOT EXISTS modulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE,
    descripcion TEXT,
    icono VARCHAR(50),
    ruta VARCHAR(100),
    activo BOOLEAN DEFAULT TRUE,
    orden INT DEFAULT 0,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL
);

-- Tabla de permisos
CREATE TABLE IF NOT EXISTS permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_rol INT NOT NULL,
    id_modulo INT NOT NULL,
    puede_ver BOOLEAN DEFAULT FALSE,
    puede_crear BOOLEAN DEFAULT FALSE,
    puede_editar BOOLEAN DEFAULT FALSE,
    puede_eliminar BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_rol) REFERENCES roles(id),
    FOREIGN KEY (id_modulo) REFERENCES modulos(id),
    UNIQUE KEY unique_rol_modulo (id_rol, id_modulo)
);

-- Tabla de métodos de pago
CREATE TABLE IF NOT EXISTS metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    imagen VARCHAR(255), -- Ruta o URL de la imagen del método de pago según bd.txt
    requiere_referencia BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa_metodo (id_empresa, codigo)
);

-- Tabla de tipos de comprobantes
CREATE TABLE IF NOT EXISTS tipo_comprobantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    destino ENUM('VENTA', 'COMPRA', 'INTERNO') DEFAULT 'VENTA', -- Destino del comprobante según bd.txt
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    UNIQUE KEY unique_codigo_empresa_comp (id_empresa, codigo)
);

-- Tabla de serialización de comprobantes
CREATE TABLE IF NOT EXISTS serializacion_comprobantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_tipo_comprobante INT NOT NULL,
    serie VARCHAR(10) NOT NULL,
    numero_inicial INT NOT NULL DEFAULT 1,
    numero_actual INT NOT NULL DEFAULT 1,
    numero_final INT,
    -- Campos adicionales según bd.txt
    cantidad_numeros INT DEFAULT 1000, -- Cantidad de números disponibles
    correlativo INT DEFAULT 1, -- Número correlativo actual
    por_default BOOLEAN DEFAULT FALSE, -- Si es la serie por defecto
    activo BOOLEAN DEFAULT TRUE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_tipo_comprobante) REFERENCES tipo_comprobantes(id),
    UNIQUE KEY unique_serie_sucursal_tipo (id_sucursal, id_tipo_comprobante, serie)
);

-- Tabla de ventas
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    id_cliente INT,
    id_tipo_comprobante INT NOT NULL,
    serie VARCHAR(10) NOT NULL,
    numero INT NOT NULL,
    -- Campos originales mantenidos para compatibilidad
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subtotal DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    impuesto DECIMAL(10,2) DEFAULT 0.00,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('PENDIENTE', 'COMPLETADA', 'ANULADA') DEFAULT 'COMPLETADA',
    observaciones TEXT,
    -- Campos adicionales según bd.txt
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Alias para fecha_venta
    monto_total DECIMAL(10,2) DEFAULT 0.00, -- Alias para total
    total_impuestos DECIMAL(10,2) DEFAULT 0.00, -- Monto de impuestos
    saldo DECIMAL(10,2) DEFAULT 0.00, -- Saldo pendiente si es a crédito
    pago_con DECIMAL(10,2) DEFAULT 0.00, -- Monto con el que pagó el cliente
    referencia_tarjeta VARCHAR(100), -- Referencia si el pago fue con tarjeta
    vuelto DECIMAL(10,2) DEFAULT 0.00, -- Cambio devuelto al cliente
    cantidad_productos INT DEFAULT 0, -- Total de ítems en la venta
    sub_total DECIMAL(10,2) DEFAULT 0.00, -- Total antes de impuestos
    valor_impuesto DECIMAL(5,2) DEFAULT 0.00, -- Porcentaje de impuesto aplicado
    id_cierre_caja INT, -- ID del cierre de caja al que pertenece
    nro_comprobante VARCHAR(50), -- Número de factura/boleta/ticket
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_caja) REFERENCES caja(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_cliente) REFERENCES clientes_proveedores(id),
    FOREIGN KEY (id_tipo_comprobante) REFERENCES tipo_comprobantes(id),
    UNIQUE KEY unique_serie_numero_empresa (id_empresa, serie, numero),
    INDEX idx_fecha_venta (fecha_venta),
    INDEX idx_estado (estado)
);

-- Tabla de detalle de ventas
CREATE TABLE IF NOT EXISTS detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_venta INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    descuento DECIMAL(10,2) DEFAULT 0.00,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS ((cantidad * precio_unitario) - descuento) STORED,
    -- Campos adicionales según bd.txt
    precio_venta DECIMAL(10,2) NOT NULL DEFAULT 0.00, -- Precio unitario del producto
    total DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_venta) STORED, -- Subtotal de la línea
    descripcion VARCHAR(255), -- Nombre del producto en la venta
    precio_compra DECIMAL(10,2) DEFAULT 0.00, -- Costo del producto en ese momento
    id_sucursal INT NOT NULL, -- ID de la sucursal
    estado VARCHAR(20) DEFAULT 'nueva', -- Estado de la línea
    id_almacen INT, -- ID del almacén de donde se descontó el stock
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_almacen) REFERENCES almacen(id)
);

-- Tabla de formas de pago por venta
CREATE TABLE IF NOT EXISTS formas_pago_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_venta INT NOT NULL,
    id_metodo_pago INT NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    referencia VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id)
);

-- Tabla de devoluciones
CREATE TABLE IF NOT EXISTS devoluciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_venta INT NOT NULL,
    id_usuario INT NOT NULL,
    motivo TEXT NOT NULL,
    total_devolucion DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    estado ENUM('PENDIENTE', 'APROBADA', 'RECHAZADA') DEFAULT 'PENDIENTE',
    fecha_devolucion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    observaciones TEXT,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_fecha_devolucion (fecha_devolucion),
    INDEX idx_estado_devolucion (estado)
);

-- Tabla de detalle de devoluciones
CREATE TABLE IF NOT EXISTS detalle_devolucion (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_devolucion INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad_devuelta INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad_devuelta * precio_unitario) STORED,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_devolucion) REFERENCES devoluciones(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

-- Tabla de cierre de caja
CREATE TABLE IF NOT EXISTS cierrecaja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    fecha_apertura TIMESTAMP NOT NULL,
    fecha_cierre TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    monto_inicial DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    monto_final DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_ventas DECIMAL(10,2) DEFAULT 0.00,
    total_ingresos DECIMAL(10,2) DEFAULT 0.00,
    total_egresos DECIMAL(10,2) DEFAULT 0.00,
    diferencia DECIMAL(10,2) GENERATED ALWAYS AS (monto_final - (monto_inicial + total_ingresos - total_egresos)) STORED,
    observaciones TEXT,
    estado ENUM('ABIERTO', 'CERRADO') DEFAULT 'CERRADO',
    -- Campos adicionales según bd.txt
    fechainicio TIMESTAMP NOT NULL, -- Alias para fecha_apertura
    fechacierre TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Alias para fecha_cierre
    total_efectivo_calculado DECIMAL(10,2) DEFAULT 0.00, -- Dinero que debería haber según el sistema
    total_efectivo_real DECIMAL(10,2) DEFAULT 0.00, -- Dinero real contado
    diferencia_efectivo DECIMAL(10,2) GENERATED ALWAYS AS (total_efectivo_real - total_efectivo_calculado) STORED, -- Diferencia entre calculado y real
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_caja) REFERENCES caja(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_fecha_cierre (fecha_cierre),
    INDEX idx_estado_cierre (estado)
);

-- Tabla de movimientos de caja
CREATE TABLE IF NOT EXISTS movimientos_caja (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_caja INT NOT NULL,
    id_usuario INT NOT NULL,
    tipo_movimiento ENUM('INGRESO', 'EGRESO', 'VENTA') NOT NULL,
    monto DECIMAL(10,2) NOT NULL,
    concepto VARCHAR(200) NOT NULL,
    documento_referencia VARCHAR(100),
    fecha_movimiento TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Campos adicionales según bd.txt
    id_metodo_pago INT, -- ID del método de pago
    descripcion TEXT, -- Motivo del movimiento (alias para concepto)
    id_cierre_caja INT, -- ID del cierre de caja activo
    id_ventas INT, -- ID de la venta asociada (si aplica)
    vuelto DECIMAL(10,2) DEFAULT 0.00, -- Cambio devuelto en un pago
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id),
    FOREIGN KEY (id_caja) REFERENCES caja(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    FOREIGN KEY (id_metodo_pago) REFERENCES metodos_pago(id),
    FOREIGN KEY (id_cierre_caja) REFERENCES cierrecaja(id),
    FOREIGN KEY (id_ventas) REFERENCES ventas(id),
    INDEX idx_fecha_movimiento_caja (fecha_movimiento),
    INDEX idx_tipo_movimiento_caja (tipo_movimiento)
);

-- Tabla de logs del sistema
CREATE TABLE IF NOT EXISTS system_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_usuario INT,
    nivel ENUM('DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL') NOT NULL,
    mensaje TEXT NOT NULL,
    contexto JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_log TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_nivel (nivel),
    INDEX idx_fecha_log (fecha_log),
    INDEX idx_usuario (id_usuario)
);

-- Tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_trail (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_usuario INT,
    tabla VARCHAR(100) NOT NULL,
    id_registro INT NOT NULL,
    accion ENUM('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT') NOT NULL,
    datos_anteriores JSON,
    datos_nuevos JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    fecha_accion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eliminado BOOLEAN DEFAULT FALSE,
    fecha_eliminacion TIMESTAMP NULL,
    FOREIGN KEY (id_empresa) REFERENCES empresa(id),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id),
    INDEX idx_tabla (tabla),
    INDEX idx_accion (accion),
    INDEX idx_fecha_accion (fecha_accion),
    INDEX idx_usuario_audit (id_usuario)
);

-- =====================================================
-- ÍNDICES ADICIONALES PARA OPTIMIZACIÓN
-- =====================================================

-- Índices para consultas multitenant
CREATE INDEX idx_empresa_activo ON empresa(id, activo);
CREATE INDEX idx_multitenant_sucursales ON sucursales(id_empresa, activo);
CREATE INDEX idx_multitenant_usuarios ON usuarios(id_empresa, activo);
CREATE INDEX idx_multitenant_productos ON productos(id_empresa, activo);
CREATE INDEX idx_multitenant_ventas ON ventas(id_empresa, fecha_venta);
CREATE INDEX idx_multitenant_stock ON stock(id_empresa, id_producto);

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================4

-- Schema completo con todas las tablas necesarias para el sistema POS
-- Incluye soporte completo para multi-tenancy con id_empresa
-- Todas las tablas tienen soft delete (eliminado, fecha_eliminacion)
-- Todas las tablas tienen timestamps (fecha_creacion, fecha_actualizacion)
-- Sin triggers ni funciones - lógica de negocio manejada en backend
-- Tablas agregadas: sesiones, configuracion_empresa, metodos_pago, formas_pago_venta,
--                  devoluciones, detalle_devolucion, system_logs, audit_trail