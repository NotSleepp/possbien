# Sistema POS - Point of Sale

Sistema completo de punto de venta (POS) con arquitectura moderna, validaciones robustas y manejo de errores estructurado.

## 📋 Tabla de Contenidos

- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Validación y Manejo de Errores](#validación-y-manejo-de-errores)
- [Documentación](#documentación)
- [Estructura del Proyecto](#estructura-del-proyecto)

---

## ✨ Características

### Funcionalidades Principales

- 🔐 **Autenticación y Autorización**
  - Login con Google OAuth
  - Login tradicional con usuario/contraseña
  - Sistema de roles y permisos granulares
  - JWT para sesiones seguras

- 🏢 **Gestión Multi-Empresa**
  - Soporte para múltiples empresas
  - Sucursales y cajas por empresa
  - Aislamiento de datos por empresa

- 📦 **Gestión de Inventario**
  - Productos con categorías
  - Control de stock por almacén
  - Movimientos de inventario
  - Alertas de stock mínimo

- 💰 **Punto de Venta**
  - Ventas rápidas con interfaz intuitiva
  - Múltiples métodos de pago
  - Serialización de comprobantes
  - Impresión de tickets

- 📊 **Reportes y Análisis**
  - Dashboard con métricas clave
  - Reportes de ventas
  - Análisis de inventario
  - Auditoría de operaciones

### Características Técnicas

- ✅ **Validación en Múltiples Capas**
  - Frontend: Validación con Zod en tiempo real
  - Backend: Validación de DTOs con Zod
  - Base de Datos: Constraints y triggers

- ✅ **Manejo de Errores Estructurado**
  - Errores personalizados por tipo
  - Mensajes amigables para usuarios
  - Logging detallado para desarrolladores
  - Transformación automática de errores de BD

- ✅ **Transformación Automática de Datos**
  - camelCase en frontend
  - snake_case en backend/BD
  - Conversión transparente en capa API

- ✅ **Componentes Reutilizables**
  - UI consistente en toda la aplicación
  - Formularios genéricos con validación
  - Tablas con acciones CRUD
  - Layouts estandarizados

---

## 🏗️ Arquitectura

### Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Pages      │  │  Components  │  │    Store     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
│                    ┌──────▼──────┐                          │
│                    │  API Layer  │ (Transformación)         │
│                    └──────┬──────┘                          │
└───────────────────────────┼─────────────────────────────────┘
                            │ HTTP/JSON
┌───────────────────────────▼─────────────────────────────────┐
│                      Backend (Express)                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ Controlador  │→ │   Servicio   │→ │ Repositorio  │      │
│  │  (HTTP)      │  │  (Negocio)   │  │   (Datos)    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         │                  │                  │              │
│  ┌──────▼──────────────────▼──────────────────▼──────┐      │
│  │           Middleware (Auth, Errors, Logs)         │      │
│  └───────────────────────────┬───────────────────────┘      │
└────────────────────────────────┼────────────────────────────┘
                                 │
┌────────────────────────────────▼────────────────────────────┐
│                    Base de Datos (MySQL)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │    Tablas    │  │  Constraints │  │   Triggers   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Flujo de Datos

1. **Usuario → Frontend**: Interacción con UI
2. **Frontend → API Layer**: Transformación camelCase → snake_case
3. **API Layer → Backend**: Request HTTP con datos transformados
4. **Backend Controlador**: Recibe request, extrae datos
5. **Backend Servicio**: Valida con Zod, aplica lógica de negocio
6. **Backend Repositorio**: Ejecuta queries en BD
7. **BD → Backend**: Retorna datos
8. **Backend → API Layer**: Response con datos
9. **API Layer → Frontend**: Transformación snake_case → camelCase
10. **Frontend → Usuario**: Muestra datos en UI

---

## 🛠️ Tecnologías

### Frontend

- **React 18** - Librería de UI
- **Vite** - Build tool y dev server
- **React Router** - Enrutamiento
- **TanStack Query** - Gestión de estado del servidor
- **Zustand** - Gestión de estado global
- **Zod** - Validación de schemas
- **Axios** - Cliente HTTP
- **Tailwind CSS** - Estilos
- **Recharts** - Gráficos

### Backend

- **Node.js** - Runtime
- **Express** - Framework web
- **Knex.js** - Query builder
- **MySQL2** - Driver de MySQL
- **Zod** - Validación de schemas
- **Passport** - Autenticación
- **JWT** - Tokens de sesión
- **Bcrypt** - Hash de contraseñas
- **Winston** - Logging

### Base de Datos

- **MySQL 8.0** - Base de datos relacional
- **Knex Migrations** - Migraciones de esquema

---

## 📦 Instalación

### Prerrequisitos

- Node.js >= 18.0.0
- MySQL >= 8.0
- npm o yarn

### Clonar Repositorio

```bash
git clone <repository-url>
cd posNew
```

### Instalar Dependencias

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Configurar Base de Datos

```bash
cd backend

# Crear base de datos
node db/init.js create

# Ejecutar migraciones
node db/init.js reset

# Ver estado
node db/init.js status
```

---

## ⚙️ Configuración

### Variables de Entorno - Backend

Crear archivo `.env` en `backend/`:

```env
# Base de Datos
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=pos_db

# JWT
JWT_SECRET=tu_secret_key_muy_seguro

# Google OAuth
GOOGLE_CLIENT_ID=tu_client_id
GOOGLE_CLIENT_SECRET=tu_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Servidor
PORT=3000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

### Variables de Entorno - Frontend

Crear archivo `.env` en `frontend/`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=tu_client_id
```

### Iniciar Servidores

```bash
# Backend (puerto 3000)
cd backend
npm run dev

# Frontend (puerto 5173)
cd frontend
npm run dev
```

Acceder a: `http://localhost:5173`

---

## ✅ Validación y Manejo de Errores

### Sistema de Validación

El sistema implementa validación en 3 capas:

#### 1. Frontend (Validación de UI)

```javascript
// Schema con Zod
const categorySchema = z.object({
  codigo: z.string().min(1, 'El código es requerido').max(20),
  nombre: z.string().min(1, 'El nombre es requerido').max(100),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Color hexadecimal inválido')
});

// Validación en componente
const validation = validateCategory(formData);
if (!validation.success) {
  setErrors(validation.errors); // Muestra errores por campo
  return;
}
```

#### 2. Backend (Validación de Negocio)

```javascript
// DTO con Zod
const esquemaCrearCategoria = z.object({
  id_empresa: z.number().int().positive(),
  codigo: z.string().min(1).max(20),
  nombre: z.string().min(1).max(100)
});

// Validación en servicio
async function crearCategoria(datos) {
  // Validación de schema
  const datosValidados = esquemaCrearCategoria.parse(datos);
  
  // Validación de unicidad
  const existente = await repositorio.obtenerPorCodigo(datosValidados.codigo);
  if (existente) {
    throw new UniqueConstraintError('código', datosValidados.codigo);
  }
  
  // Crear
  return await repositorio.crear(datosValidados);
}
```

#### 3. Base de Datos (Constraints)

```sql
CREATE TABLE categorias (
  id INT PRIMARY KEY AUTO_INCREMENT,
  codigo VARCHAR(20) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  UNIQUE KEY unique_codigo_empresa (id_empresa, codigo)
);
```

### Tipos de Errores

El sistema maneja 4 tipos principales de errores:

#### ValidationError (400)
Datos inválidos o faltantes

```javascript
throw new ValidationError('El código es requerido', 'codigo');
```

#### UniqueConstraintError (409)
Violación de unicidad

```javascript
throw new UniqueConstraintError('código', 'CAT-001');
// Mensaje: "El valor 'CAT-001' ya existe para el campo código"
```

#### DependencyError (409)
No se puede eliminar por dependencias

```javascript
throw new DependencyError('la categoría', { productos: 15 });
// Mensaje: "No se puede eliminar la categoría porque tiene 15 productos"
```

#### AuthenticationError (401)
No autenticado o token inválido

```javascript
throw new AuthenticationError('Token inválido o expirado');
```

### Manejo de Errores en Frontend

```javascript
const deleteMut = useMutation({
  mutationFn: deleteCategory,
  onSuccess: () => {
    success('Categoría eliminada correctamente');
  },
  onError: (err) => {
    // err.userMessage contiene mensaje amigable
    // err.type contiene el tipo de error
    // err.data contiene detalles adicionales
    showError(err?.userMessage || 'Error al eliminar categoría');
  }
});
```

---

## 📚 Documentación

### Documentos Disponibles

- **[Patrones de Código](./docs/CODING_PATTERNS.md)** - Patrones y mejores prácticas
- **[Guía de Validación](./docs/VALIDATION_GUIDE.md)** - Cómo implementar validaciones
- **[Documentación de BD](./backend/db/DOCUMENTACION_BD.md)** - Esquema de base de datos

### Ejemplos de Uso

#### Crear un Nuevo Módulo de Configuración

1. **Crear Schema de Validación** (`frontend/src/features/settings/schemas/`)
2. **Crear DTO Backend** (`backend/src/api/[entidad]/dto.[entidad].js`)
3. **Crear Repositorio** (`backend/src/api/[entidad]/repositorio.[entidad].js`)
4. **Crear Servicio** (`backend/src/api/[entidad]/servicio.[entidad].js`)
5. **Crear Controlador** (`backend/src/api/[entidad]/controlador.[entidad].js`)
6. **Crear Rutas** (`backend/src/api/[entidad]/rutas.[entidad].js`)
7. **Crear API Calls** (`frontend/src/features/settings/api/[entidad].api.js`)
8. **Crear Página** (`frontend/src/pages/[Entidad]Page.jsx`)

Ver [CODING_PATTERNS.md](./docs/CODING_PATTERNS.md) para ejemplos detallados.

---

## 📁 Estructura del Proyecto

```
posNew/
├── backend/
│   ├── db/
│   │   ├── schema.sql              # Esquema de base de datos
│   │   ├── seeds.sql               # Datos iniciales
│   │   └── init.js                 # Script de inicialización
│   ├── src/
│   │   ├── api/                    # Módulos de API
│   │   │   ├── categorias/
│   │   │   │   ├── controlador.categorias.js
│   │   │   │   ├── servicio.categorias.js
│   │   │   │   ├── repositorio.categorias.js
│   │   │   │   ├── dto.categorias.js
│   │   │   │   └── rutas.categorias.js
│   │   │   └── .../
│   │   ├── config/                 # Configuración
│   │   ├── middlewares/            # Middlewares
│   │   ├── shared/                 # Utilidades compartidas
│   │   │   └── utils/
│   │   │       └── errorHandler.js # Manejo de errores
│   │   ├── app.js                  # Configuración de Express
│   │   └── server.js               # Punto de entrada
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Configuración de app
│   │   ├── features/               # Módulos por funcionalidad
│   │   │   └── settings/
│   │   │       ├── api/            # API calls
│   │   │       ├── components/     # Componentes
│   │   │       └── schemas/        # Schemas de validación
│   │   ├── pages/                  # Páginas
│   │   ├── shared/                 # Compartido
│   │   │   ├── components/         # Componentes reutilizables
│   │   │   ├── hooks/              # Hooks personalizados
│   │   │   └── utils/              # Utilidades
│   │   │       └── fieldTransform.js # Transformación de datos
│   │   ├── store/                  # Estado global
│   │   ├── utils/                  # Utilidades
│   │   │   └── errorHandler.js     # Manejo de errores
│   │   └── main.jsx                # Punto de entrada
│   └── package.json
│
└── docs/
    ├── CODING_PATTERNS.md          # Patrones de código
    └── VALIDATION_GUIDE.md         # Guía de validación
```

---

## 🧪 Testing

### Ejecutar Tests

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

### Cobertura de Tests

- ✅ Schemas de validación
- ✅ Transformación de datos
- ✅ Manejo de errores
- ✅ Repositorios
- ✅ Servicios

---

## 🚀 Despliegue

### Build de Producción

```bash
# Frontend
cd frontend
npm run build
# Genera carpeta dist/

# Backend
cd backend
# No requiere build, usar PM2 o similar
```

### Variables de Entorno de Producción

Asegúrate de configurar:
- `NODE_ENV=production`
- URLs de producción
- Credenciales seguras
- SSL/TLS habilitado

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### Guías de Estilo

- Seguir patrones establecidos en [CODING_PATTERNS.md](./docs/CODING_PATTERNS.md)
- Validar todos los inputs con Zod
- Manejar errores apropiadamente
- Escribir tests para funcionalidad crítica
- Documentar código complejo

---

## 📝 Licencia

Este proyecto es privado y confidencial.

---

## 👥 Equipo

Desarrollado con ❤️ por el equipo de desarrollo.

---

## 📞 Soporte

Para soporte o preguntas:
- Revisa la [documentación](./docs/)
- Abre un issue en el repositorio
- Contacta al equipo de desarrollo
