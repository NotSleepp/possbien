-- =====================================================
-- DATOS INICIALES PARA SISTEMA POS MULTITENANT
-- Datos básicos en español para funcionamiento inicial
-- =====================================================

-- Insertar empresa de ejemplo
INSERT INTO empresa (ruc, razon_social, nombre_comercial, direccion, telefono, email, nombre, id_fiscal, direccion_fiscal, simbolo_moneda, iso, pais, currency, impuesto, valor_impuesto, nombre_moneda, correo, pie_pagina_ticket) VALUES
('20123456789', 'Empresa Demo S.A.C.', 'Tienda Demo', 'Av. Principal 123, Lima', '01-234-5678', 'demo@empresa.com', 'Tienda Demo', '20123456789', 'Av. Principal 123, Lima', 'S/', 'PEN', 'Perú', 'PEN', 18.00, 18.00, 'Soles', 'demo@empresa.com', 'Gracias por su compra - Vuelva pronto');

-- Obtener el ID de la empresa insertada
SET @id_empresa = LAST_INSERT_ID();

-- Insertar sucursal principal
INSERT INTO sucursales (id_empresa, codigo, nombre, direccion, telefono, email, direccion_fiscal, `eliminado_logico`) VALUES
(@id_empresa, 'SUC001', 'Sucursal Principal', 'Av. Principal 123, Lima', '01-234-5678', 'principal@empresa.com', 'Av. Principal 123, Lima', FALSE);

SET @id_sucursal = LAST_INSERT_ID();

-- Insertar almacén principal
INSERT INTO almacen (id_empresa, id_sucursal, codigo, nombre, descripcion, `default`) VALUES
(@id_empresa, @id_sucursal, 'ALM001', 'Almacén Principal', 'Almacén principal de la sucursal', TRUE);

SET @id_almacen = LAST_INSERT_ID();

-- Insertar caja principal
INSERT INTO caja (id_empresa, id_sucursal, codigo, nombre, descripcion, monto_inicial, print) VALUES
(@id_empresa, @id_sucursal, 'CAJ001', 'Caja Principal', 'Caja principal de ventas', 100.00, TRUE);

SET @id_caja = LAST_INSERT_ID();

-- Insertar impresora de ejemplo
INSERT INTO impresoras (id_empresa, id_sucursal, nombre, name, tipo, puerto, id_caja, pc_name, ip_local, state) VALUES
(@id_empresa, @id_sucursal, 'Impresora Tickets', 'Impresora Tickets', 'termica', 'USB001', @id_caja, 'PC-CAJA-01', '192.168.1.100', TRUE);

-- Insertar roles básicos
INSERT INTO roles (id_empresa, nombre, descripcion) VALUES
(@id_empresa, 'Administrador', 'Acceso completo al sistema'),
(@id_empresa, 'Vendedor', 'Acceso a módulo de ventas'),
(@id_empresa, 'Cajero', 'Acceso a caja y ventas'),
(@id_empresa, 'Supervisor', 'Acceso a reportes y supervisión');

-- Obtener IDs de roles
SET @id_rol_admin = (SELECT id FROM roles WHERE id_empresa = @id_empresa AND nombre = 'Administrador');
SET @id_rol_vendedor = (SELECT id FROM roles WHERE id_empresa = @id_empresa AND nombre = 'Vendedor');
SET @id_rol_cajero = (SELECT id FROM roles WHERE id_empresa = @id_empresa AND nombre = 'Cajero');
SET @id_rol_supervisor = (SELECT id FROM roles WHERE id_empresa = @id_empresa AND nombre = 'Supervisor');

-- Insertar usuario administrador
INSERT INTO usuarios (id_empresa, id_rol, username, password, nombres, apellidos, email, correo, nro_doc, tema, estado) VALUES
(@id_empresa, @id_rol_admin, 'admin', '$2b$10$rQZ8kJxH5fKjH5fKjH5fKOuKjH5fKjH5fKjH5fKjH5fKjH5fKjH5f', 'Administrador', 'Sistema', 'admin@empresa.com', 'admin@empresa.com', '12345678', 'light', 'ACTIVO'),
(@id_empresa, @id_rol_vendedor, 'vendedor1', '$2b$10$rQZ8kJxH5fKjH5fKjH5fKOuKjH5fKjH5fKjH5fKjH5fKjH5fKjH5f', 'Juan', 'Pérez', 'vendedor1@empresa.com', 'vendedor1@empresa.com', '87654321', 'light', 'ACTIVO'),
(@id_empresa, @id_rol_cajero, 'cajero1', '$2b$10$rQZ8kJxH5fKjH5fKjH5fKOuKjH5fKjH5fKjH5fKjH5fKjH5fKjH5f', 'María', 'García', 'cajero1@empresa.com', 'cajero1@empresa.com', '11223344', 'dark', 'ACTIVO');

-- Obtener IDs de usuarios
SET @id_usuario_admin = (SELECT id FROM usuarios WHERE username = 'admin');
SET @id_usuario_vendedor = (SELECT id FROM usuarios WHERE username = 'vendedor1');
SET @id_usuario_cajero = (SELECT id FROM usuarios WHERE username = 'cajero1');

-- Asignar usuarios a sucursal
INSERT INTO asignacion_sucursal (id_empresa, id_usuario, id_sucursal, id_caja) VALUES
(@id_empresa, @id_usuario_admin, @id_sucursal, @id_caja),
(@id_empresa, @id_usuario_vendedor, @id_sucursal, NULL),
(@id_empresa, @id_usuario_cajero, @id_sucursal, @id_caja);

-- Insertar módulos del sistema
INSERT INTO modulos (nombre, descripcion, icono, ruta, orden) VALUES
('Dashboard', 'Panel principal del sistema', 'dashboard', '/dashboard', 1),
('Ventas', 'Módulo de ventas y facturación', 'shopping-cart', '/ventas', 2),
('Productos', 'Gestión de productos e inventario', 'package', '/productos', 3),
('Clientes', 'Gestión de clientes', 'users', '/clientes', 4),
('Proveedores', 'Gestión de proveedores', 'truck', '/proveedores', 5),
('Inventario', 'Control de stock y almacenes', 'warehouse', '/inventario', 6),
('Caja', 'Gestión de caja y movimientos', 'credit-card', '/caja', 7),
('Reportes', 'Reportes y estadísticas', 'bar-chart', '/reportes', 8),
('Configuración', 'Configuración del sistema', 'settings', '/configuracion', 9),
('Usuarios', 'Gestión de usuarios y permisos', 'user-check', '/usuarios', 10);

-- Obtener IDs de módulos
SET @id_mod_dashboard = (SELECT id FROM modulos WHERE nombre = 'Dashboard');
SET @id_mod_ventas = (SELECT id FROM modulos WHERE nombre = 'Ventas');
SET @id_mod_productos = (SELECT id FROM modulos WHERE nombre = 'Productos');
SET @id_mod_clientes = (SELECT id FROM modulos WHERE nombre = 'Clientes');
SET @id_mod_proveedores = (SELECT id FROM modulos WHERE nombre = 'Proveedores');
SET @id_mod_inventario = (SELECT id FROM modulos WHERE nombre = 'Inventario');
SET @id_mod_caja = (SELECT id FROM modulos WHERE nombre = 'Caja');
SET @id_mod_reportes = (SELECT id FROM modulos WHERE nombre = 'Reportes');
SET @id_mod_configuracion = (SELECT id FROM modulos WHERE nombre = 'Configuración');
SET @id_mod_usuarios = (SELECT id FROM modulos WHERE nombre = 'Usuarios');

-- Permisos para Administrador (acceso completo)
INSERT INTO permisos (id_empresa, id_rol, id_modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(@id_empresa, @id_rol_admin, @id_mod_dashboard, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_ventas, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_productos, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_clientes, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_proveedores, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_inventario, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_caja, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_reportes, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_configuracion, TRUE, TRUE, TRUE, TRUE),
(@id_empresa, @id_rol_admin, @id_mod_usuarios, TRUE, TRUE, TRUE, TRUE);

-- Permisos para Vendedor
INSERT INTO permisos (id_empresa, id_rol, id_modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(@id_empresa, @id_rol_vendedor, @id_mod_dashboard, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_vendedor, @id_mod_ventas, TRUE, TRUE, TRUE, FALSE),
(@id_empresa, @id_rol_vendedor, @id_mod_productos, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_vendedor, @id_mod_clientes, TRUE, TRUE, TRUE, FALSE),
(@id_empresa, @id_rol_vendedor, @id_mod_inventario, TRUE, FALSE, FALSE, FALSE);

-- Permisos para Cajero
INSERT INTO permisos (id_empresa, id_rol, id_modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(@id_empresa, @id_rol_cajero, @id_mod_dashboard, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_cajero, @id_mod_ventas, TRUE, TRUE, FALSE, FALSE),
(@id_empresa, @id_rol_cajero, @id_mod_caja, TRUE, TRUE, TRUE, FALSE);

-- Permisos para Supervisor
INSERT INTO permisos (id_empresa, id_rol, id_modulo, puede_ver, puede_crear, puede_editar, puede_eliminar) VALUES
(@id_empresa, @id_rol_supervisor, @id_mod_dashboard, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_supervisor, @id_mod_ventas, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_supervisor, @id_mod_productos, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_supervisor, @id_mod_clientes, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_supervisor, @id_mod_inventario, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_supervisor, @id_mod_caja, TRUE, FALSE, FALSE, FALSE),
(@id_empresa, @id_rol_supervisor, @id_mod_reportes, TRUE, TRUE, TRUE, FALSE);

-- Insertar categorías de ejemplo
INSERT INTO categorias (id_empresa, codigo, nombre, descripcion, color, icono) VALUES
(@id_empresa, 'CAT001', 'Bebidas', 'Bebidas y refrescos', '#3B82F6', 'coffee'),
(@id_empresa, 'CAT002', 'Snacks', 'Snacks y golosinas', '#F59E0B', 'cookie'),
(@id_empresa, 'CAT003', 'Lácteos', 'Productos lácteos', '#FFFFFF', 'milk'),
(@id_empresa, 'CAT004', 'Panadería', 'Productos de panadería', '#D97706', 'bread-slice'),
(@id_empresa, 'CAT005', 'Limpieza', 'Productos de limpieza', '#10B981', 'spray-can'),
(@id_empresa, 'CAT006', 'Higiene', 'Productos de higiene personal', '#8B5CF6', 'hand-heart');

-- Obtener IDs de categorías
SET @id_cat_bebidas = (SELECT id FROM categorias WHERE codigo = 'CAT001' AND id_empresa = @id_empresa);
SET @id_cat_snacks = (SELECT id FROM categorias WHERE codigo = 'CAT002' AND id_empresa = @id_empresa);
SET @id_cat_lacteos = (SELECT id FROM categorias WHERE codigo = 'CAT003' AND id_empresa = @id_empresa);
SET @id_cat_panaderia = (SELECT id FROM categorias WHERE codigo = 'CAT004' AND id_empresa = @id_empresa);
SET @id_cat_limpieza = (SELECT id FROM categorias WHERE codigo = 'CAT005' AND id_empresa = @id_empresa);
SET @id_cat_higiene = (SELECT id FROM categorias WHERE codigo = 'CAT006' AND id_empresa = @id_empresa);

-- Insertar productos de ejemplo
INSERT INTO productos (id_empresa, id_categoria, codigo, codigo_barras, nombre, descripcion, precio_compra, precio_venta, stock_minimo, unidad_medida, codigo_interno, sevende_por, maneja_inventarios, maneja_multiprecios) VALUES
(@id_empresa, @id_cat_bebidas, 'PROD001', '7751234567890', 'Coca Cola 500ml', 'Gaseosa Coca Cola 500ml', 2.50, 3.50, 10, 'UND', 'INT001', 'UNIDAD', TRUE, TRUE),
(@id_empresa, @id_cat_bebidas, 'PROD002', '7751234567891', 'Agua San Luis 625ml', 'Agua mineral San Luis 625ml', 1.00, 1.50, 20, 'UND', 'INT002', 'UNIDAD', TRUE, FALSE),
(@id_empresa, @id_cat_snacks, 'PROD003', '7751234567892', 'Papas Lays Original', 'Papas fritas Lays sabor original', 3.00, 4.50, 15, 'UND', 'INT003', 'UNIDAD', TRUE, TRUE),
(@id_empresa, @id_cat_lacteos, 'PROD004', '7751234567893', 'Leche Gloria 1L', 'Leche evaporada Gloria 1 litro', 4.20, 5.80, 8, 'UND', 'INT004', 'UNIDAD', TRUE, TRUE),
(@id_empresa, @id_cat_panaderia, 'PROD005', '7751234567894', 'Pan Integral Bimbo', 'Pan integral Bimbo 500g', 3.50, 5.00, 5, 'UND', 'INT005', 'UNIDAD', TRUE, FALSE),
(@id_empresa, @id_cat_limpieza, 'PROD006', '7751234567895', 'Detergente Ariel 1kg', 'Detergente en polvo Ariel 1kg', 8.50, 12.00, 3, 'UND', 'INT006', 'UNIDAD', TRUE, TRUE),
(@id_empresa, @id_cat_higiene, 'PROD007', '7751234567896', 'Champú Head & Shoulders', 'Champú anticaspa Head & Shoulders 400ml', 12.00, 16.50, 5, 'UND', 'INT007', 'UNIDAD', TRUE, FALSE);

-- Insertar stock inicial para los productos
INSERT INTO stock (id_empresa, id_producto, id_almacen, stock, stock_minimo, ubicacion) VALUES
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD001' AND id_empresa = @id_empresa), @id_almacen, 50, 10, 'A1-B2'),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD002' AND id_empresa = @id_empresa), @id_almacen, 100, 20, 'A1-B3'),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD003' AND id_empresa = @id_empresa), @id_almacen, 30, 15, 'A2-B1'),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD004' AND id_empresa = @id_empresa), @id_almacen, 25, 8, 'A3-B1'),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD005' AND id_empresa = @id_empresa), @id_almacen, 15, 5, 'A3-B2'),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD006' AND id_empresa = @id_empresa), @id_almacen, 10, 3, 'A4-B1'),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD007' AND id_empresa = @id_empresa), @id_almacen, 12, 5, 'A4-B2');

-- Insertar tipos de comprobantes
INSERT INTO tipo_comprobantes (id_empresa, codigo, nombre, descripcion, destino) VALUES
(@id_empresa, 'BOL', 'Boleta de Venta', 'Boleta de venta electrónica', 'VENTA'),
(@id_empresa, 'FAC', 'Factura', 'Factura electrónica', 'VENTA'),
(@id_empresa, 'TIC', 'Ticket', 'Ticket de venta', 'VENTA'),
(@id_empresa, 'NOT', 'Nota de Crédito', 'Nota de crédito electrónica', 'VENTA'),
(@id_empresa, 'NOD', 'Nota de Débito', 'Nota de débito electrónica', 'VENTA');

-- Insertar métodos de pago básicos
INSERT INTO metodos_pago (id_empresa, codigo, nombre, descripcion, activo, imagen) VALUES
(@id_empresa, 'EFE', 'Efectivo', 'Pago en efectivo', TRUE, 'efectivo.png'),
(@id_empresa, 'TAR', 'Tarjeta', 'Pago con tarjeta de débito/crédito', TRUE, 'tarjeta.png'),
(@id_empresa, 'TRA', 'Transferencia', 'Transferencia bancaria', TRUE, 'transferencia.png'),
(@id_empresa, 'YAP', 'Yape', 'Pago con Yape', TRUE, 'yape.png'),
(@id_empresa, 'PLI', 'Plin', 'Pago con Plin', TRUE, 'plin.png');

-- Insertar serialización de comprobantes (corregido: iniciar en 1)
INSERT INTO serializacion_comprobantes (id_empresa, id_sucursal, id_tipo_comprobante, serie, numero_actual, numero_final, cantidad_numeros, correlativo, por_default) VALUES
(@id_empresa, @id_sucursal, (SELECT id FROM tipo_comprobantes WHERE codigo = 'BOL' AND id_empresa = @id_empresa), 'B001', 1, 99999999, 8, TRUE, TRUE),
(@id_empresa, @id_sucursal, (SELECT id FROM tipo_comprobantes WHERE codigo = 'FAC' AND id_empresa = @id_empresa), 'F001', 1, 99999999, 8, TRUE, FALSE),
(@id_empresa, @id_sucursal, (SELECT id FROM tipo_comprobantes WHERE codigo = 'TIC' AND id_empresa = @id_empresa), 'T001', 1, 99999999, 8, TRUE, FALSE),
(@id_empresa, @id_sucursal, (SELECT id FROM tipo_comprobantes WHERE codigo = 'NOT' AND id_empresa = @id_empresa), 'NC01', 1, 99999999, 8, TRUE, FALSE),
(@id_empresa, @id_sucursal, (SELECT id FROM tipo_comprobantes WHERE codigo = 'NOD' AND id_empresa = @id_empresa), 'ND01', 1, 99999999, 8, TRUE, FALSE);

-- Insertar cliente genérico (requerido por el sistema)
INSERT INTO clientes_proveedores (id_empresa, tipo, documento, tipo_documento, nombres, apellidos, direccion, telefono, email) VALUES
(@id_empresa, 'CLIENTE', '00000000', 'DNI', 'Cliente', 'Genérico', 'Sin dirección', '000000000', 'generico@sistema.com');

-- Insertar algunos clientes de ejemplo
INSERT INTO clientes_proveedores (id_empresa, tipo, documento, tipo_documento, nombres, apellidos, direccion, telefono, email) VALUES
(@id_empresa, 'CLIENTE', '12345678', 'DNI', 'Juan Carlos', 'Rodríguez López', 'Jr. Los Olivos 456, Lima', '987654321', 'juan.rodriguez@email.com'),
(@id_empresa, 'CLIENTE', '87654321', 'DNI', 'María Elena', 'García Vásquez', 'Av. Brasil 789, Lima', '987654322', 'maria.garcia@email.com'),
(@id_empresa, 'PROVEEDOR', '20567890123', 'RUC', 'Distribuidora Norte S.A.C.', '', 'Av. Industrial 123, Lima', '01-456-7890', 'ventas@distnorte.com'),
(@id_empresa, 'PROVEEDOR', '20678901234', 'RUC', 'Comercial Sur E.I.R.L.', '', 'Jr. Comercio 456, Lima', '01-567-8901', 'pedidos@comsur.com'),
(@id_empresa, 'AMBOS', '20789012345', 'RUC', 'Empresa Mixta S.A.', '', 'Av. Central 789, Lima', '01-678-9012', 'contacto@mixta.com');

-- Insertar configuraciones básicas de empresa
INSERT INTO configuracion_empresa (id_empresa, clave, valor, tipo, descripcion) VALUES
(@id_empresa, 'MONEDA', 'PEN', 'STRING', 'Moneda principal del sistema'),
(@id_empresa, 'SIMBOLO_MONEDA', 'S/', 'STRING', 'Símbolo de la moneda'),
(@id_empresa, 'IMPUESTO_IGV', '18.00', 'NUMBER', 'Porcentaje de IGV aplicable'),
(@id_empresa, 'TICKET_ENCABEZADO', 'TIENDA DEMO', 'STRING', 'Encabezado del ticket'),
(@id_empresa, 'TICKET_PIE', 'Gracias por su compra', 'STRING', 'Pie de página del ticket'),
(@id_empresa, 'TICKET_DIRECCION', 'Av. Principal 123, Lima', 'STRING', 'Dirección en el ticket'),
(@id_empresa, 'TICKET_TELEFONO', '01-234-5678', 'STRING', 'Teléfono en el ticket'),
(@id_empresa, 'DECIMALES_PRECIO', '2', 'NUMBER', 'Número de decimales para precios'),
(@id_empresa, 'STOCK_NEGATIVO', 'false', 'BOOLEAN', 'Permitir stock negativo'),
(@id_empresa, 'BACKUP_AUTOMATICO', 'true', 'BOOLEAN', 'Realizar backup automático');

-- Insertar multiprecios para algunos productos
INSERT INTO multiprecios (id_empresa, id_producto, nombre_precio, precio, cantidad_minima) VALUES
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD001' AND id_empresa = @id_empresa), 'Precio por Mayor', 3.20, 12),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD001' AND id_empresa = @id_empresa), 'Precio Distribuidor', 3.00, 24),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD003' AND id_empresa = @id_empresa), 'Precio por Mayor', 4.20, 10),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD004' AND id_empresa = @id_empresa), 'Precio por Mayor', 5.50, 6),
(@id_empresa, (SELECT id FROM productos WHERE codigo = 'PROD006' AND id_empresa = @id_empresa), 'Precio por Mayor', 11.50, 5);

-- Mensaje de confirmación
SELECT 'Datos iniciales insertados correctamente' as mensaje;
SELECT CONCAT('Empresa creada con ID: ', @id_empresa) as empresa_info;
SELECT 'Usuarios creados: admin/admin, vendedor1/vendedor1, cajero1/cajero1' as usuarios_info;
SELECT CONCAT('Productos insertados: ', COUNT(*), ' productos con stock inicial') as productos_info 
FROM productos WHERE id_empresa = @id_empresa;