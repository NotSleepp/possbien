# Guía de Validación - Sistema POS

Esta guía explica cómo implementar validaciones en el sistema POS usando Zod y las mejores prácticas establecidas.

## Tabla de Contenidos

1. [Introducción a Zod](#introducción-a-zod)
2. [Crear Schemas de Validación](#crear-schemas-de-validación)
3. [Validaciones Personalizadas](#validaciones-personalizadas)
4. [Manejo de Errores de Validación](#manejo-de-errores-de-validación)
5. [Checklist de Validaciones Comunes](#checklist-de-validaciones-comunes)
6. [Ejemplos Completos](#ejemplos-completos)

---

## Introducción a Zod

Zod es una librería de validación y parsing de TypeScript-first que usamos tanto en frontend como backend.

### Ventajas de Zod

- ✅ Type-safe (inferencia de tipos automática)
- ✅ Mensajes de error personalizables
- ✅ Composición de schemas
- ✅ Validaciones síncronas y asíncronas
- ✅ Transformaciones de datos

### Instalación

```bash
npm install zod
```

---

## Crear Schemas de Validación

### Estructura Básica

```javascript
import { z } from 'zod';

// Schema simple
const userSchema = z.object({
  nombre: z.string(),
  edad: z.number(),
  email: z.string().email()
});

// Validar datos
const result = userSchema.safeParse(data);
if (result.success) {
  console.log(result.data); // Datos validados
} else {
  console.log(result.error); // Errores de validación
}
```

### Tipos de Datos Comunes

```javascript
// Strings
z.string()                          // String básico
z.string().min(3)                   // Mínimo 3 caracteres
z.string().max(100)                 // Máximo 100 caracteres
z.string().email()                  // Formato email
z.string().url()                    // Formato URL
z.string().regex(/^[A-Z]+$/)        // Regex personalizado
z.string().optional()               // Campo opcional
z.string().nullable()               // Puede ser null
z.string().default('valor')         // Valor por defecto

// Numbers
z.number()                          // Número básico
z.number().int()                    // Entero
z.number().positive()               // Positivo
z.number().min(0)                   // Mínimo 0
z.number().max(100)                 // Máximo 100

// Booleans
z.boolean()                         // Boolean básico
z.boolean().default(true)           // Con default

// Dates
z.date()                            // Fecha
z.date().min(new Date('2020-01-01')) // Fecha mínima

// Enums
z.enum(['VENTA', 'COMPRA', 'INTERNO'])

// Arrays
z.array(z.string())                 // Array de strings
z.array(z.number()).min(1)          // Array con mínimo 1 elemento

// Objects
z.object({
  campo1: z.string(),
  campo2: z.number()
})
```

### Schema para Frontend

**Ubicación**: `posNew/frontend/src/features/settings/schemas/[entidad].schema.js`

```javascript
import { z } from 'zod';

// Schema principal (camelCase)
export const categorySchema = z.object({
  idEmpresa: z.number()
    .int('Debe ser un número entero')
    .positive('ID de empresa debe ser positivo'),
  
  codigo: z.string()
    .min(1, 'El código es requerido')
    .max(20, 'El código no puede superar 20 caracteres'),
  
  nombre: z.string()
    .min(1, 'El nombre es requerido')
    .max(100, 'El nombre no puede superar 100 caracteres'),
  
  descripcion: z.string()
    .max(1000, 'La descripción no puede superar 1000 caracteres')
    .optional(),
  
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Debe ser un color hexadecimal válido')
    .default('#007bff'),
  
  icono: z.string()
    .max(50)
    .default('folder'),
  
  activo: z.boolean()
    .default(true)
    .optional()
});

// Función helper para validación
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

### Schema para Backend

**Ubicación**: `posNew/backend/src/api/[entidad]/dto.[entidad].js`

```javascript
import { z } from 'zod';

// Schema para crear (snake_case)
export const esquemaCrearCategoria = z.object({
  id_empresa: z.number().int().positive(),
  codigo: z.string().min(1).max(20),
  nombre: z.string().min(1).max(100),
  descripcion: z.string().max(1000).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default('#007bff'),
  icono: z.string().max(50).default('folder'),
  activo: z.boolean().default(true).optional()
});

// Schema para actualizar (campos opcionales excepto id)
export const esquemaActualizarCategoria = esquemaCrearCategoria
  .extend({
    id: z.number().int().positive()
  })
  .partial()
  .required({ id: true });
```

---

## Validaciones Personalizadas

### Validación con `.refine()`

```javascript
const serializationSchema = z.object({
  numeroInicial: z.number().int().positive(),
  numeroActual: z.number().int().positive(),
  numeroFinal: z.number().int().positive().nullable().optional()
}).refine(
  (data) => !data.numeroFinal || data.numeroActual <= data.numeroFinal,
  {
    message: 'El número actual no puede ser mayor al número final',
    path: ['numeroActual']
  }
).refine(
  (data) => data.numeroActual >= data.numeroInicial,
  {
    message: 'El número actual no puede ser menor al número inicial',
    path: ['numeroActual']
  }
);
```

### Validación con `.superRefine()`

Para validaciones más complejas:

```javascript
const userSchema = z.object({
  password: z.string(),
  confirmPassword: z.string()
}).superRefine((data, ctx) => {
  if (data.password !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Las contraseñas no coinciden',
      path: ['confirmPassword']
    });
  }
});
```

### Transformaciones

```javascript
const printerSchema = z.object({
  configuracion: z.string()
    .transform((val) => {
      if (!val || val === '') return null;
      try {
        return JSON.parse(val);
      } catch {
        return null;
      }
    })
});
```

---

## Manejo de Errores de Validación

### En el Frontend

```javascript
// En el componente
const handleSubmit = () => {
  const validation = validateCategory(form);
  
  if (!validation.success) {
    setErrors(validation.errors);
    showError('Por favor corrige los errores en el formulario');
    return;
  }
  
  // Continuar con el envío
  setErrors({});
  createMut.mutate(validation.data);
};
```

### En el Backend

```javascript
// En el servicio
async function crearCategoria(datos) {
  try {
    // Zod lanza error automáticamente si falla
    const datosValidados = esquemaCrearCategoria.parse(datos);
    
    // Continuar con la lógica
    return await repositorio.crearCategoria(datosValidados);
    
  } catch (error) {
    if (error.name === 'ZodError') {
      // Transformar error de Zod
      const firstError = error.errors[0];
      throw new ValidationError(
        firstError.message,
        firstError.path.join('.'),
        'VALIDATION_ERROR'
      );
    }
    throw error;
  }
}
```

### Mostrar Errores en UI

```javascript
// ConfigurationForm ya maneja esto automáticamente
<ConfigurationForm
  fields={formFields}
  values={form}
  onChange={handleChange}
  onSubmit={handleSubmit}
  errors={errors}  // { campo: 'mensaje de error' }
/>
```

---

## Checklist de Validaciones Comunes

### ✅ Validaciones de Campos

- [ ] **Campos requeridos**: Usar `.min(1)` para strings, sin `.optional()` para otros
- [ ] **Longitud máxima**: Coincidir con límites de BD (VARCHAR)
- [ ] **Formato de email**: Usar `.email()`
- [ ] **Formato de URL**: Usar `.url()`
- [ ] **Números positivos**: Usar `.positive()`
- [ ] **Números enteros**: Usar `.int()`
- [ ] **Rangos numéricos**: Usar `.min()` y `.max()`
- [ ] **Regex personalizados**: Para formatos específicos (IP, color hex, etc.)
- [ ] **Valores por defecto**: Usar `.default()` cuando aplique

### ✅ Validaciones de Negocio

- [ ] **Unicidad**: Verificar en el servicio antes de crear/actualizar
- [ ] **Dependencias**: Verificar antes de eliminar
- [ ] **Permisos**: Validar acceso del usuario
- [ ] **Relaciones**: Verificar que IDs foráneos existan
- [ ] **Rangos lógicos**: Validar que valores tengan sentido (ej: fecha inicio < fecha fin)

### ✅ Validaciones de Seguridad

- [ ] **Sanitización**: Limpiar inputs de caracteres peligrosos
- [ ] **Longitud máxima**: Prevenir ataques de buffer overflow
- [ ] **Formato estricto**: No permitir formatos inesperados
- [ ] **Whitelist**: Usar enums en lugar de strings libres cuando sea posible

---

## Ejemplos Completos

### Ejemplo 1: Validación de Usuario

```javascript
// Frontend Schema
export const userSchema = z.object({
  idEmpresa: z.number().int().positive(),
  idRol: z.number().int().positive(),
  
  username: z.string()
    .min(3, 'El username debe tener al menos 3 caracteres')
    .max(50, 'El username no puede superar 50 caracteres')
    .regex(/^[a-zA-Z0-9_]+$/, 'Solo letras, números y guión bajo'),
  
  password: z.string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .max(255)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe contener al menos una mayúscula, una minúscula y un número'
    ),
  
  nombres: z.string()
    .min(1, 'Los nombres son requeridos')
    .max(100),
  
  apellidos: z.string()
    .min(1, 'Los apellidos son requeridos')
    .max(100),
  
  email: z.string()
    .email('Email inválido')
    .max(100)
    .optional(),
  
  telefono: z.string()
    .max(20)
    .regex(/^[0-9+\-\s()]+$/, 'Formato de teléfono inválido')
    .optional(),
  
  tema: z.enum(['light', 'dark']).default('light'),
  estado: z.enum(['ACTIVO', 'INACTIVO']).default('ACTIVO'),
  activo: z.boolean().default(true).optional()
});

// Schema para crear (password requerido)
export const createUserSchema = userSchema;

// Schema para actualizar (password opcional)
export const updateUserSchema = userSchema.extend({
  password: z.string()
    .min(8)
    .max(255)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .optional()
});
```

### Ejemplo 2: Validación de Serialización con Rangos

```javascript
export const serializationSchema = z.object({
  idEmpresa: z.number().int().positive(),
  idSucursal: z.number().int().positive(),
  idTipoComprobante: z.number().int().positive(),
  
  serie: z.string()
    .min(1, 'La serie es requerida')
    .max(10)
    .regex(/^[A-Z0-9]+$/, 'Solo letras mayúsculas y números'),
  
  numeroInicial: z.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1),
  
  numeroActual: z.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .default(1),
  
  numeroFinal: z.number()
    .int('Debe ser un número entero')
    .positive('Debe ser mayor a 0')
    .nullable()
    .optional(),
  
  cantidadNumeros: z.number()
    .int()
    .positive()
    .default(1000),
  
  porDefault: z.boolean().default(false),
  activo: z.boolean().default(true).optional()
  
}).refine(
  (data) => !data.numeroFinal || data.numeroActual <= data.numeroFinal,
  {
    message: 'El número actual no puede ser mayor al número final',
    path: ['numeroActual']
  }
).refine(
  (data) => data.numeroActual >= data.numeroInicial,
  {
    message: 'El número actual no puede ser menor al número inicial',
    path: ['numeroActual']
  }
);
```

### Ejemplo 3: Validación con Dependencias en Backend

```javascript
// En el servicio
async function eliminarCategoria(id, usuario = null) {
  // 1. Verificar que existe
  const categoria = await repositorio.obtenerCategoriaPorId(id);
  if (!categoria) {
    throw new Error('Categoría no encontrada');
  }
  
  // 2. Validar permisos
  if (usuario) {
    const result = validarAccesoEmpresa(usuario, categoria.id_empresa);
    if (!result.esValido) {
      throw new Error(result.mensaje || 'Acceso no autorizado');
    }
  }
  
  // 3. Validar dependencias
  const productosCount = await repositorio.contarProductosPorCategoria(id);
  if (productosCount > 0) {
    throw new DependencyError('la categoría', { productos: productosCount });
  }
  
  // 4. Eliminar (soft delete)
  return await repositorio.eliminarCategoria(id);
}
```

---

## Mejores Prácticas

### ✅ DO (Hacer)

1. **Validar en múltiples capas** (Frontend + Backend)
2. **Usar mensajes descriptivos** que ayuden al usuario
3. **Coincidir límites con la BD** (VARCHAR, INT, etc.)
4. **Usar enums** en lugar de strings libres
5. **Validar unicidad** en el servicio antes de crear/actualizar
6. **Verificar dependencias** antes de eliminar
7. **Usar defaults** cuando tenga sentido
8. **Documentar validaciones complejas** con comentarios

### ❌ DON'T (No hacer)

1. **No confiar solo en validación de frontend** (puede ser bypasseada)
2. **No usar mensajes genéricos** como "Error de validación"
3. **No permitir valores inesperados** (usar enums y regex)
4. **No olvidar validar permisos** en operaciones sensibles
5. **No hacer hard delete** sin verificar dependencias
6. **No duplicar lógica** de validación (usar funciones compartidas)

---

## Testing de Validaciones

### Test de Schema

```javascript
import { describe, it, expect } from 'vitest';
import { categorySchema } from '../category.schema';

describe('categorySchema', () => {
  it('debe validar datos correctos', () => {
    const validData = {
      idEmpresa: 1,
      codigo: 'CAT-001',
      nombre: 'Electrónica',
      color: '#007bff'
    };
    
    expect(() => categorySchema.parse(validData)).not.toThrow();
  });
  
  it('debe rechazar código vacío', () => {
    const invalidData = {
      idEmpresa: 1,
      codigo: '',
      nombre: 'Electrónica'
    };
    
    expect(() => categorySchema.parse(invalidData))
      .toThrow('El código es requerido');
  });
  
  it('debe aplicar defaults correctamente', () => {
    const data = {
      idEmpresa: 1,
      codigo: 'CAT-001',
      nombre: 'Electrónica'
    };
    
    const result = categorySchema.parse(data);
    expect(result.color).toBe('#007bff');
    expect(result.icono).toBe('folder');
    expect(result.activo).toBe(true);
  });
});
```

---

## Recursos Adicionales

- [Zod Documentation](https://zod.dev/)
- [Zod Error Handling](https://zod.dev/ERROR_HANDLING)
- [Zod Transformations](https://zod.dev/TRANSFORMATIONS)
- [Regex101](https://regex101.com/) - Para testear expresiones regulares

---

## Soporte

Si tienes dudas sobre validaciones:
1. Revisa los ejemplos en este documento
2. Consulta schemas existentes en `src/features/settings/schemas/`
3. Revisa la documentación oficial de Zod
4. Pregunta al equipo de desarrollo
