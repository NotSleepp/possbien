# Patrones de Código - Sistema POS

Este documento describe los patrones de código utilizados en el sistema POS para mantener consistencia y calidad en el desarrollo.

## Tabla de Contenidos

1. [Arquitectura General](#arquitectura-general)
2. [Patrón de Transformación de Datos](#patrón-de-transformación-de-datos)
3. [Patrón de Validación en Múltiples Capas](#patrón-de-validación-en-múltiples-capas)
4. [Patrón de Manejo de Errores](#patrón-de-manejo-de-errores)
5. [Patrón de Repositorio](#patrón-de-repositorio)
6. [Patrón de Componentes de UI](#patrón-de-componentes-de-ui)

---

## Arquitectura General

El sistema sigue una arquitectura de 3 capas con separación clara de responsabilidades:

```
Frontend (React)
    ↓
API Layer (Axios + Transformación)
    ↓
Backend (Express)
    ├── Controlador (HTTP)
    ├── Servicio (Lógica de Negocio)
    └── Repositorio (Acceso a Datos)
    ↓
Base de Datos (MySQL)
```

---

## Patrón de Transformación de Datos

### Problema
El frontend usa `camelCase` mientras que el backend y la base de datos usan `snake_case`, causando inconsistencias.

### Solución
Transformación bidireccional automática en la capa API.

### Implementación

**Utilidades de Transformación** (`posNew/frontend/src/shared/utils/fieldTransform.js`):

```javascript
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

**Uso en API Calls**:

```javascript
// posNew/frontend/src/features/settings/api/categories.api.js
import { toSnakeCase, toCamelCase } from '../../../shared/utils/fieldTransform';

export const createCategory = async (payload) => {
  try {
    // Transformar a snake_case antes de enviar
    const transformedPayload = toSnakeCase(payload);
    const { data } = await api.post('/categorias', transformedPayload);
    
    // Transformar respuesta a camelCase
    return toCamelCase(data);
  } catch (error) {
    throw handleApiError(error, 'createCategory');
  }
};
```

### Beneficios
- ✅ Consistencia automática entre capas
- ✅ Código más limpio sin conversiones manuales
- ✅ Menos errores por nombres de campos incorrectos

---

## Patrón de Validación en Múltiples Capas

### Problema
Validaciones inconsistentes o faltantes entre frontend y backend.

### Solución
Validación en 3 capas usando Zod:

1. **Frontend Schema** - Validación de UI
2. **Backend DTO** - Validación de entrada
3. **Base de Datos** - Constraints finales

### Implementación

**Frontend Schema** (`posNew/frontend/src/features/settings/schemas/category.schema.js`):

```javascript
import { z } from 'zod';

export const categorySchema = z.object({
  idEmpresa: z.number().int().positive('ID de empresa debe ser positivo'),
  codigo: z.string().min(1, 'El código es requerido').max(20, 'Máximo 20 caracteres'),
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'Máximo 100 caracteres'),
  descripcion: z.string().max(1000, 'Máximo 1000 caracteres').optional(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido')
    .default('#007bff'),
  icono: z.string().max(50).default('folder'),
  activo: z.boolean().default(true).optional()
});

export const validateCategory = (data) => {
  try {
    const validated = categorySchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    const errors = {};
    error.errors.forEach((err) => {
      const field = err.path[0];
      errors[field] = err.message;
    });
    return { success: false, errors };
  }
};
```

**Backend DTO** (`posNew/backend/src/api/categorias/dto.categorias.js`):

```javascript
import { z } from 'zod';

export const esquemaCrearCategoria = z.object({
  id_empresa: z.number().int().positive(),
  codigo: z.string().min(1).max(20),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#007bff'),
  icono: z.string().max(50).default('folder'),
  activo: z.boolean().default(true).optional()
});
```

**Uso en Servicio**:

```javascript
async function crearCategoria(datos, usuario = null) {
  // Validación con Zod
  const datosValidados = esquemaCrearCategoria.parse(datos);
  
  // Validación de negocio (unicidad)
  const existente = await repositorio.obtenerCategoriaPorCodigoYEmpresa(
    datosValidados.codigo, 
    datosValidados.idEmpresa
  );
  if (existente) {
    throw new UniqueConstraintError('código', datosValidados.codigo);
  }
  
  // Crear en base de datos
  return await repositorio.crearCategoria(datosValidados);
}
```

### Beneficios
- ✅ Validación temprana en el frontend (mejor UX)
- ✅ Validación robusta en el backend (seguridad)
- ✅ Mensajes de error claros y específicos
- ✅ Tipo de datos garantizado

---

## Patrón de Manejo de Errores

### Problema
Errores genéricos sin información útil para el usuario o desarrollador.

### Solución
Sistema de errores estructurado con clases personalizadas y transformación.

### Implementación

**Clases de Error Personalizadas** (`posNew/backend/src/shared/utils/errorHandler.js`):

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
```

**Transformación de Errores de BD**:

```javascript
export const transformDatabaseError = (error) => {
  // Error de clave duplicada
  if (error.code === 'ER_DUP_ENTRY') {
    const match = error.sqlMessage.match(/for key '(.+?)'/);
    const key = match ? match[1] : 'unknown';
    let field = key.split('_').pop();
    return new UniqueConstraintError(field, 'el valor proporcionado');
  }
  
  // Error de clave foránea
  if (error.code === 'ER_ROW_IS_REFERENCED_2') {
    return new DependencyError('el registro', ['registros relacionados']);
  }
  
  return error;
};
```

**Middleware de Errores**:

```javascript
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
  
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
  }
  
  res.status(statusCode).json(response);
};
```

**Manejo en Frontend** (`posNew/frontend/src/utils/errorHandler.js`):

```javascript
export function handleApiError(error, context = '', onError = null) {
  logError(error, context);
  
  if (onError && typeof onError === 'function') {
    onError(error);
  }
  
  return error;
}

export function getValidationErrors(error) {
  if (!isValidationError(error)) {
    return {};
  }

  const errors = {};
  
  if (error.data?.errors && Array.isArray(error.data.errors)) {
    error.data.errors.forEach((err) => {
      if (err.field && err.message) {
        errors[err.field] = err.message;
      }
    });
  }

  return errors;
}
```

### Uso Completo

**Backend - Servicio**:

```javascript
async function eliminarCategoria(id, usuario = null) {
  const categoria = await obtenerCategoriaPorId(id);
  
  // Verificar dependencias
  const productosCount = await repositorio.contarProductosPorCategoria(id);
  if (productosCount > 0) {
    throw new DependencyError('la categoría', { productos: productosCount });
  }
  
  return await repositorio.eliminarCategoria(id);
}
```

**Frontend - API Call**:

```javascript
export const deleteCategory = async (id) => {
  try {
    const { data } = await api.delete(`/categorias/${id}`);
    return data;
  } catch (error) {
    throw handleApiError(error, 'deleteCategory');
  }
};
```

**Frontend - Componente**:

```javascript
const deleteMut = useMutation({
  mutationFn: deleteCategory,
  onSuccess: () => {
    success('Categoría eliminada correctamente');
  },
  onError: (err) => {
    // err.userMessage contiene el mensaje amigable
    showError(err?.userMessage || 'Error al eliminar categoría');
  }
});
```

### Beneficios
- ✅ Errores específicos y accionables
- ✅ Mensajes amigables para usuarios
- ✅ Información detallada para desarrolladores
- ✅ Manejo consistente en toda la aplicación

---

## Patrón de Repositorio

### Problema
Lógica de acceso a datos mezclada con lógica de negocio.

### Solución
Capa de repositorio dedicada para todas las operaciones de base de datos.

### Estructura

```
src/api/[entidad]/
├── controlador.[entidad].js  # Maneja HTTP requests/responses
├── servicio.[entidad].js      # Lógica de negocio y validaciones
├── repositorio.[entidad].js   # Acceso a base de datos
└── dto.[entidad].js           # Validación de datos
```

### Implementación

**Repositorio** (`posNew/backend/src/api/categorias/repositorio.categorias.js`):

```javascript
import clienteBaseDeDatos from '../../config/baseDeDatos.js';

export async function obtenerTodasCategorias(idEmpresa) {
  return await clienteBaseDeDatos('categorias')
    .where({ id_empresa: idEmpresa, eliminado: false });
}

export async function obtenerCategoriaPorId(id) {
  return await clienteBaseDeDatos('categorias')
    .where({ id })
    .first();
}

export async function crearCategoria(datos) {
  const [id] = await clienteBaseDeDatos('categorias').insert(datos);
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

export async function actualizarCategoria(id, datos) {
  await clienteBaseDeDatos('categorias').where({ id }).update(datos);
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

export async function eliminarCategoria(id) {
  await clienteBaseDeDatos('categorias')
    .where({ id })
    .update({ eliminado: true, fecha_eliminacion: new Date() });
  return await clienteBaseDeDatos('categorias').where({ id }).first();
}

export async function obtenerCategoriaPorCodigoYEmpresa(codigo, idEmpresa) {
  return await clienteBaseDeDatos('categorias')
    .where({ codigo, id_empresa: idEmpresa, eliminado: false })
    .first();
}

export async function contarProductosPorCategoria(idCategoria) {
  const result = await clienteBaseDeDatos('productos')
    .where({ id_categoria: idCategoria, eliminado: false })
    .count('* as count')
    .first();
  return result?.count || 0;
}
```

**Servicio** (`posNew/backend/src/api/categorias/servicio.categorias.js`):

```javascript
import * as repositorio from './repositorio.categorias.js';
import { UniqueConstraintError, DependencyError } from '../../shared/utils/errorHandler.js';

async function crearCategoria(datos, usuario = null) {
  const datosValidados = esquemaCrearCategoria.parse(datos);
  
  // Validación de unicidad
  const existente = await repositorio.obtenerCategoriaPorCodigoYEmpresa(
    datosValidados.codigo, 
    datosValidados.idEmpresa
  );
  if (existente) {
    throw new UniqueConstraintError('código', datosValidados.codigo);
  }
  
  return await repositorio.crearCategoria(datosValidados);
}

async function eliminarCategoria(id, usuario = null) {
  const categoria = await repositorio.obtenerCategoriaPorId(id);
  if (!categoria) {
    throw new Error('Categoría no encontrada');
  }
  
  // Validación de dependencias
  const productosCount = await repositorio.contarProductosPorCategoria(id);
  if (productosCount > 0) {
    throw new DependencyError('la categoría', { productos: productosCount });
  }
  
  return await repositorio.eliminarCategoria(id);
}
```

### Beneficios
- ✅ Separación clara de responsabilidades
- ✅ Fácil de testear (mock del repositorio)
- ✅ Reutilización de queries
- ✅ Mantenimiento simplificado

---

## Patrón de Componentes de UI

### Problema
Componentes duplicados y inconsistentes en la UI.

### Solución
Componentes reutilizables con props estandarizadas.

### Componentes Principales

#### ConfigurationLayout

Wrapper para todas las páginas de configuración:

```javascript
<ConfigurationLayout
  title="Categorías"
  description="Gestiona las categorías de productos"
  actions={<Button onClick={handleCreate}>Nueva Categoría</Button>}
  breadcrumbs={[
    { label: 'Configuración', href: '/settings' },
    { label: 'Categorías' }
  ]}
>
  {/* Contenido */}
</ConfigurationLayout>
```

#### ConfigurationTable

Tabla genérica con acciones CRUD:

```javascript
<ConfigurationTable
  columns={columns}
  data={items}
  isLoading={isLoading}
  onEdit={handleEdit}
  onDelete={handleDelete}
  customActions={(item) => (
    <Button onClick={() => handleCustomAction(item)}>
      Acción Personalizada
    </Button>
  )}
  emptyMessage="No hay categorías registradas"
/>
```

#### ConfigurationForm

Formulario genérico con validación:

```javascript
<ConfigurationForm
  fields={formFields}
  values={form}
  onChange={handleChange}
  onSubmit={handleSubmit}
  isSubmitting={isSubmitting}
  errors={errors}
  onCancel={handleCancel}
/>
```

### Definición de Campos

```javascript
const formFields = [
  {
    name: 'codigo',
    label: 'Código',
    type: 'text',
    placeholder: 'CAT-001',
    required: true,
    hint: 'Código único de la categoría'
  },
  {
    name: 'nombre',
    label: 'Nombre',
    type: 'text',
    required: true
  },
  {
    name: 'activo',
    label: 'Categoría activa',
    type: 'checkbox',
    hint: 'Habilita o deshabilita esta categoría'
  }
];
```

### Beneficios
- ✅ Consistencia visual en toda la aplicación
- ✅ Menos código duplicado
- ✅ Mantenimiento centralizado
- ✅ Desarrollo más rápido

---

## Resumen de Mejores Prácticas

1. **Siempre transformar datos** entre camelCase y snake_case en la capa API
2. **Validar en múltiples capas** (Frontend, Backend, BD)
3. **Usar errores personalizados** con información específica
4. **Separar responsabilidades** (Controlador → Servicio → Repositorio)
5. **Reutilizar componentes** de UI para consistencia
6. **Documentar patrones** para facilitar el mantenimiento
7. **Testear validaciones** críticas de negocio

---

## Recursos Adicionales

- [Zod Documentation](https://zod.dev/)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Knex.js Documentation](https://knexjs.org/)
