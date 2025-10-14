# 📋 PLAN DE ACCIÓN - MEJORAS BASE DE DATOS POS

## 🎯 OBJETIVO
Llevar la base de datos del sistema POS de un **9.1/10** a un **10/10** perfecto, corrigiendo problemas críticos y aplicando mejoras profesionales.

---

## 📅 CRONOGRAMA DE IMPLEMENTACIÓN

### **FASE 1: CORRECCIONES CRÍTICAS** (Prioridad ALTA) 🔴
**Tiempo estimado:** 2-3 horas
**Impacto:** CRÍTICO - Debe hacerse antes de producción

#### Paso 1.1: Backup de Seguridad
```bash
# Crear backup antes de cualquier cambio
npm run db:backup
# O manualmente:
mysqldump -u root -p pos_system > backup_antes_correcciones.sql
```

#### Paso 1.2: Ejecutar Correcciones Críticas
```bash
# Opción 1: Ejecutar el archivo completo
mysql -u root -p pos_system < posNew/backend/db/correcciones_criticas.sql

# Opción 2: Ejecutar por partes (recomendado)
# Parte 1: Crear tabla tipos_documento
# Parte 2: Corregir campos duplicados
# Parte 3: Agregar validaciones
```

#### Paso 1.3: Verificar Cambios
```sql
-- Verificar que la tabla tipos_documento existe
SHOW TABLES LIKE 'tipos_documento';

-- Verificar que se eliminaron campos duplicados
DESCRIBE ventas;
DESCRIBE detalle_venta;
DESCRIBE stock;

-- Verificar constraints
SHOW CREATE TABLE productos;
SHOW CREATE TABLE stock;
```

#### Paso 1.4: Actualizar Código del Backend
**Archivos a modificar:**

1. **Models/Ventas.js**
```javascript
// ANTES:
const venta = {
  subtotal: 100.00,
  total: 118.00,
  impuesto: 18.00
};

// DESPUÉS:
const venta = {
  sub_total: 100.00,
  monto_total: 118.00,
  total_impuestos: 18.00
};
```

2. **Models/DetalleVenta.js**
```javascript
// ANTES:
const detalle = {
  precio_unitario: 10.00,
  subtotal: calculado,
  total: calculado
};

// DESPUÉS:
const detalle = {
  precio_venta: 10.00,
  subtotal: calculado  // Solo este campo
};
```

3. **Models/Stock.js**
```javascript
// ANTES:
const stock = {
  stock: 50,
  cantidad_actual: 50
};

// DESPUÉS:
const stock = {
  cantidad_actual: 50  // Solo este campo
};
```

#### Paso 1.5: Testing de Correcciones
```bash
# Ejecutar tests unitarios
npm test

# Probar endpoints críticos
# POST /api/ventas
# GET /api/productos/:id/stock
# PUT /api/productos/:id
```

---

### **FASE 2: MEJORAS DE RENDIMIENTO** (Prioridad MEDIA) 🟡
**Tiempo estimado:** 1-2 horas
**Impacto:** ALTO - Mejora significativa de performance

#### Paso 2.1: Agregar Índices FULLTEXT
```sql
-- Para búsqueda rápida de productos
ALTER TABLE productos
  ADD FULLTEXT INDEX idx_productos_busqueda (nombre, descripcion);

-- Para búsqueda rápida de clientes
ALTER TABLE clientes_proveedores
  ADD FULLTEXT INDEX idx_clientes_busqueda (nombres, apellidos, razon_social);
```

#### Paso 2.2: Implementar Vistas de Reportes
```sql
-- Las vistas ya están en correcciones_criticas.sql
-- Verificar que se crearon correctamente
SHOW FULL TABLES WHERE Table_type = 'VIEW';

-- Probar las vistas
SELECT * FROM v_productos_stock_bajo LIMIT 10;
SELECT * FROM v_ventas_hoy LIMIT 10;
SELECT * FROM v_productos_mas_vendidos LIMIT 10;
```

#### Paso 2.3: Actualizar Queries en el Backend
```javascript
// ANTES: Query compleja en el código
const productosStockBajo = await db.query(`
  SELECT p.*, c.nombre as categoria, s.cantidad_actual, s.stock_minimo
  FROM productos p
  INNER JOIN categorias c ON p.id_categoria = c.id
  INNER JOIN stock s ON p.id = s.id_producto
  WHERE s.cantidad_actual <= s.stock_minimo
  ...
`);

// DESPUÉS: Usar la vista
const productosStockBajo = await db.query(`
  SELECT * FROM v_productos_stock_bajo 
  WHERE id_empresa = ?
`, [empresaId]);
```

#### Paso 2.4: Optimizar Queries Lentas
```sql
-- Identificar queries lentas
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1;

-- Analizar después de un día de uso
SELECT * FROM mysql.slow_log ORDER BY query_time DESC LIMIT 20;

-- Usar EXPLAIN en queries problemáticas
EXPLAIN SELECT * FROM ventas WHERE fecha_venta BETWEEN '2024-01-01' AND '2024-12-31';
```

---

### **FASE 3: FUNCIONALIDADES AVANZADAS** (Prioridad MEDIA) 🟡
**Tiempo estimado:** 3-4 horas
**Impacto:** MEDIO - Agrega valor profesional

#### Paso 3.1: Implementar Historial de Precios
```javascript
// En ProductosController.js
async actualizarPrecio(req, res) {
  const { id } = req.params;
  const { precio_venta, motivo } = req.body;
  
  // Obtener precio anterior
  const productoAnterior = await Producto.findById(id);
  
  // Actualizar precio
  await Producto.update(id, { precio_venta });
  
  // Registrar en historial
  await HistorialPrecios.create({
    id_producto: id,
    precio_anterior: productoAnterior.precio_venta,
    precio_nuevo: precio_venta,
    tipo_precio: 'VENTA',
    id_usuario: req.user.id,
    motivo
  });
}
```

#### Paso 3.2: Implementar Gestión de Lotes
```javascript
// Crear modelo Lote
class Lote {
  static async crear(data) {
    return await db.query(`
      INSERT INTO lotes_productos 
      (id_empresa, id_producto, id_almacen, codigo_lote, 
       fecha_vencimiento, cantidad, precio_compra)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [data.id_empresa, data.id_producto, data.id_almacen, 
        data.codigo_lote, data.fecha_vencimiento, 
        data.cantidad, data.precio_compra]);
  }
  
  static async obtenerProximosAVencer(dias = 30) {
    return await db.query(`
      SELECT l.*, p.nombre as producto, a.nombre as almacen
      FROM lotes_productos l
      INNER JOIN productos p ON l.id_producto = p.id
      INNER JOIN almacen a ON l.id_almacen = a.id
      WHERE l.fecha_vencimiento BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
        AND l.cantidad > 0
        AND l.activo = TRUE
      ORDER BY l.fecha_vencimiento ASC
    `, [dias]);
  }
}
```

#### Paso 3.3: Implementar Procedimientos Almacenados
```javascript
// Usar procedimientos almacenados para operaciones complejas
class VentaService {
  static async calcularTotales(idVenta) {
    const [result] = await db.query('CALL sp_calcular_totales_venta(?)', [idVenta]);
    return result[0];
  }
  
  static async limpiarSesionesExpiradas() {
    const [result] = await db.query('CALL sp_limpiar_sesiones_expiradas()');
    return result[0];
  }
}
```

---

### **FASE 4: MONITOREO Y OPTIMIZACIÓN** (Prioridad BAJA) 🟢
**Tiempo estimado:** 2-3 horas
**Impacto:** BAJO - Mantenimiento a largo plazo

#### Paso 4.1: Configurar Monitoreo de Performance
```sql
-- Habilitar Performance Schema
UPDATE performance_schema.setup_instruments 
SET ENABLED = 'YES', TIMED = 'YES' 
WHERE NAME LIKE 'statement/%';

-- Monitorear queries más lentas
SELECT 
  DIGEST_TEXT,
  COUNT_STAR,
  AVG_TIMER_WAIT/1000000000 as avg_ms,
  SUM_TIMER_WAIT/1000000000 as total_ms
FROM performance_schema.events_statements_summary_by_digest
ORDER BY SUM_TIMER_WAIT DESC
LIMIT 10;
```

#### Paso 4.2: Implementar Limpieza Automática
```javascript
// En un cron job o scheduled task
const cron = require('node-cron');

// Limpiar sesiones expiradas cada hora
cron.schedule('0 * * * *', async () => {
  await db.query('CALL sp_limpiar_sesiones_expiradas()');
  console.log('Sesiones expiradas limpiadas');
});

// Limpiar logs antiguos cada día a las 2 AM
cron.schedule('0 2 * * *', async () => {
  await db.query(`
    UPDATE system_logs 
    SET eliminado = TRUE, fecha_eliminacion = NOW()
    WHERE fecha_log < DATE_SUB(NOW(), INTERVAL 90 DAY)
      AND eliminado = FALSE
  `);
  console.log('Logs antiguos archivados');
});
```

#### Paso 4.3: Optimizar Tablas Periódicamente
```sql
-- Ejecutar mensualmente
OPTIMIZE TABLE ventas;
OPTIMIZE TABLE detalle_venta;
OPTIMIZE TABLE movimientos_stock;
OPTIMIZE TABLE audit_trail;
OPTIMIZE TABLE system_logs;

-- Actualizar estadísticas
ANALYZE TABLE ventas;
ANALYZE TABLE productos;
ANALYZE TABLE stock;
```

---

## ✅ CHECKLIST DE VERIFICACIÓN

### Pre-Implementación
- [ ] Backup completo de la base de datos creado
- [ ] Entorno de desarrollo/staging preparado
- [ ] Tests unitarios existentes pasando
- [ ] Documentación de cambios preparada

### Post-Fase 1 (Crítico)
- [ ] Tabla `tipos_documento` creada y poblada
- [ ] Campos duplicados eliminados en `ventas`
- [ ] Campos duplicados eliminados en `detalle_venta`
- [ ] Campo `stock` eliminado de tabla `stock`
- [ ] Validaciones CHECK agregadas
- [ ] Código del backend actualizado
- [ ] Tests pasando con nuevos campos
- [ ] Queries actualizadas en el backend

### Post-Fase 2 (Rendimiento)
- [ ] Índices FULLTEXT creados
- [ ] Vistas de reportes creadas
- [ ] Queries optimizadas usando vistas
- [ ] Performance mejorada (medida con EXPLAIN)

### Post-Fase 3 (Funcionalidades)
- [ ] Historial de precios implementado
- [ ] Gestión de lotes implementada
- [ ] Procedimientos almacenados funcionando
- [ ] Triggers de auditoría activos

### Post-Fase 4 (Monitoreo)
- [ ] Monitoreo de performance configurado
- [ ] Limpieza automática implementada
- [ ] Optimización periódica programada
- [ ] Alertas configuradas

---

## 🚨 ROLLBACK PLAN

Si algo sale mal, sigue estos pasos:

### Rollback Completo
```bash
# Restaurar desde backup
mysql -u root -p pos_system < backup_antes_correcciones.sql

# Verificar restauración
mysql -u root -p pos_system -e "SELECT COUNT(*) FROM ventas;"
```

### Rollback Parcial (Solo Estructura)
```sql
-- Revertir cambios específicos
ALTER TABLE ventas ADD COLUMN subtotal DECIMAL(10,2);
ALTER TABLE ventas ADD COLUMN impuesto DECIMAL(10,2);
-- etc.
```

---

## 📊 MÉTRICAS DE ÉXITO

### Performance
- [ ] Queries de búsqueda < 100ms
- [ ] Carga de dashboard < 500ms
- [ ] Registro de venta < 200ms
- [ ] Reportes < 1 segundo

### Calidad
- [ ] 0 campos duplicados
- [ ] 100% de tablas con validaciones
- [ ] 100% de FKs correctas
- [ ] 0 queries sin índices

### Funcionalidad
- [ ] Todas las vistas funcionando
- [ ] Todos los procedimientos funcionando
- [ ] Todos los triggers activos
- [ ] Historial de cambios completo

---

## 📞 SOPORTE Y RECURSOS

### Documentación Generada
- `ANALISIS_COMPLETO_BASE_DATOS_POS.md` - Análisis detallado
- `correcciones_criticas.sql` - Script de correcciones
- `PLAN_ACCION_MEJORAS_DB.md` - Este documento

### Comandos Útiles
```bash
# Verificar estado de la BD
npm run db:check

# Crear backup
npm run db:backup

# Resetear BD (desarrollo)
npm run db:reset

# Ver logs de MySQL
tail -f /var/log/mysql/error.log
```

### Testing
```bash
# Tests unitarios
npm test

# Tests de integración
npm run test:integration

# Tests de performance
npm run test:performance
```

---

## 🎉 RESULTADO ESPERADO

Al completar todas las fases:

✅ Base de datos **10/10** perfecta
✅ Performance optimizada
✅ Código limpio y mantenible
✅ Funcionalidades profesionales
✅ Monitoreo y alertas activas
✅ Sistema listo para producción

---

**Última actualización:** ${new Date().toLocaleDateString('es-ES')}
**Versión:** 1.0
**Autor:** Kiro AI - Asistente de Desarrollo
