# Requirements Document

## Introduction

Este documento define los requisitos para mejorar el diseño del frontend del sistema POS y optimizar la integración de autenticación. El sistema actualmente permite autenticación mediante Google OAuth (para superusuarios/administradores) y mediante correo electrónico y contraseña (para usuarios creados por administradores). Se requiere mejorar la experiencia visual, la usabilidad y garantizar que el flujo de autenticación sea seguro, claro y funcional.

## Requirements

### Requirement 1: Rediseño de la Interfaz de Usuario del Sistema POS

**User Story:** Como usuario del sistema POS, quiero una interfaz moderna, intuitiva y profesional, para que pueda realizar mis tareas de manera eficiente y agradable.

#### Acceptance Criteria

1. WHEN el usuario accede a cualquier página del sistema THEN el sistema SHALL mostrar una interfaz consistente con un sistema de diseño coherente (colores, tipografía, espaciado)
2. WHEN el usuario navega por el dashboard THEN el sistema SHALL mostrar tarjetas de métricas con iconos representativos, gráficos visuales y datos actualizados
3. WHEN el usuario accede desde un dispositivo móvil THEN el sistema SHALL adaptar completamente la interfaz para una experiencia responsive óptima
4. WHEN el usuario interactúa con elementos de la interfaz THEN el sistema SHALL proporcionar feedback visual (hover, focus, loading states)
5. WHEN el usuario visualiza el sidebar THEN el sistema SHALL mostrar iconos junto a las opciones de navegación para mejor identificación visual
6. WHEN el usuario está en una página específica THEN el sistema SHALL resaltar claramente la opción activa en el menú de navegación

### Requirement 2: Mejora de la Página de Login

**User Story:** Como usuario, quiero una página de login clara y atractiva que me permita entender las diferentes opciones de autenticación, para que pueda acceder al sistema de manera apropiada según mi rol.

#### Acceptance Criteria

1. WHEN el usuario accede a la página de login THEN el sistema SHALL mostrar claramente dos opciones diferenciadas: login con Google (para administradores) y login con credenciales (para empleados)
2. WHEN el usuario intenta iniciar sesión THEN el sistema SHALL mostrar mensajes de error claros y específicos en caso de fallo
3. WHEN el usuario está en proceso de autenticación THEN el sistema SHALL mostrar un indicador de carga visual
4. WHEN el usuario visualiza el botón de Google THEN el sistema SHALL incluir el logo de Google y texto descriptivo que indique que es para administradores/superusuarios
5. WHEN el usuario ingresa credenciales inválidas THEN el sistema SHALL mostrar un mensaje de error sin revelar información sensible sobre qué campo es incorrecto

### Requirement 3: Validación y Mejora del Flujo de Autenticación con Google OAuth

**User Story:** Como administrador, quiero iniciar sesión con mi cuenta de Google de manera segura y fluida, para que pueda acceder rápidamente al sistema con privilegios administrativos.

#### Acceptance Criteria

1. WHEN el administrador hace clic en "Iniciar Sesión con Google" THEN el sistema SHALL redirigir correctamente a la página de autenticación de Google
2. WHEN Google retorna el token de autenticación THEN el sistema SHALL procesar el callback correctamente y almacenar el token de forma segura
3. WHEN el callback de OAuth es exitoso THEN el sistema SHALL obtener los datos del usuario mediante el endpoint `/auth/me` y almacenarlos en el estado global
4. WHEN ocurre un error en el proceso de OAuth THEN el sistema SHALL redirigir al usuario a la página de login con un mensaje de error apropiado
5. WHEN el token de OAuth expira THEN el sistema SHALL manejar la expiración y solicitar nueva autenticación
6. WHEN el usuario autenticado con Google cierra sesión THEN el sistema SHALL limpiar completamente el estado de autenticación y el token almacenado

### Requirement 4: Validación y Mejora del Flujo de Autenticación con Correo y Contraseña

**User Story:** Como empleado del sistema, quiero iniciar sesión con las credenciales que me proporcionó el administrador, para que pueda acceder al sistema con los permisos apropiados.

#### Acceptance Criteria

1. WHEN el empleado ingresa username y password THEN el sistema SHALL enviar las credenciales al endpoint `/usuarios/login` de forma segura
2. WHEN las credenciales son válidas THEN el sistema SHALL almacenar el token JWT y los datos del usuario en el estado global
3. WHEN las credenciales son inválidas THEN el sistema SHALL mostrar un mensaje de error claro sin revelar si el username o password es incorrecto
4. WHEN el token JWT expira THEN el sistema SHALL interceptar las peticiones fallidas y redirigir al login
5. WHEN el usuario cierra sesión THEN el sistema SHALL limpiar el token y datos del usuario del estado
6. IF el usuario intenta acceder a una ruta protegida sin autenticación THEN el sistema SHALL redirigir automáticamente a la página de login

### Requirement 5: Mejora de Componentes de Layout y Navegación

**User Story:** Como usuario del sistema, quiero una navegación clara y accesible en todas las páginas, para que pueda moverme fácilmente entre las diferentes secciones del sistema.

#### Acceptance Criteria

1. WHEN el usuario visualiza el sidebar THEN el sistema SHALL mostrar el logo/nombre de la empresa, opciones de navegación con iconos y la opción de cerrar sesión
2. WHEN el usuario está en dispositivo móvil THEN el sistema SHALL mostrar un botón de menú hamburguesa que abra/cierre el sidebar
3. WHEN el usuario hace clic en una opción del menú THEN el sistema SHALL navegar a la página correspondiente y actualizar el estado activo visualmente
4. WHEN el usuario cierra sesión desde el sidebar THEN el sistema SHALL limpiar la autenticación y redirigir al login
5. WHEN el sidebar está abierto en móvil THEN el sistema SHALL permitir cerrarlo mediante un botón de cierre o haciendo clic fuera del sidebar

### Requirement 6: Mejora de Páginas de Contenido (Dashboard, Products, Home)

**User Story:** Como usuario del sistema, quiero que las páginas de contenido sean informativas, organizadas y visualmente atractivas, para que pueda realizar mis tareas de manera eficiente.

#### Acceptance Criteria

1. WHEN el usuario accede al Dashboard THEN el sistema SHALL mostrar métricas clave con visualizaciones (gráficos, tarjetas de estadísticas) y datos relevantes del negocio
2. WHEN el usuario accede a la página de Products THEN el sistema SHALL mostrar una tabla o grid de productos con opciones de búsqueda, filtrado y acciones (editar, eliminar)
3. WHEN el usuario accede a la página Home THEN el sistema SHALL mostrar un resumen de bienvenida y accesos rápidos a funciones principales
4. WHEN el usuario interactúa con elementos de las páginas THEN el sistema SHALL proporcionar feedback visual apropiado (loading, success, error states)
5. WHEN las páginas cargan datos THEN el sistema SHALL mostrar skeletons o indicadores de carga mientras se obtiene la información

### Requirement 7: Gestión Segura de Tokens y Estado de Autenticación

**User Story:** Como desarrollador del sistema, quiero que los tokens de autenticación se gestionen de forma segura y persistente, para que los usuarios no pierdan su sesión al recargar la página y la seguridad esté garantizada.

#### Acceptance Criteria

1. WHEN el usuario inicia sesión exitosamente THEN el sistema SHALL almacenar el token en localStorage o sessionStorage de forma segura
2. WHEN el usuario recarga la página THEN el sistema SHALL recuperar el token almacenado y restaurar el estado de autenticación
3. WHEN el token es inválido o ha expirado THEN el sistema SHALL limpiar el almacenamiento y redirigir al login
4. WHEN se realizan peticiones HTTP THEN el sistema SHALL incluir automáticamente el token en el header Authorization
5. IF una petición retorna 401 (Unauthorized) THEN el sistema SHALL limpiar la sesión y redirigir al login
6. WHEN el usuario cierra sesión THEN el sistema SHALL eliminar el token del almacenamiento local

### Requirement 8: Diferenciación de Roles y Permisos en la UI

**User Story:** Como administrador, quiero que la interfaz muestre opciones diferentes según el rol del usuario autenticado, para que cada usuario solo vea las funcionalidades a las que tiene acceso.

#### Acceptance Criteria

1. WHEN un usuario con rol de administrador inicia sesión THEN el sistema SHALL mostrar opciones administrativas en el menú (gestión de usuarios, configuración)
2. WHEN un usuario con rol de empleado inicia sesión THEN el sistema SHALL ocultar opciones administrativas y mostrar solo funciones operativas
3. WHEN el sistema determina los permisos del usuario THEN el sistema SHALL basar la decisión en los datos del usuario almacenados en el estado de autenticación
4. IF un usuario intenta acceder a una ruta sin permisos THEN el sistema SHALL mostrar una página de "Acceso Denegado" o redirigir a una página permitida
5. WHEN el sidebar se renderiza THEN el sistema SHALL mostrar u ocultar opciones de menú basándose en el rol del usuario
