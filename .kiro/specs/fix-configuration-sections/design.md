# Documento de Diseño - Corrección de Secciones de Configuración

## Resumen Ejecutivo

Este documento detalla el diseño de las correcciones necesarias para resolver las inconsistencias entre el frontend, backend y base de datos en las secciones de configuración del sistema POS. Se han identificado múltiples problemas de mapeo de campos, validaciones inconsistentes y manejo inadecuado de errores que causan fallos en las operaciones CRUD.

## Arquitectura General

### Flujo de Datos Actual (Problemático)

```
Frontend (React) → API Layer → Backend Controller → Backend Service → Backend Repository → Database
     ↓                ↓              ↓                    ↓                  ↓              ↓
  Zod Schema    API Calls      DTO Validation      Business Logic    SQL Queries      MySQL
  (camelCase)   (camelCase)    (mixed case)        (mixed case)      (snake_case)   (snake_case)
```

**Problemas Identificados:**
1. Inconsistencia en nombres de campos entre capas
2. Validaciones duplicadas y contradictorias
3. Transformación de datos inadecuada
4. Mensajes de error genéricos
5. Campos faltantes en esquemas

### Flujo de Datos Propuesto (Corregido)

```
Frontend → API Layer → Backend Controller → Backend Service → Backend Repository → Database
   ↓           ↓              ↓                    ↓                  ↓              ↓
Zod Schema  Transform     DTO Validation      Business Logic    Transform      MySQL
(camelCase) to snake    (snake_case)         (snake_case)      to snake     (snake_case)
            + validate                                          + validate
```

## Análisis de Inconsistencias por Sección

### 1. Impresoras (Printers)

#### Inconsistencias Identificadas

**Base de Datos (schema.sql):**
```sql
CREATE TABLE impresoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_caja INT,
    name VARCHAR(255) NOT NULL,
    nombre VARCHAR(100),  -- Campo legacy
    tipo ENUM('termica', 'matricial', 'laser') DEFAULT 'termica',
    puerto VARCHAR(50),
    pc_name VARCHAR(255),
    ip_local VARCHAR(45),
    state BOOLEAN DEFAULT TRUE,
    configuracion JSON,
    activo BOOLEAN DEFAULT TRUE,
    ...
)
```

**Frontend Schema (printer.schema.js):**
```javascript
{
  idEmpresa: number (required),
  idSucursal: number (required),
  idCaja: number (optional, nullable),
  name: string (required, max 255),
  tipo: enum (optional),  // ❌ PROBLEMA: Debería ser required con default
  puerto: string (optional, max 50),
  pcName: string (optional, max 255),
  ipLocal: string (optional, max 45),
  state: boolean (optional),  // ❌ PROBLEMA: Falta default true
  configuracion: string (optional)  // ❌ PROBLEMA: Debería ser JSON/object
}
```

**Backend DTO (dto.impresoras.js):**
```javascript
{
  idEmpresa: number,
  idSucursal: number,
  idCaja: number (nullable, optional),
  name: string (required),
  nombre: string (optional),  // ❌ PROBLEMA: Campo legacy innecesario
  tipo: enum (default 'termica'),
  puerto: string (optional),
  pcName: string (optional),
  ipLocal: string (optional),
  state: boolean (optional, default true),
  configuracion: any (optional)  // ❌ PROBLEMA: Tipo muy permisivo
}
```

**Problemas Específicos:**
1. Frontend no valida `tipo` con default, backend sí
2. Frontend trata `configuracion` como string, debería ser JSON
3. Campo `nombre` legacy en backend DTO pero no en frontend
4. Falta validación de formato JSON en `configuracion`
5. No hay validación de formato IP en `ip_local`

#### Solución Propuesta

**Nuevo Frontend Schema:**
```javascript
export const printerSchema = z.object({
  idEmpresa: z.number().int().positive(),
  idSucursal: z.number().int().positive(),
  idCaja: z.number().int().positive().nullable().optional(),
  name: z.string().min(1).max(255),
  tipo: z.enum(['termica', 'matricial', 'laser']).default('termica'),
  puerto: z.string().max(50).optional(),
  pcName: z.string().max(255).optional(),
  ipLocal: z.string().ip({ version: 'v4' }).or(z.literal('')).optional(),
  state: z.boolean().default(true),
  configuracion: z.record(z.any()).or(z.null()).optional(),
  activo: z.boolean().default(true).optional()
});
```

**Nuevo Backend DTO:**
```javascript
export const esquemaCrearImpresora = z.object({
  id_empresa: z.number().int(),
  id_sucursal: z.number().int(),
  id_caja: z.number().int().nullable().optional(),
  name: z.string().min(1).max(255),
  tipo: z.enum(['termica', 'matricial', 'laser']).default('termica'),
  puerto: z.string().max(50).optional(),
  pc_name: z.string().max(255).optional(),
  ip_local: z.string().max(45).optional(),
  state: z.boolean().default(true),
  configuracion: z.record(z.any()).nullable().optional(),
  activo: z.boolean().default(true).optional()
});
```

### 2. Métodos de Pago (Payment Methods)

#### Inconsistencias Identificadas

**Base de Datos:**
```sql
CREATE TABLE metodos_pago (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,  -- ❌ NOT NULL pero frontend lo hace optional
    nombre VARCHAR(100) NOT NULL,  -- ❌ NOT NULL pero frontend lo hace optional
    descripcion TEXT,
    imagen VARCHAR(255),
    requiere_referencia BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_codigo_empresa_metodo (id_empresa, codigo)
)
```

**Frontend Schema:**
```javascript
{
  idEmpresa: number (required),
  codigo: string (optional, max 20),  // ❌ PROBLEMA: Debería ser required
  nombre: string (optional, max 100),  // ❌ PROBLEMA: Debería ser required
  descripcion: string (optional, max 500),  // ❌ PROBLEMA: DB es TEXT sin límite
  imagen: string (optional, max 500),  // ❌ PROBLEMA: DB es VARCHAR(255)
  requiereReferencia: boolean (optional)
}
```

**Problemas Específicos:**
1. `codigo` y `nombre` son NOT NULL en DB pero optional en frontend
2. Límites de longitud no coinciden (descripcion, imagen)
3. No hay validación de unicidad de `codigo` en frontend
4. Falta campo `activo` en frontend schema

#### Solución Propuesta

**Nuevo Frontend Schema:**
```javascript
export const paymentMethodSchema = z.object({
  idEmpresa: z.number().int().positive(),
  codigo: z.string().min(1).max(10),  // Required, coincide con DB
  nombre: z.string().min(1).max(100),  // Required, coincide con DB
  descripcion: z.string().max(1000).optional(),  // Límite razonable para TEXT
  imagen: z.string().max(255).optional(),  // Coincide con DB
  requiereReferencia: z.boolean().default(false),
  activo: z.boolean().default(true).optional()
});
```

### 3. Tipos de Comprobantes (Document Types)

#### Inconsistencias Identificadas

**Base de Datos:**
```sql
CREATE TABLE tipo_comprobantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(10) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    destino ENUM('VENTA', 'COMPRA', 'INTERNO') DEFAULT 'VENTA',
    activo BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_codigo_empresa_comp (id_empresa, codigo)
)
```

**Frontend Schema:**
```javascript
{
  idEmpresa: number (required),
  codigo: string (optional, max 20),  // ❌ PROBLEMA: DB es max 10 y required
  nombre: string (optional, max 100),  // ❌ PROBLEMA: Debería ser required
  descripcion: string (optional, max 500),
  destino: enum (optional)  // ❌ PROBLEMA: Tiene default en DB
}
```

**Problemas Específicos:**
1. Límite de `codigo` no coincide (20 vs 10)
2. `codigo` y `nombre` son required en DB pero optional en frontend
3. `destino` tiene default 'VENTA' en DB pero no en frontend
4. Falta campo `activo`

#### Solución Propuesta

**Nuevo Frontend Schema:**
```javascript
export const documentTypeSchema = z.object({
  idEmpresa: z.number().int().positive(),
  codigo: z.string().min(1).max(10),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(1000).optional(),
  destino: z.enum(['VENTA', 'COMPRA', 'INTERNO']).default('VENTA'),
  activo: z.boolean().default(true).optional()
});
```

### 4. Serialización de Comprobantes (Serialization)

#### Inconsistencias Identificadas

**Base de Datos:**
```sql
CREATE TABLE serializacion_comprobantes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_sucursal INT NOT NULL,
    id_tipo_comprobante INT NOT NULL,
    serie VARCHAR(10) NOT NULL,
    numero_inicial INT NOT NULL DEFAULT 1,
    numero_actual INT NOT NULL DEFAULT 1,
    numero_final INT,
    cantidad_numeros INT DEFAULT 1000,
    por_default BOOLEAN DEFAULT FALSE,
    activo BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_serie_sucursal_tipo (id_sucursal, id_tipo_comprobante, serie)
)
```

**Frontend Schema:**
```javascript
{
  idEmpresa: number (required),
  idSucursal: number (required),
  idTipoComprobante: number (required),
  serie: string (optional, max 10),  // ❌ PROBLEMA: Debería ser required
  numeroInicial: number (optional),  // ❌ PROBLEMA: Debería tener default 1
  numeroActual: number (optional),  // ❌ PROBLEMA: Debería tener default 1
  numeroFinal: number (optional, nullable),
  porDefault: boolean (optional)  // ❌ PROBLEMA: Falta default false
}
```

**Backend DTO:**
```javascript
{
  idEmpresa: number,
  idSucursal: number,
  idTipoComprobante: number,
  serie: string (optional),  // ❌ PROBLEMA: Debería ser required
  numeroInicial: number (optional, default 1),
  numeroActual: number (optional, default 1),
  numeroFinal: number (optional),
  cantidadNumeros: number (optional, default 1000),  // ❌ PROBLEMA: Falta en frontend
  porDefault: boolean (default false, optional),
  activo: boolean (default true, optional)
}
```

**Problemas Específicos:**
1. `serie` es required en DB pero optional en frontend y backend
2. Falta campo `cantidadNumeros` en frontend
3. Falta campo `activo` en frontend
4. No hay validación de que `numeroActual` esté entre `numeroInicial` y `numeroFinal`
5. No hay validación de unicidad de serie por sucursal y tipo

#### Solución Propuesta

**Nuevo Frontend Schema:**
```javascript
export const serializationSchema = z.object({
  idEmpresa: z.number().int().positive(),
  idSucursal: z.number().int().positive(),
  idTipoComprobante: z.number().int().positive(),
  serie: z.string().min(1).max(10),
  numeroInicial: z.number().int().positive().default(1),
  numeroActual: z.number().int().positive().default(1),
  numeroFinal: z.number().int().positive().nullable().optional(),
  cantidadNumeros: z.number().int().positive().default(1000),
  porDefault: z.boolean().default(false),
  activo: z.boolean().default(true).optional()
}).refine(
  (data) => !data.numeroFinal || data.numeroActual <= data.numeroFinal,
  { message: 'El número actual no puede ser mayor al número final', path: ['numeroActual'] }
).refine(
  (data) => data.numeroActual >= data.numeroInicial,
  { message: 'El número actual no puede ser menor al número inicial', path: ['numeroActual'] }
);
```

### 5. Usuarios (Users)

#### Inconsistencias Identificadas

**Base de Datos:**
```sql
CREATE TABLE usuarios (
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
    id_tipodocumento INT,
    nro_doc VARCHAR(20),
    correo VARCHAR(100),  -- Alias para email
    id_auth VARCHAR(100),
    tema ENUM('light', 'dark') DEFAULT 'light',
    fecharegistro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('ACTIVO', 'INACTIVO') DEFAULT 'ACTIVO',
    ...
)
```

**Frontend Schema:**
```javascript
{
  idEmpresa: number (required),
  idRol: number (required),
  username: string (optional, max 50),  // ❌ PROBLEMA: Debería ser required
  password: string (optional, max 100),  // ❌ PROBLEMA: DB es max 255
  nombres: string (optional, max 100),  // ❌ PROBLEMA: Debería ser required
  apellidos: string (optional, max 100),  // ❌ PROBLEMA: Debería ser required
  email: string (optional, max 100),
  telefono: string (optional, max 20),
  idTipodocumento: number (optional, nullable),
  nroDoc: string (optional, max 20),
  tema: enum (optional),  // ❌ PROBLEMA: Falta default 'light'
  estado: enum (optional)  // ❌ PROBLEMA: Falta default 'ACTIVO'
}
```

**Backend DTO:**
```javascript
{
  nombreUsuario: string (optional),  // ❌ PROBLEMA: Nombre diferente (username)
  contrasena: string (optional),  // ❌ PROBLEMA: Nombre diferente (password)
  nombres: string (optional),
  apellidos: string (optional),
  correo: string (optional),  // ❌ PROBLEMA: Nombre diferente (email)
  telefono: string (optional),
  idRol: number (required),
  idEmpresa: number (required)
}
```

**Problemas Específicos:**
1. Nombres de campos inconsistentes entre frontend y backend (username/nombreUsuario, password/contrasena, email/correo)
2. Campos required en DB pero optional en schemas
3. Límite de password no coincide (100 vs 255)
4. Faltan campos en backend DTO: `id_tipodocumento`, `nro_doc`, `tema`, `estado`, `activo`
5. No hay validación de formato de email
6. No hay validación de fortaleza de contraseña
7. Campo `username` debe ser único pero no hay validación en frontend

#### Solución Propuesta

**Nuevo Frontend Schema:**
```javascript
export const userSchema = z.object({
  idEmpresa: z.number().int().positive(),
  idRol: z.number().int().positive(),
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(255)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  nombres: z.string().min(1).max(100),
  apellidos: z.string().min(1).max(100),
  email: z.string().email().max(100).optional(),
  telefono: z.string().max(20).optional(),
  idTipodocumento: z.number().int().positive().nullable().optional(),
  nroDoc: z.string().max(20).optional(),
  tema: z.enum(['light', 'dark']).default('light'),
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
  activo: z.boolean().default(true).optional()
});

export const createUserSchema = userSchema;

export const updateUserSchema = userSchema.extend({
  password: z.string().min(8).max(255)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'La contraseña debe contener al menos una mayúscula, una minúscula y un número')
    .optional()  // Password es opcional en actualización
});
```

**Nuevo Backend DTO:**
```javascript
export const esquemaCrearUsuario = z.object({
  id_empresa: z.number().int().positive(),
  id_rol: z.number().int().positive(),
  username: z.string().min(3).max(50),
  password: z.string().min(8).max(255),
  nombres: z.string().min(1).max(100),
  apellidos: z.string().min(1).max(100),
  email: z.string().email().max(100).optional(),
  telefono: z.string().max(20).optional(),
  id_tipodocumento: z.number().int().positive().nullable().optional(),
  nro_doc: z.string().max(20).optional(),
  tema: z.enum(['light', 'dark']).default('light'),
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
  activo: z.boolean().default(true).optional()
});

export const esquemaActualizarUsuario = esquemaCrearUsuario.extend({
  id: z.number().int().positive(),
  password: z.string().min(8).max(255).optional()
}).partial().required({ id: true });
```

### 6. Roles y Permisos (Roles and Permissions)

#### Inconsistencias Identificadas

**Base de Datos - Roles:**
```sql
CREATE TABLE roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    activo BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_nombre_empresa_rol (id_empresa, nombre)
)
```

**Base de Datos - Permisos:**
```sql
CREATE TABLE permisos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    id_rol INT NOT NULL,
    id_modulo INT NOT NULL,
    puede_ver BOOLEAN DEFAULT FALSE,
    puede_crear BOOLEAN DEFAULT FALSE,
    puede_editar BOOLEAN DEFAULT FALSE,
    puede_eliminar BOOLEAN DEFAULT FALSE,
    UNIQUE KEY unique_rol_modulo (id_rol, id_modulo)
)
```

**Frontend Schema - Roles:**
```javascript
{
  idEmpresa: number (required),
  nombre: string (optional, max 50),  // ❌ PROBLEMA: Debería ser required
  descripcion: string (optional, max 500)  // ❌ PROBLEMA: DB es TEXT
}
```

**Backend DTO - Roles:**
```javascript
{
  idEmpresa: number,
  codigo: string (optional),  // ❌ PROBLEMA: No existe en DB
  nombre: string (optional),  // ❌ PROBLEMA: Debería ser required
  descripcion: string (optional)
}
```

**Problemas Específicos:**
1. Campo `codigo` en backend DTO no existe en la tabla `roles`
2. `nombre` es required en DB pero optional en schemas
3. No hay schema para permisos en frontend
4. Falta campo `activo` en frontend schema
5. No hay validación de unicidad de `nombre` por empresa

#### Solución Propuesta

**Nuevo Frontend Schema - Roles:**
```javascript
export const roleSchema = z.object({
  idEmpresa: z.number().int().positive(),
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(1000).optional(),
  activo: z.boolean().default(true).optional()
});
```

**Nuevo Frontend Schema - Permisos:**
```javascript
export const permissionSchema = z.object({
  idEmpresa: z.number().int().positive(),
  idRol: z.number().int().positive(),
  idModulo: z.number().int().positive(),
  puedeVer: z.boolean().default(false),
  puedeCrear: z.boolean().default(false),
  puedeEditar: z.boolean().default(false),
  puedeEliminar: z.boolean().default(false)
});

export const permissionsMatrixSchema = z.object({
  idEmpresa: z.number().int().positive(),
  idRol: z.number().int().positive(),
  permisos: z.array(permissionSchema)
});
```

**Nuevo Backend DTO - Roles:**
```javascript
export const esquemaCrearRol = z.object({
  id_empresa: z.number().int().positive(),
  nombre: z.string().min(1).max(50),
  descripcion: z.string().max(1000).optional(),
  activo: z.boolean().default(true).optional()
});

export const esquemaActualizarRol = esquemaCrearRol.extend({
  id: z.number().int().positive()
}).partial().required({ id: true });
```

**Nuevo Backend DTO - Permisos:**
```javascript
export const esquemaCrearPermiso = z.object({
  id_empresa: z.number().int().positive(),
  id_rol: z.number().int().positive(),
  id_modulo: z.number().int().positive(),
  puede_ver: z.boolean().default(false),
  puede_crear: z.boolean().default(false),
  puede_editar: z.boolean().default(false),
  puede_eliminar: z.boolean().default(false)
});

export const esquemaActualizarPermisos = z.object({
  id_empresa: z.number().int().positive(),
  id_rol: z.number().int().positive(),
  permisos: z.array(esquemaCrearPermiso)
});
```

### 7. Categorías (Categories)

#### Inconsistencias Identificadas

**Base de Datos:**
```sql
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_empresa INT NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    color VARCHAR(7) DEFAULT '#007bff',
    icono VARCHAR(50) DEFAULT 'folder',
    activo BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_codigo_empresa_cat (id_empresa, codigo)
)
```

**Frontend Schema:**
```javascript
{
  idEmpresa: number (required),
  codigo: string (optional, max 20),  // ❌ PROBLEMA: Debería ser required
  nombre: string (optional, max 100),  // ❌ PROBLEMA: Debería ser required
  descripcion: string (optional, max 500),
  color: string (optional, max 50),  // ❌ PROBLEMA: DB es max 7 (hex color)
  icono: string (optional, max 50)  // ❌ PROBLEMA: Falta default 'folder'
}
```

**Backend DTO:**
```javascript
{
  idEmpresa: number,
  codigo: string (optional),  // ❌ PROBLEMA: Debería ser required
  nombre: string (optional),  // ❌ PROBLEMA: Debería ser required
  descripcion: string (optional)
  // ❌ PROBLEMA: Faltan campos color e icono
}
```

**Problemas Específicos:**
1. `codigo` y `nombre` son required en DB pero optional en schemas
2. Límite de `color` no coincide (50 vs 7)
3. Faltan campos `color` e `icono` en backend DTO
4. Falta campo `activo` en frontend schema
5. No hay validación de formato hexadecimal para `color`
6. Faltan defaults para `color` e `icono`

#### Solución Propuesta

**Nuevo Frontend Schema:**
```javascript
export const categorySchema = z.object({
  idEmpresa: z.number().int().positive(),
  codigo: z.string().min(1).max(20),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido')
    .default('#007bff'),
  icono: z.string().max(50).default('folder'),
  activo: z.boolean().default(true).optional()
});
```

**Nuevo Backend DTO:**
```javascript
export const esquemaCrearCategoria = z.object({
  id_empresa: z.number().int().positive(),
  codigo: z.string().min(1).max(20),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#007bff'),
  icono: z.string().max(50).default('folder'),
  activo: z.boolean().default(true).optional()
});

export const esquemaActualizarCategoria = esquemaCrearCategoria.extend({
  id: z.number().int().positive()
}).partial().required({ id: true });
```

## Componentes y Interfaces

### 1. Capa de Transformación de Datos

Para resolver las inconsistencias de nombres de campos entre camelCase (frontend) y snake_case (backend/DB), se implementará una capa de transformación bidireccional.

**Archivo: `posNew/frontend/src/shared/utils/fieldTransform.js`**

```javascript
/**
 * Transforma campos de camelCase a snake_case
 */
export const toSnakeCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(toSnakeCase);
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    const snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
    acc[snakeKey] = toSnakeCase(obj[key]);
    return acc;
  }, {});
};

/**
 * Transforma campos de snake_case a camelCase
 */
export const toCamelCase = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  if (Array.isArray(obj)) {
    return obj.map(toCamelCase);
  }
  
  return Object.keys(obj).reduce((acc, key) => {
    const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
    acc[camelKey] = toCamelCase(obj[key]);
    return acc;
  }, {});
};
```

### 2. Manejo Mejorado de Errores

**Archivo: `posNew/backend/src/shared/utils/errorHandler.js`**

```javascript
export class ValidationError extends Error {
  constructor(message, field = null, code = 'VALIDATION_ERROR') {
    super(message);
    this.name = 'ValidationError';
    this.field = field;
    this.code = code;
    this.statusCode = 400;
  }
}

export class UniqueConstraintError extends Error {
  constructor(field, value) {
    super(`El valor '${value}' ya existe para el campo ${field}`);
    this.name = 'UniqueConstraintError';
    this.field = field;
    this.value = value;
    this.code = 'UNIQUE_CONSTRAINT';
    this.statusCode = 409;
  }
}

export class DependencyError extends Error {
  constructor(resource, dependencies) {
    super(`No se puede eliminar ${resource} porque tiene dependencias`);
    this.name = 'DependencyError';
    this.resource = resource;
    this.dependencies = dependencies;
    this.code = 'DEPENDENCY_ERROR';
    this.statusCode = 409;
  }
}

/**
 * Transforma errores de base de datos en errores amigables
 */
export const transformDatabaseError = (error) => {
  // Error de clave duplicada
  if (error.code === 'ER_DUP_ENTRY') {
    const match = error.sqlMessage.match(/for key '(.+?)'/);
    const key = match ? match[1] : 'unknown';
    
    // Extraer el campo del nombre de la clave
    let field = key.split('_').pop();
    if (field === 'empresa' || field === 'metodo' || field === 'comp') {
      field = key.split('_')[1]; // Tomar el segundo elemento
    }
    
    return new UniqueConstraintError(field, 'el valor proporcionado');
  }
  
  // Error de clave foránea
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return new DependencyError('el registro', ['registros relacionados']);
  }
  
  // Error de validación
  if (error.name === 'ZodError') {
    const firstError = error.errors[0];
    return new ValidationError(
      firstError.message,
      firstError.path.join('.'),
      'VALIDATION_ERROR'
    );
  }
  
  return error;
};

/**
 * Middleware de manejo de errores
 */
export const errorMiddleware = (err, req, res, next) => {
  const transformedError = transformDatabaseError(err);
  
  const statusCode = transformedError.statusCode || 500;
  const response = {
    error: {
      message: transformedError.message,
      code: transformedError.code || 'INTERNAL_ERROR',
      ...(transformedError.field && { field: transformedError.field }),
      ...(transformedError.dependencies && { dependencies: transformedError.dependencies })
    }
  };
  
  // Log del error completo en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.error('Error completo:', err);
    response.error.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
};
```

### 3. Componente de Validación en Tiempo Real

**Archivo: `posNew/frontend/src/shared/components/forms/ValidatedInput.jsx`**

```javascript
import React, { useState, useEffect } from 'react';
import { Input } from '../ui/Input';

export const ValidatedInput = ({ 
  name, 
  value, 
  onChange, 
  onBlur,
  schema, 
  label, 
  type = 'text',
  ...props 
}) => {
  const [error, setError] = useState('');
  const [touched, setTouched] = useState(false);
  
  useEffect(() => {
    if (touched && value !== undefined) {
      validateField();
    }
  }, [value, touched]);
  
  const validateField = () => {
    try {
      schema.parse({ [name]: value });
      setError('');
    } catch (err) {
      if (err.errors && err.errors[0]) {
        setError(err.errors[0].message);
      }
    }
  };
  
  const handleBlur = (e) => {
    setTouched(true);
    validateField();
    if (onBlur) onBlur(e);
  };
  
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      <Input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={handleBlur}
        className={error ? 'error' : ''}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};
```

## Modelos de Datos

### Mapeo de Campos Frontend ↔ Backend

| Sección | Campo Frontend | Campo Backend/DB | Tipo | Requerido | Default |
|---------|---------------|------------------|------|-----------|---------|
| **Impresoras** |
| | idEmpresa | id_empresa | number | Sí | - |
| | idSucursal | id_sucursal | number | Sí | - |
| | idCaja | id_caja | number | No | null |
| | name | name | string(255) | Sí | - |
| | tipo | tipo | enum | Sí | 'termica' |
| | puerto | puerto | string(50) | No | - |
| | pcName | pc_name | string(255) | No | - |
| | ipLocal | ip_local | string(45) | No | - |
| | state | state | boolean | No | true |
| | configuracion | configuracion | JSON | No | null |
| | activo | activo | boolean | No | true |
| **Métodos de Pago** |
| | idEmpresa | id_empresa | number | Sí | - |
| | codigo | codigo | string(10) | Sí | - |
| | nombre | nombre | string(100) | Sí | - |
| | descripcion | descripcion | text | No | - |
| | imagen | imagen | string(255) | No | - |
| | requiereReferencia | requiere_referencia | boolean | No | false |
| | activo | activo | boolean | No | true |
| **Tipos de Comprobantes** |
| | idEmpresa | id_empresa | number | Sí | - |
| | codigo | codigo | string(10) | Sí | - |
| | nombre | nombre | string(100) | Sí | - |
| | descripcion | descripcion | text | No | - |
| | destino | destino | enum | Sí | 'VENTA' |
| | activo | activo | boolean | No | true |
| **Serialización** |
| | idEmpresa | id_empresa | number | Sí | - |
| | idSucursal | id_sucursal | number | Sí | - |
| | idTipoComprobante | id_tipo_comprobante | number | Sí | - |
| | serie | serie | string(10) | Sí | - |
| | numeroInicial | numero_inicial | number | Sí | 1 |
| | numeroActual | numero_actual | number | Sí | 1 |
| | numeroFinal | numero_final | number | No | null |
| | cantidadNumeros | cantidad_numeros | number | No | 1000 |
| | porDefault | por_default | boolean | No | false |
| | activo | activo | boolean | No | true |
| **Usuarios** |
| | idEmpresa | id_empresa | number | Sí | - |
| | idRol | id_rol | number | Sí | - |
| | username | username | string(50) | Sí | - |
| | password | password | string(255) | Sí* | - |
| | nombres | nombres | string(100) | Sí | - |
| | apellidos | apellidos | string(100) | Sí | - |
| | email | email | string(100) | No | - |
| | telefono | telefono | string(20) | No | - |
| | idTipodocumento | id_tipodocumento | number | No | null |
| | nroDoc | nro_doc | string(20) | No | - |
| | tema | tema | enum | No | 'light' |
| | estado | estado | enum | No | 'ACTIVO' |
| | activo | activo | boolean | No | true |
| **Roles** |
| | idEmpresa | id_empresa | number | Sí | - |
| | nombre | nombre | string(50) | Sí | - |
| | descripcion | descripcion | text | No | - |
| | activo | activo | boolean | No | true |
| **Permisos** |
| | idEmpresa | id_empresa | number | Sí | - |
| | idRol | id_rol | number | Sí | - |
| | idModulo | id_modulo | number | Sí | - |
| | puedeVer | puede_ver | boolean | No | false |
| | puedeCrear | puede_crear | boolean | No | false |
| | puedeEditar | puede_editar | boolean | No | false |
| | puedeEliminar | puede_eliminar | boolean | No | false |
| **Categorías** |
| | idEmpresa | id_empresa | number | Sí | - |
| | codigo | codigo | string(20) | Sí | - |
| | nombre | nombre | string(100) | Sí | - |
| | descripcion | descripcion | text | No | - |
| | color | color | string(7) | No | '#007bff' |
| | icono | icono | string(50) | No | 'folder' |
| | activo | activo | boolean | No | true |

*Nota: password es requerido solo en creación, opcional en actualización

## Manejo de Errores

### Tipos de Errores y Respuestas

#### 1. Errores de Validación (400 Bad Request)

**Respuesta del Backend:**
```json
{
  "error": {
    "message": "El código no puede superar 10 caracteres",
    "code": "VALIDATION_ERROR",
    "field": "codigo"
  }
}
```

**Manejo en Frontend:**
```javascript
if (error.response?.data?.error?.field) {
  setFieldError(error.response.data.error.field, error.response.data.error.message);
} else {
  showToast(error.response.data.error.message, 'error');
}
```

#### 2. Errores de Unicidad (409 Conflict)

**Respuesta del Backend:**
```json
{
  "error": {
    "message": "El código 'MP01' ya existe para esta empresa",
    "code": "UNIQUE_CONSTRAINT",
    "field": "codigo"
  }
}
```

#### 3. Errores de Dependencia (409 Conflict)

**Respuesta del Backend:**
```json
{
  "error": {
    "message": "No se puede eliminar la categoría porque tiene 15 productos asociados",
    "code": "DEPENDENCY_ERROR",
    "resource": "categoria",
    "dependencies": {
      "productos": 15
    }
  }
}
```

#### 4. Errores de Red (Network Error)

**Manejo en Frontend:**
```javascript
if (error.code === 'ERR_NETWORK') {
  showToast('Error de conexión. Por favor, verifica tu conexión a internet.', 'error');
  setRetryAvailable(true);
}
```

#### 5. Errores No Autorizados (401/403)

**Respuesta del Backend:**
```json
{
  "error": {
    "message": "No tienes permisos para realizar esta acción",
    "code": "FORBIDDEN"
  }
}
```

## Estrategia de Testing

### 1. Tests de Validación de Schemas

**Archivo: `posNew/frontend/src/features/settings/schemas/__tests__/printer.schema.test.js`**

```javascript
import { describe, it, expect } from 'vitest';
import { printerSchema } from '../printer.schema';

describe('printerSchema', () => {
  it('debe validar datos correctos', () => {
    const validData = {
      idEmpresa: 1,
      idSucursal: 1,
      name: 'Impresora Principal',
      tipo: 'termica'
    };
    
    expect(() => printerSchema.parse(validData)).not.toThrow();
  });
  
  it('debe rechazar name vacío', () => {
    const invalidData = {
      idEmpresa: 1,
      idSucursal: 1,
      name: '',
      tipo: 'termica'
    };
    
    expect(() => printerSchema.parse(invalidData)).toThrow();
  });
  
  it('debe aplicar default a tipo', () => {
    const data = {
      idEmpresa: 1,
      idSucursal: 1,
      name: 'Impresora'
    };
    
    const result = printerSchema.parse(data);
    expect(result.tipo).toBe('termica');
  });
  
  it('debe validar formato de IP', () => {
    const invalidData = {
      idEmpresa: 1,
      idSucursal: 1,
      name: 'Impresora',
      ipLocal: '999.999.999.999'
    };
    
    expect(() => printerSchema.parse(invalidData)).toThrow();
  });
});
```

### 2. Tests de Transformación de Datos

**Archivo: `posNew/frontend/src/shared/utils/__tests__/fieldTransform.test.js`**

```javascript
import { describe, it, expect } from 'vitest';
import { toSnakeCase, toCamelCase } from '../fieldTransform';

describe('fieldTransform', () => {
  it('debe convertir camelCase a snake_case', () => {
    const input = {
      idEmpresa: 1,
      nombreCompleto: 'Juan Pérez',
      fechaNacimiento: '1990-01-01'
    };
    
    const expected = {
      id_empresa: 1,
      nombre_completo: 'Juan Pérez',
      fecha_nacimiento: '1990-01-01'
    };
    
    expect(toSnakeCase(input)).toEqual(expected);
  });
  
  it('debe convertir snake_case a camelCase', () => {
    const input = {
      id_empresa: 1,
      nombre_completo: 'Juan Pérez',
      fecha_nacimiento: '1990-01-01'
    };
    
    const expected = {
      idEmpresa: 1,
      nombreCompleto: 'Juan Pérez',
      fechaNacimiento: '1990-01-01'
    };
    
    expect(toCamelCase(input)).toEqual(expected);
  });
  
  it('debe manejar arrays', () => {
    const input = [
      { idEmpresa: 1 },
      { idEmpresa: 2 }
    ];
    
    const expected = [
      { id_empresa: 1 },
      { id_empresa: 2 }
    ];
    
    expect(toSnakeCase(input)).toEqual(expected);
  });
});
```

### 3. Tests de Integración API

**Archivo: `posNew/frontend/src/features/settings/api/__tests__/printers.api.test.js`**

```javascript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPrinter, updatePrinter } from '../printers.api';
import axios from 'axios';

vi.mock('axios');

describe('printers.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  
  it('debe crear impresora con transformación correcta', async () => {
    const printerData = {
      idEmpresa: 1,
      idSucursal: 1,
      name: 'Impresora Test',
      tipo: 'termica'
    };
    
    axios.post.mockResolvedValue({ data: { id: 1, ...printerData } });
    
    await createPrinter(printerData);
    
    expect(axios.post).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        id_empresa: 1,
        id_sucursal: 1,
        name: 'Impresora Test',
        tipo: 'termica'
      })
    );
  });
  
  it('debe manejar errores de validación', async () => {
    const error = {
      response: {
        data: {
          error: {
            message: 'El nombre es requerido',
            code: 'VALIDATION_ERROR',
            field: 'name'
          }
        }
      }
    };
    
    axios.post.mockRejectedValue(error);
    
    await expect(createPrinter({})).rejects.toThrow();
  });
});
```

## Diagrama de Flujo de Validación

```
┌─────────────────┐
│  Usuario llena  │
│   formulario    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validación     │
│  en tiempo real │
│  (onChange)     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Usuario envía  │
│   formulario    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validación Zod │
│   Frontend      │
└────────┬────────┘
         │
    ┌────┴────┐
    │ ¿Válido?│
    └────┬────┘
         │
    No   │   Sí
    ◄────┼────►
         │         │
         ▼         ▼
┌─────────────┐  ┌──────────────────┐
│  Mostrar    │  │  Transformar a   │
│  errores    │  │  snake_case      │
└─────────────┘  └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Enviar al       │
                 │  Backend         │
                 └────────┬─────────┘
                          │
                          ▼
                 ┌──────────────────┐
                 │  Validación DTO  │
                 │  Backend         │
                 └────────┬─────────┘
                          │
                     ┌────┴────┐
                     │ ¿Válido?│
                     └────┬────┘
                          │
                     No   │   Sí
                     ◄────┼────►
                          │         │
                          ▼         ▼
                 ┌──────────────┐  ┌──────────────────┐
                 │  Retornar    │  │  Validación      │
                 │  error 400   │  │  Business Logic  │
                 └──────────────┘  └────────┬─────────┘
                                            │
                                       ┌────┴────┐
                                       │ ¿Válido?│
                                       └────┬────┘
                                            │
                                       No   │   Sí
                                       ◄────┼────►
                                            │         │
                                            ▼         ▼
                                   ┌──────────────┐  ┌──────────────────┐
                                   │  Retornar    │  │  Ejecutar query  │
                                   │  error 409   │  │  SQL             │
                                   └──────────────┘  └────────┬─────────┘
                                                              │
                                                         ┌────┴────┐
                                                         │ ¿Éxito? │
                                                         └────┬────┘
                                                              │
                                                         No   │   Sí
                                                         ◄────┼────►
                                                              │         │
                                                              ▼         ▼
                                                     ┌──────────────┐  ┌──────────────────┐
                                                     │  Transformar │  │  Transformar a   │
                                                     │  error DB    │  │  camelCase       │
                                                     │  Retornar    │  │  Retornar 200/201│
                                                     └──────────────┘  └────────┬─────────┘
                                                                                │
                                                                                ▼
                                                                       ┌──────────────────┐
                                                                       │  Frontend recibe │
                                                                       │  Actualiza UI    │
                                                                       │  Muestra éxito   │
                                                                       └──────────────────┘
```

## Plan de Implementación por Prioridad

### Fase 1: Correcciones Críticas (Alta Prioridad)

1. **Actualizar todos los esquemas Zod del frontend**
   - Hacer campos required según DB
   - Agregar defaults correctos
   - Corregir límites de longitud
   - Agregar validaciones de formato

2. **Actualizar todos los DTOs del backend**
   - Usar nombres snake_case
   - Hacer campos required según DB
   - Agregar defaults correctos
   - Eliminar campos legacy innecesarios

3. **Implementar capa de transformación**
   - Crear utilidades toSnakeCase/toCamelCase
   - Integrar en todas las llamadas API
   - Agregar tests unitarios

4. **Mejorar manejo de errores**
   - Implementar clases de error personalizadas
   - Transformar errores de DB
   - Retornar errores estructurados
   - Mostrar errores específicos por campo en frontend

### Fase 2: Mejoras de Validación (Media Prioridad)

1. **Agregar validaciones de negocio**
   - Validar unicidad de códigos
   - Validar dependencias antes de eliminar
   - Validar rangos numéricos (serialización)
   - Validar formatos (email, IP, color hex)

2. **Implementar validación en tiempo real**
   - Crear componente ValidatedInput
   - Integrar en todos los formularios
   - Mostrar errores al perder foco
   - Limpiar errores al corregir

3. **Agregar validaciones de contraseña**
   - Validar fortaleza en frontend
   - Hashear en backend antes de guardar
   - Hacer opcional en actualización

### Fase 3: Funcionalidad Faltante (Media Prioridad)

1. **Completar gestión de permisos**
   - Crear schema de permisos en frontend
   - Implementar componente PermissionsMatrix
   - Crear endpoints de permisos en backend
   - Implementar guardado masivo de permisos

2. **Agregar campos faltantes**
   - Campo `activo` en todos los formularios
   - Campo `cantidadNumeros` en serialización
   - Campos `color` e `icono` en categorías (backend)
   - Campos de usuario completos

3. **Implementar validaciones de dependencias**
   - Verificar productos antes de eliminar categoría
   - Verificar ventas antes de eliminar tipo comprobante
   - Verificar usuarios antes de eliminar rol
   - Retornar conteos de dependencias

### Fase 4: Mejoras de UX (Baja Prioridad)

1. **Mejorar feedback visual**
   - Agregar skeleton loaders
   - Mostrar spinners en botones
   - Agregar animaciones de transición
   - Mejorar mensajes de éxito

2. **Agregar componentes especializados**
   - ColorPicker para categorías
   - IconPicker para categorías
   - JSONEditor para configuración de impresoras
   - PasswordStrengthMeter para usuarios

3. **Optimizar rendimiento**
   - Implementar debounce en búsquedas
   - Agregar paginación donde sea necesario
   - Implementar optimistic updates
   - Cachear datos con React Query

## Consideraciones de Seguridad

### 1. Validación de Entrada

- **Frontend**: Validación con Zod para prevenir envío de datos inválidos
- **Backend**: Validación con Zod en DTOs como segunda capa de defensa
- **Base de Datos**: Constraints y tipos de datos como última línea de defensa

### 2. Sanitización de Datos

```javascript
// Sanitizar strings antes de guardar
export const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(/[<>]/g, '');
};

// Sanitizar objetos recursivamente
export const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (typeof value === 'string') {
      acc[key] = sanitizeString(value);
    } else if (typeof value === 'object') {
      acc[key] = sanitizeObject(value);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
};
```

### 3. Protección contra Inyección SQL

- Usar prepared statements en todas las queries
- Validar tipos de datos antes de queries
- Nunca concatenar strings para formar queries

```javascript
// ❌ MAL - Vulnerable a SQL injection
const query = `SELECT * FROM usuarios WHERE username = '${username}'`;

// ✅ BIEN - Usa prepared statements
const query = 'SELECT * FROM usuarios WHERE username = ?';
const [rows] = await db.query(query, [username]);
```

### 4. Manejo de Contraseñas

```javascript
import bcrypt from 'bcrypt';

// Hashear contraseña antes de guardar
export const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verificar contraseña
export const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// En el servicio de usuarios
export const crearUsuario = async (data) => {
  if (data.password) {
    data.password = await hashPassword(data.password);
  }
  // ... resto del código
};
```

## Métricas de Éxito

### 1. Reducción de Errores

- **Objetivo**: Reducir errores de validación en 90%
- **Medición**: Logs de errores antes y después
- **Indicador**: Menos de 5 errores de validación por semana

### 2. Consistencia de Datos

- **Objetivo**: 100% de consistencia entre capas
- **Medición**: Tests automatizados de schemas
- **Indicador**: Todos los tests pasan

### 3. Experiencia de Usuario

- **Objetivo**: Mensajes de error claros en 100% de casos
- **Medición**: Revisión manual de todos los flujos
- **Indicador**: Usuario puede entender y corregir todos los errores

### 4. Tiempo de Desarrollo

- **Objetivo**: Reducir tiempo de debugging en 70%
- **Medición**: Tiempo promedio de resolución de bugs
- **Indicador**: Bugs resueltos en menos de 1 hora

## Conclusión

Este diseño proporciona una solución integral para resolver todas las inconsistencias identificadas en las secciones de configuración del sistema POS. La implementación se realizará en fases priorizadas, comenzando con las correcciones críticas que afectan la funcionalidad básica, seguidas de mejoras de validación y funcionalidad faltante, y finalmente optimizaciones de UX.

La clave del éxito será:
1. Mantener consistencia estricta entre todas las capas
2. Implementar validación robusta en múltiples niveles
3. Proporcionar mensajes de error claros y accionables
4. Agregar tests automatizados para prevenir regresiones
5. Documentar todos los cambios y patrones establecidos
