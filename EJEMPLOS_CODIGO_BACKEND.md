# 💻 EJEMPLOS DE CÓDIGO - ACTUALIZACIÓN BACKEND

## 🎯 GUÍA DE ACTUALIZACIÓN DEL CÓDIGO

Esta guía muestra cómo actualizar tu código backend de Node.js/Express para usar los campos corregidos de la base de datos.

---

## 📝 CAMBIOS DE NOMENCLATURA

### Tabla: `ventas`
```javascript
// ❌ ANTES (campos en inglés)
{
  subtotal: 100.00,
  total: 118.00,
  impuesto: 18.00
}

// ✅ DESPUÉS (campos en español)
{
  sub_total: 100.00,
  monto_total: 118.00,
  total_impuestos: 18.00
}
```

### Tabla: `detalle_venta`
```javascript
// ❌ ANTES (campos duplicados)
{
  precio_unitario: 10.00,
  precio_venta: 10.00,
  subtotal: 100.00,
  total: 100.00
}

// ✅ DESPUÉS (campo único)
{
  precio_venta: 10.00,
  subtotal: 100.00  // Campo calculado automáticamente
}
```

### Tabla: `stock`
```javascript
// ❌ ANTES (campos duplicados)
{
  stock: 50,
  cantidad_actual: 50
}

// ✅ DESPUÉS (campo único)
{
  cantidad_actual: 50
}
```

---

## 🔧 ACTUALIZACIÓN DE MODELS

### Model: Venta.js

```javascript
// ❌ ANTES
class Venta {
  static async crear(data) {
    const query = `
      INSERT INTO ventas (
        id_empresa, id_sucursal, id_caja, id_usuario,
        id_cliente, id_tipo_comprobante, serie, numero,
        subtotal, descuento, impuesto, total, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.id_empresa, data.id_sucursal, data.id_caja, data.id_usuario,
      data.id_cliente, data.id_tipo_comprobante, data.serie, data.numero,
      data.subtotal, data.descuento, data.impuesto, data.total, data.estado
    ];
    
    return await db.query(query, values);
  }
  
  static async calcularTotales(items, descuento = 0) {
    const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
    const impuesto = (subtotal - descuento) * 0.18;
    const total = subtotal - descuento + impuesto;
    
    return { subtotal, descuento, impuesto, total };
  }
}

// ✅ DESPUÉS
class Venta {
  static async crear(data) {
    const query = `
      INSERT INTO ventas (
        id_empresa, id_sucursal, id_caja, id_usuario,
        id_cliente, id_tipo_comprobante, serie, numero,
        sub_total, descuento, total_impuestos, monto_total, 
        estado, cantidad_productos, valor_impuesto
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.id_empresa, data.id_sucursal, data.id_caja, data.id_usuario,
      data.id_cliente, data.id_tipo_comprobante, data.serie, data.numero,
      data.sub_total, data.descuento, data.total_impuestos, data.monto_total,
      data.estado, data.cantidad_productos, data.valor_impuesto
    ];
    
    return await db.query(query, values);
  }
  
  static async calcularTotales(items, descuento = 0, porcentajeImpuesto = 18) {
    const sub_total = items.reduce((sum, item) => sum + item.subtotal, 0);
    const total_impuestos = (sub_total - descuento) * (porcentajeImpuesto / 100);
    const monto_total = sub_total - descuento + total_impuestos;
    const cantidad_productos = items.reduce((sum, item) => sum + item.cantidad, 0);
    
    return { 
      sub_total, 
      descuento, 
      total_impuestos, 
      monto_total,
      cantidad_productos,
      valor_impuesto: porcentajeImpuesto
    };
  }
  
  // Nuevo método: Usar procedimiento almacenado
  static async calcularTotalesDB(idVenta) {
    const [result] = await db.query('CALL sp_calcular_totales_venta(?)', [idVenta]);
    return result[0];
  }
}

module.exports = Venta;
```

---

### Model: DetalleVenta.js

```javascript
// ❌ ANTES
class DetalleVenta {
  static async crear(data) {
    const query = `
      INSERT INTO detalle_venta (
        id_empresa, id_venta, id_producto, id_sucursal, id_almacen,
        cantidad, precio_unitario, precio_venta, descuento, descripcion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.id_empresa, data.id_venta, data.id_producto, 
      data.id_sucursal, data.id_almacen,
      data.cantidad, data.precio_unitario, data.precio_venta, 
      data.descuento, data.descripcion
    ];
    
    return await db.query(query, values);
  }
}

// ✅ DESPUÉS
class DetalleVenta {
  static async crear(data) {
    const query = `
      INSERT INTO detalle_venta (
        id_empresa, id_venta, id_producto, id_sucursal, id_almacen,
        cantidad, precio_venta, descuento, descripcion, precio_compra
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    // Nota: subtotal se calcula automáticamente en la BD
    const values = [
      data.id_empresa, data.id_venta, data.id_producto, 
      data.id_sucursal, data.id_almacen,
      data.cantidad, data.precio_venta, data.descuento || 0, 
      data.descripcion, data.precio_compra || 0
    ];
    
    return await db.query(query, values);
  }
  
  static async obtenerPorVenta(idVenta) {
    const query = `
      SELECT 
        dv.*,
        p.nombre as producto_nombre,
        p.codigo as producto_codigo
      FROM detalle_venta dv
      INNER JOIN productos p ON dv.id_producto = p.id
      WHERE dv.id_venta = ?
        AND dv.eliminado = FALSE
      ORDER BY dv.id
    `;
    
    return await db.query(query, [idVenta]);
  }
}

module.exports = DetalleVenta;
```

---

### Model: Stock.js

```javascript
// ❌ ANTES
class Stock {
  static async obtener(idProducto, idAlmacen) {
    const query = `
      SELECT stock, cantidad_actual, cantidad_reservada, cantidad_disponible
      FROM stock
      WHERE id_producto = ? AND id_almacen = ?
    `;
    
    const [rows] = await db.query(query, [idProducto, idAlmacen]);
    return rows[0];
  }
  
  static async actualizar(idProducto, idAlmacen, nuevoStock) {
    const query = `
      UPDATE stock 
      SET stock = ?, cantidad_actual = ?
      WHERE id_producto = ? AND id_almacen = ?
    `;
    
    return await db.query(query, [nuevoStock, nuevoStock, idProducto, idAlmacen]);
  }
}

// ✅ DESPUÉS
class Stock {
  static async obtener(idProducto, idAlmacen) {
    const query = `
      SELECT 
        cantidad_actual, 
        cantidad_reservada, 
        cantidad_disponible,
        stock_minimo,
        stock_maximo,
        ubicacion
      FROM stock
      WHERE id_producto = ? AND id_almacen = ?
    `;
    
    const [rows] = await db.query(query, [idProducto, idAlmacen]);
    return rows[0];
  }
  
  static async actualizar(idProducto, idAlmacen, nuevaCantidad) {
    const query = `
      UPDATE stock 
      SET cantidad_actual = ?
      WHERE id_producto = ? AND id_almacen = ?
    `;
    
    return await db.query(query, [nuevaCantidad, idProducto, idAlmacen]);
  }
  
  // Nuevo método: Usar procedimiento almacenado
  static async obtenerDisponible(idProducto, idAlmacen) {
    const [result] = await db.query(
      'CALL sp_obtener_stock_disponible(?, ?)', 
      [idProducto, idAlmacen]
    );
    return result[0][0];
  }
  
  // Nuevo método: Obtener productos con stock bajo usando vista
  static async obtenerStockBajo(idEmpresa) {
    const query = `
      SELECT * FROM v_productos_stock_bajo
      WHERE id_empresa = ?
      ORDER BY faltante DESC
    `;
    
    return await db.query(query, [idEmpresa]);
  }
}

module.exports = Stock;
```

---

## 🎮 ACTUALIZACIÓN DE CONTROLLERS

### Controller: VentasController.js

```javascript
// ❌ ANTES
class VentasController {
  async crear(req, res) {
    try {
      const { items, cliente, metodoPago } = req.body;
      const { id_empresa, id_sucursal, id_caja, id: id_usuario } = req.user;
      
      // Calcular totales
      const { subtotal, descuento, impuesto, total } = 
        await Venta.calcularTotales(items);
      
      // Crear venta
      const venta = await Venta.crear({
        id_empresa,
        id_sucursal,
        id_caja,
        id_usuario,
        id_cliente: cliente,
        subtotal,
        descuento,
        impuesto,
        total
      });
      
      res.json({ success: true, venta });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

// ✅ DESPUÉS
class VentasController {
  async crear(req, res) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { items, cliente, metodoPago, descuento = 0 } = req.body;
      const { id_empresa, id_sucursal, id_caja, id: id_usuario } = req.user;
      
      // Obtener configuración de impuesto de la empresa
      const [empresa] = await connection.query(
        'SELECT valor_impuesto FROM empresa WHERE id = ?',
        [id_empresa]
      );
      const porcentajeImpuesto = empresa[0].valor_impuesto;
      
      // Calcular totales
      const totales = await Venta.calcularTotales(items, descuento, porcentajeImpuesto);
      
      // Obtener siguiente número de comprobante
      const [serie] = await connection.query(`
        SELECT serie, numero_actual 
        FROM serializacion_comprobantes
        WHERE id_sucursal = ? AND por_default = TRUE AND activo = TRUE
        LIMIT 1
      `, [id_sucursal]);
      
      const numeroComprobante = serie[0].numero_actual;
      
      // Crear venta
      const [resultVenta] = await connection.query(`
        INSERT INTO ventas (
          id_empresa, id_sucursal, id_caja, id_usuario,
          id_cliente, id_tipo_comprobante, serie, numero,
          sub_total, descuento, total_impuestos, monto_total,
          cantidad_productos, valor_impuesto, estado
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'COMPLETADA')
      `, [
        id_empresa, id_sucursal, id_caja, id_usuario,
        cliente, serie[0].id_tipo_comprobante, serie[0].serie, numeroComprobante,
        totales.sub_total, totales.descuento, totales.total_impuestos, 
        totales.monto_total, totales.cantidad_productos, totales.valor_impuesto
      ]);
      
      const idVenta = resultVenta.insertId;
      
      // Insertar detalles y actualizar stock
      for (const item of items) {
        // Insertar detalle
        await connection.query(`
          INSERT INTO detalle_venta (
            id_empresa, id_venta, id_producto, id_sucursal, id_almacen,
            cantidad, precio_venta, descuento, descripcion, precio_compra
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          id_empresa, idVenta, item.id_producto, id_sucursal, item.id_almacen,
          item.cantidad, item.precio_venta, item.descuento || 0,
          item.descripcion, item.precio_compra || 0
        ]);
        
        // Actualizar stock
        await connection.query(`
          UPDATE stock 
          SET cantidad_actual = cantidad_actual - ?
          WHERE id_producto = ? AND id_almacen = ?
        `, [item.cantidad, item.id_producto, item.id_almacen]);
        
        // Registrar movimiento de stock
        await connection.query(`
          INSERT INTO movimientos_stock (
            id_empresa, id_producto, id_almacen, tipo_movimiento,
            cantidad, precio_unitario, motivo, documento_referencia, id_usuario
          ) VALUES (?, ?, ?, 'SALIDA', ?, ?, 'Venta', ?, ?)
        `, [
          id_empresa, item.id_producto, item.id_almacen,
          item.cantidad, item.precio_venta, 
          `${serie[0].serie}-${numeroComprobante}`, id_usuario
        ]);
      }
      
      // Registrar forma de pago
      await connection.query(`
        INSERT INTO formas_pago_venta (
          id_empresa, id_venta, id_metodo_pago, monto
        ) VALUES (?, ?, ?, ?)
      `, [id_empresa, idVenta, metodoPago, totales.monto_total]);
      
      // Actualizar número de comprobante
      await connection.query(`
        UPDATE serializacion_comprobantes
        SET numero_actual = numero_actual + 1
        WHERE id_sucursal = ? AND serie = ?
      `, [id_sucursal, serie[0].serie]);
      
      await connection.commit();
      
      // Obtener venta completa
      const [ventaCompleta] = await connection.query(`
        SELECT v.*, 
               CONCAT(v.serie, '-', LPAD(v.numero, 8, '0')) as numero_comprobante
        FROM ventas v
        WHERE v.id = ?
      `, [idVenta]);
      
      res.json({ 
        success: true, 
        venta: ventaCompleta[0],
        mensaje: 'Venta registrada exitosamente'
      });
      
    } catch (error) {
      await connection.rollback();
      console.error('Error al crear venta:', error);
      res.status(500).json({ 
        success: false,
        error: 'Error al registrar la venta',
        detalle: error.message 
      });
    } finally {
      connection.release();
    }
  }
  
  async obtenerVentasHoy(req, res) {
    try {
      const { id_empresa } = req.user;
      
      // Usar vista para obtener ventas del día
      const ventas = await db.query(`
        SELECT * FROM v_ventas_hoy
        WHERE id_empresa = ?
        ORDER BY fecha_venta DESC
      `, [id_empresa]);
      
      res.json({ success: true, ventas });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new VentasController();
```

---

### Controller: ProductosController.js

```javascript
// ✅ NUEVO - Con historial de precios
class ProductosController {
  async actualizarPrecio(req, res) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      const { id } = req.params;
      const { precio_venta, motivo } = req.body;
      const { id_empresa, id: id_usuario } = req.user;
      
      // Obtener precio anterior
      const [productoAnterior] = await connection.query(
        'SELECT precio_venta FROM productos WHERE id = ? AND id_empresa = ?',
        [id, id_empresa]
      );
      
      if (!productoAnterior[0]) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
      
      const precioAnterior = productoAnterior[0].precio_venta;
      
      // Actualizar precio
      await connection.query(
        'UPDATE productos SET precio_venta = ? WHERE id = ?',
        [precio_venta, id]
      );
      
      // Registrar en historial (el trigger lo hace automáticamente)
      // Pero también podemos hacerlo manualmente si queremos agregar motivo
      await connection.query(`
        INSERT INTO historial_precios (
          id_empresa, id_producto, precio_anterior, precio_nuevo,
          tipo_precio, id_usuario, motivo
        ) VALUES (?, ?, ?, ?, 'VENTA', ?, ?)
      `, [id_empresa, id, precioAnterior, precio_venta, id_usuario, motivo]);
      
      await connection.commit();
      
      res.json({ 
        success: true, 
        mensaje: 'Precio actualizado exitosamente',
        precio_anterior: precioAnterior,
        precio_nuevo: precio_venta
      });
      
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ error: error.message });
    } finally {
      connection.release();
    }
  }
  
  async buscar(req, res) {
    try {
      const { q } = req.query;
      const { id_empresa } = req.user;
      
      // Usar índice FULLTEXT para búsqueda rápida
      const productos = await db.query(`
        SELECT p.*, c.nombre as categoria, s.cantidad_actual as stock
        FROM productos p
        INNER JOIN categorias c ON p.id_categoria = c.id
        LEFT JOIN stock s ON p.id = s.id_producto
        WHERE p.id_empresa = ?
          AND p.activo = TRUE
          AND p.eliminado = FALSE
          AND MATCH(p.nombre, p.descripcion) AGAINST(? IN BOOLEAN MODE)
        LIMIT 20
      `, [id_empresa, q]);
      
      res.json({ success: true, productos });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = new ProductosController();
```

---

## 🧪 EJEMPLOS DE TESTS

### Test: Venta.test.js

```javascript
const { expect } = require('chai');
const Venta = require('../models/Venta');

describe('Model: Venta', () => {
  describe('calcularTotales', () => {
    it('debe calcular correctamente los totales con IGV 18%', () => {
      const items = [
        { cantidad: 2, precio_venta: 10.00, descuento: 0, subtotal: 20.00 },
        { cantidad: 1, precio_venta: 30.00, descuento: 0, subtotal: 30.00 }
      ];
      
      const resultado = Venta.calcularTotales(items, 0, 18);
      
      expect(resultado.sub_total).to.equal(50.00);
      expect(resultado.total_impuestos).to.equal(9.00);
      expect(resultado.monto_total).to.equal(59.00);
      expect(resultado.cantidad_productos).to.equal(3);
    });
    
    it('debe aplicar descuento correctamente', () => {
      const items = [
        { cantidad: 1, precio_venta: 100.00, descuento: 0, subtotal: 100.00 }
      ];
      
      const resultado = Venta.calcularTotales(items, 10, 18);
      
      expect(resultado.sub_total).to.equal(100.00);
      expect(resultado.descuento).to.equal(10.00);
      expect(resultado.total_impuestos).to.equal(16.20); // (100-10) * 0.18
      expect(resultado.monto_total).to.equal(106.20);
    });
  });
});
```

---

## 📊 EJEMPLOS DE QUERIES OPTIMIZADAS

### Reportes con Vistas

```javascript
class ReportesService {
  // Productos con stock bajo
  static async productosStockBajo(idEmpresa) {
    return await db.query(`
      SELECT * FROM v_productos_stock_bajo
      WHERE id_empresa = ?
      ORDER BY faltante DESC
      LIMIT 50
    `, [idEmpresa]);
  }
  
  // Ventas del día
  static async ventasHoy(idEmpresa) {
    return await db.query(`
      SELECT * FROM v_ventas_hoy
      WHERE id_empresa = ?
      ORDER BY fecha_venta DESC
    `, [idEmpresa]);
  }
  
  // Productos más vendidos
  static async productosMasVendidos(idEmpresa, limite = 10) {
    return await db.query(`
      SELECT * FROM v_productos_mas_vendidos
      WHERE id_empresa = ?
      LIMIT ?
    `, [idEmpresa, limite]);
  }
  
  // Cuentas por cobrar vencidas
  static async cuentasPorCobrarVencidas(idEmpresa) {
    return await db.query(`
      SELECT * FROM v_cuentas_cobrar_vencidas
      WHERE id_empresa = ?
      ORDER BY dias_vencidos DESC
    `, [idEmpresa]);
  }
}

module.exports = ReportesService;
```

---

## 🔄 SCRIPT DE MIGRACIÓN DE DATOS

Si ya tienes datos en producción, usa este script para migrar:

```javascript
// scripts/migrar_campos_ventas.js
const mysql = require('mysql2/promise');

async function migrarCampos() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  });
  
  try {
    console.log('Iniciando migración de campos...');
    
    // Migrar ventas: copiar datos antes de eliminar columnas
    await connection.query(`
      UPDATE ventas 
      SET sub_total = COALESCE(subtotal, sub_total),
          monto_total = COALESCE(total, monto_total),
          total_impuestos = COALESCE(impuesto, total_impuestos)
      WHERE sub_total IS NULL OR monto_total IS NULL OR total_impuestos IS NULL
    `);
    
    console.log('✅ Datos de ventas migrados');
    
    // Migrar stock: copiar datos antes de eliminar columna
    await connection.query(`
      UPDATE stock 
      SET cantidad_actual = COALESCE(stock, cantidad_actual)
      WHERE cantidad_actual IS NULL
    `);
    
    console.log('✅ Datos de stock migrados');
    
    console.log('✅ Migración completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error en migración:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Ejecutar
migrarCampos()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
```

---

## 🎯 CHECKLIST DE ACTUALIZACIÓN

### Archivos a Modificar
- [ ] `models/Venta.js`
- [ ] `models/DetalleVenta.js`
- [ ] `models/Stock.js`
- [ ] `models/Producto.js`
- [ ] `controllers/VentasController.js`
- [ ] `controllers/ProductosController.js`
- [ ] `controllers/StockController.js`
- [ ] `services/ReportesService.js`
- [ ] `tests/Venta.test.js`
- [ ] `tests/Stock.test.js`

### Verificaciones
- [ ] Todos los tests pasando
- [ ] Queries actualizadas
- [ ] Vistas funcionando
- [ ] Procedimientos almacenados funcionando
- [ ] Sin errores en logs

---

**Última actualización:** ${new Date().toLocaleDateString('es-ES')}
**Versión:** 1.0
