# Plan de Implementación - Corrección de Secciones de Configuración

## Estructura de Tareas

Este plan está organizado en tareas incrementales que construyen sobre las anteriores. Cada tarea incluye referencias a los requerimientos del documento de requerimientos.

## Tareas

- [x] 1. Crear utilidades compartidas y componentes base

  - Implementar funciones de transformación de datos
  - Crear clases de error personalizadas
  - Implementar middleware de manejo de errores
  - Crear componente ValidatedInput
  - _Requerimientos: 8, 9, 11_

- [x] 1.1 Crear utilidades de transformación de datos


  - Crear archivo `posNew/frontend/src/shared/utils/fieldTransform.js`
  - Implementar función `toSnakeCase` para convertir camelCase a snake_case
  - Implementar función `toCamelCase` para convertir snake_case a camelCase
  - Manejar arrays y objetos anidados
  - _Requerimientos: 9_

- [x] 1.2 Escribir tests para transformación de datos


  - Crear archivo `posNew/frontend/src/shared/utils/__tests__/fieldTransform.test.js`
  - Test para conversión camelCase a snake_case
  - Test para conversión snake_case a camelCase
  - Test para manejo de arrays
  - Test para objetos anidados
  - _Requerimientos: 9_

- [x] 1.3 Crear clases de error personalizadas en backend


  - Crear archivo `posNew/backend/src/shared/utils/errorHandler.js`
  - Implementar clase `ValidationError`
  - Implementar clase `UniqueConstraintError`
  - Implementar clase `DependencyError`
  - Implementar función `transformDatabaseError`
  - Implementar middleware `errorMiddleware`
  - _Requerimientos: 8_

- [x] 1.4 Integrar middleware de errores en backend


  - Importar `errorMiddleware` en `posNew/backend/src/app.js`
  - Agregar middleware al final de la cadena de middlewares
  - Verificar que todos los controladores usen `next(error)` para errores
  - _Requerimientos: 8_

- [x] 1.5 Crear componente ValidatedInput


  - Crear archivo `posNew/frontend/src/shared/components/forms/ValidatedInput.jsx`
  - Implementar validación en tiempo real con Zod
  - Mostrar errores después de perder foco
  - Limpiar errores cuando el campo se vuelve válido
  - _Requerimientos: 11_

- [x] 2. Corregir esquemas y DTOs de Impresoras

  - Actualizar schema Zod del frontend
  - Actualizar DTO del backend
  - Actualizar API calls para usar transformación
  - Actualizar repositorio para manejar campos correctos
  - _Requerimientos: 1, 9_

- [x] 2.1 Actualizar schema Zod de impresoras en frontend


  - Editar `posNew/frontend/src/features/settings/schemas/printer.schema.js`
  - Hacer `tipo` required con default 'termica'
  - Hacer `state` con default true
  - Cambiar `configuracion` de string a object/JSON
  - Agregar validación de IP para `ipLocal`
  - Agregar campo `activo` con default true
  - _Requerimientos: 1, 9_

- [x] 2.2 Actualizar DTO de impresoras en backend



  - Editar `posNew/backend/src/api/impresoras/dto.impresoras.js`
  - Cambiar nombres de campos a snake_case (pc_name, ip_local)
  - Eliminar campo legacy `nombre`
  - Cambiar `configuracion` de `any` a `record` o `object`
  - Agregar campo `activo` con default true
  - _Requerimientos: 1, 9_

- [x] 2.3 Actualizar API calls de impresoras


  - Editar `posNew/frontend/src/features/settings/api/printers.api.js`
  - Importar funciones `toSnakeCase` y `toCamelCase`
  - Transformar datos a snake_case antes de enviar al backend
  - Transformar respuestas a camelCase al recibir del backend
  - _Requerimientos: 1, 9_

- [x] 2.4 Actualizar repositorio de impresoras


  - Editar `posNew/backend/src/api/impresoras/repositorio.impresoras.js`
  - Verificar que todos los campos usen nombres snake_case en queries SQL
  - Asegurar que `configuracion` se maneje como JSON
  - Agregar manejo de campo `activo`
  - _Requerimientos: 1, 9_

- [x] 2.5 Escribir tests para impresoras


  - Crear tests de schema en frontend
  - Crear tests de API calls con transformación
  - Verificar validación de IP
  - Verificar defaults aplicados correctamente
  - _Requerimientos: 1_

- [x] 3. Corregir esquemas y DTOs de Métodos de Pago

  - Actualizar schema Zod del frontend
  - Actualizar DTO del backend
  - Actualizar API calls para usar transformación
  - Actualizar repositorio para manejar campos correctos
  - _Requerimientos: 2, 9_

- [x] 3.1 Actualizar schema Zod de métodos de pago en frontend


  - Editar `posNew/frontend/src/features/settings/schemas/paymentMethod.schema.js`
  - Hacer `codigo` required con max 10 caracteres
  - Hacer `nombre` required con max 100 caracteres
  - Ajustar `descripcion` a max 1000 caracteres
  - Ajustar `imagen` a max 255 caracteres
  - Agregar campo `activo` con default true
  - _Requerimientos: 2, 9_

- [x] 3.2 Actualizar DTO de métodos de pago en backend


  - Editar `posNew/backend/src/api/metodos_pago/dto.metodos_pago.js`
  - Cambiar nombres a snake_case (requiere_referencia)
  - Hacer `codigo` y `nombre` required
  - Ajustar límites de longitud según DB
  - _Requerimientos: 2, 9_

- [x] 3.3 Actualizar API calls de métodos de pago


  - Editar `posNew/frontend/src/features/settings/api/paymentMethods.api.js`
  - Aplicar transformación toSnakeCase/toCamelCase
  - Manejar errores de unicidad de código
  - _Requerimientos: 2, 9_

- [x] 3.4 Agregar validación de unicidad en backend



  - Editar `posNew/backend/src/api/metodos_pago/servicio.metodos_pago.js`
  - Verificar unicidad de `codigo` por `id_empresa` antes de crear
  - Lanzar `UniqueConstraintError` si existe duplicado
  - _Requerimientos: 2, 8_

- [x] 3.5 Escribir tests para métodos de pago


  - Tests de validación de schema
  - Tests de unicidad de código
  - Tests de transformación de datos
  - _Requerimientos: 2_

- [x] 4. Corregir esquemas y DTOs de Tipos de Comprobantes


  - Actualizar schema Zod del frontend
  - Actualizar DTO del backend
  - Actualizar API calls para usar transformación
  - Implementar validación de dependencias
  - _Requerimientos: 3, 9_

- [x] 4.1 Actualizar schema Zod de tipos de comprobantes en frontend


  - Editar `posNew/frontend/src/features/settings/schemas/documentType.schema.js`
  - Hacer `codigo` required con max 10 caracteres
  - Hacer `nombre` required con max 100 caracteres
  - Agregar default 'VENTA' a `destino`
  - Agregar campo `activo` con default true
  - _Requerimientos: 3, 9_

- [x] 4.2 Actualizar DTO de tipos de comprobantes en backend


  - Editar `posNew/backend/src/api/tipos_comprobante/dto.tipos_comprobante.js`
  - Hacer `codigo` y `nombre` required
  - Ajustar límites según DB
  - _Requerimientos: 3, 9_

- [x] 4.3 Actualizar API calls de tipos de comprobantes


  - Editar `posNew/frontend/src/features/settings/api/documentTypes.api.js`
  - Aplicar transformación de datos
  - Manejar errores de dependencias al eliminar
  - _Requerimientos: 3, 9_

- [x] 4.4 Implementar validación de dependencias antes de eliminar


  - Editar `posNew/backend/src/api/tipos_comprobante/servicio.tipos_comprobante.js`
  - Verificar si hay ventas asociadas antes de eliminar
  - Contar número de ventas que usan el tipo de comprobante
  - Lanzar `DependencyError` con conteo si hay dependencias
  - _Requerimientos: 3, 8_

- [x] 4.5 Escribir tests para tipos de comprobantes


  - Tests de validación de schema
  - Tests de validación de dependencias
  - Tests de filtrado por destino
  - _Requerimientos: 3_

- [x] 5. Corregir esquemas y DTOs de Serialización


  - Actualizar schema Zod del frontend
  - Actualizar DTO del backend
  - Agregar validaciones de rangos numéricos
  - Implementar validación de serie única
  - _Requerimientos: 4, 9_

- [x] 5.1 Actualizar schema Zod de serialización en frontend


  - Editar `posNew/frontend/src/features/settings/schemas/serialization.schema.js`
  - Hacer `serie` required
  - Agregar defaults a `numeroInicial` y `numeroActual` (1)
  - Agregar campo `cantidadNumeros` con default 1000
  - Agregar campo `activo` con default true
  - Agregar validación: `numeroActual` entre `numeroInicial` y `numeroFinal`
  - _Requerimientos: 4, 9_

- [x] 5.2 Actualizar DTO de serialización en backend



  - Editar `posNew/backend/src/api/serializaciones_comprobante/dto.serializaciones_comprobante.js`
  - Cambiar nombres a snake_case
  - Hacer `serie` required
  - Ajustar defaults según DB
  - _Requerimientos: 4, 9_

- [x] 5.3 Actualizar API calls de serialización



  - Editar `posNew/frontend/src/features/settings/api/serialization.api.js`
  - Aplicar transformación de datos
  - Manejar errores de unicidad de serie
  - _Requerimientos: 4, 9_

- [x] 5.4 Implementar validación de serie única por sucursal y tipo


  - Editar `posNew/backend/src/api/serializaciones_comprobante/servicio.serializaciones_comprobante.js`
  - Verificar unicidad de combinación (id_sucursal, id_tipo_comprobante, serie)
  - Lanzar `UniqueConstraintError` si existe duplicado
  - _Requerimientos: 4, 8_

- [x] 5.5 Implementar validación de serie predeterminada única

  - En el mismo servicio de serialización
  - Si `por_default` es true, verificar que no haya otra serie default para la misma sucursal y tipo
  - Si existe, actualizar la anterior a false antes de crear/actualizar la nueva
  - _Requerimientos: 4_

- [x] 5.6 Agregar advertencia cuando número actual se acerca al final

  - En frontend, calcular porcentaje usado
  - Si está por encima del 90%, mostrar badge de advertencia
  - Mostrar mensaje sugiriendo crear nueva serie
  - _Requerimientos: 4_

- [x] 5.7 Escribir tests para serialización

  - Tests de validación de rangos
  - Tests de unicidad de serie
  - Tests de serie predeterminada única
  - _Requerimientos: 4_

- [x] 6. Corregir esquemas y DTOs de Usuarios

  - Actualizar schema Zod del frontend
  - Actualizar DTO del backend
  - Unificar nombres de campos
  - Implementar validación de contraseña
  - _Requerimientos: 5, 9_

- [x] 6.1 Actualizar schema Zod de usuarios en frontend


  - Editar `posNew/frontend/src/features/settings/schemas/user.schema.js`
  - Hacer `username`, `nombres`, `apellidos` required
  - Ajustar límite de `password` a 255 caracteres
  - Agregar validación de fortaleza de contraseña (regex)
  - Agregar validación de formato email
  - Agregar defaults a `tema` ('light') y `estado` ('ACTIVO')
  - Agregar campo `activo` con default true
  - Crear `createUserSchema` con password required
  - Crear `updateUserSchema` con password optional
  - _Requerimientos: 5, 9_

- [x] 6.2 Actualizar DTO de usuarios en backend



  - Editar `posNew/backend/src/api/usuarios/dto.usuarios.js`
  - Cambiar nombres de campos a snake_case consistente
  - Usar `username` en lugar de `nombreUsuario`
  - Usar `password` en lugar de `contrasena`
  - Usar `email` en lugar de `correo`
  - Agregar campos faltantes: `id_tipodocumento`, `nro_doc`, `tema`, `estado`, `activo`
  - Hacer campos required según DB
  - _Requerimientos: 5, 9_

- [x] 6.3 Implementar hasheo de contraseñas


  - Editar `posNew/backend/src/api/usuarios/servicio.usuarios.js`
  - Importar bcrypt
  - Crear función `hashPassword`
  - Hashear contraseña antes de crear usuario
  - Hashear contraseña antes de actualizar (solo si se proporciona)
  - _Requerimientos: 5_

- [x] 6.4 Actualizar API calls de usuarios

  - Editar `posNew/frontend/src/features/settings/api/users.api.js`
  - Aplicar transformación de datos
  - Manejar errores de unicidad de username y email
  - Diferenciar entre crear (password required) y actualizar (password optional)
  - _Requerimientos: 5, 9_

- [x] 6.5 Implementar validación de unicidad de username

  - Editar servicio de usuarios en backend
  - Verificar que username no exista antes de crear
  - Verificar que username no exista en otros usuarios al actualizar
  - Lanzar `UniqueConstraintError` específico para username
  - _Requerimientos: 5, 8_

- [x] 6.6 Implementar validación de unicidad de email

  - En el mismo servicio de usuarios
  - Verificar que email no exista si se proporciona
  - Lanzar `UniqueConstraintError` específico para email
  - _Requerimientos: 5, 8_

- [x] 6.7 Escribir tests para usuarios

  - Tests de validación de contraseña
  - Tests de unicidad de username y email
  - Tests de hasheo de contraseña
  - Tests de actualización sin cambiar contraseña
  - _Requerimientos: 5_

- [x] 7. Corregir esquemas y DTOs de Roles

  - Actualizar schema Zod del frontend
  - Actualizar DTO del backend
  - Eliminar campo inexistente
  - Implementar validación de dependencias
  - _Requerimientos: 6, 9_

- [x] 7.1 Actualizar schema Zod de roles en frontend


  - Editar `posNew/frontend/src/features/settings/schemas/role.schema.js`
  - Hacer `nombre` required
  - Ajustar límite de `descripcion` a 1000 caracteres
  - Agregar campo `activo` con default true
  - _Requerimientos: 6, 9_

- [x] 7.2 Actualizar DTO de roles en backend


  - Editar `posNew/backend/src/api/roles/dto.roles.js`
  - Eliminar campo `codigo` que no existe en DB
  - Hacer `nombre` required
  - Cambiar nombres a snake_case
  - _Requerimientos: 6, 9_

- [x] 7.3 Actualizar API calls de roles

  - Editar `posNew/frontend/src/features/settings/api/roles.api.js`
  - Aplicar transformación de datos
  - Manejar errores de dependencias al eliminar
  - _Requerimientos: 6, 9_

- [x] 7.4 Implementar validación de usuarios asignados antes de eliminar

  - Editar `posNew/backend/src/api/roles/servicio.roles.js`
  - Contar usuarios con el rol antes de eliminar
  - Si hay usuarios, lanzar `DependencyError` con lista de usuarios
  - _Requerimientos: 6, 8_

- [x] 7.5 Agregar conteo de usuarios por rol en listado

  - Modificar query de listado de roles
  - Agregar LEFT JOIN con tabla usuarios
  - Agregar COUNT de usuarios por rol
  - Retornar conteo en respuesta
  - _Requerimientos: 6_

- [x] 7.6 Escribir tests para roles

  - Tests de validación de schema
  - Tests de validación de dependencias
  - Tests de conteo de usuarios
  - _Requerimientos: 6_

- [ ] 8. Implementar gestión completa de Permisos
  - Crear schema Zod de permisos en frontend
  - Crear DTO de permisos en backend
  - Crear endpoints de permisos
  - Implementar componente PermissionsMatrix
  - _Requerimientos: 6, 9_

- [x] 8.1 Crear schema Zod de permisos en frontend


  - Crear archivo `posNew/frontend/src/features/settings/schemas/permission.schema.js`
  - Crear `permissionSchema` con campos: idEmpresa, idRol, idModulo, puedeVer, puedeCrear, puedeEditar, puedeEliminar
  - Crear `permissionsMatrixSchema` para guardar múltiples permisos
  - Todos los campos boolean con default false
  - _Requerimientos: 6, 9_

- [x] 8.2 Crear DTO de permisos en backend


  - Crear archivo `posNew/backend/src/api/permisos/dto.permisos.js` (si no existe)
  - Crear `esquemaCrearPermiso` con campos snake_case
  - Crear `esquemaActualizarPermisos` para actualización masiva
  - _Requerimientos: 6, 9_

- [x] 8.3 Crear/actualizar endpoints de permisos


  - Editar `posNew/backend/src/api/permisos/controlador.permisos.js`
  - Crear endpoint GET `/api/permisos/por-rol/:idRol` para obtener permisos de un rol
  - Crear endpoint POST `/api/permisos/actualizar-masivo` para guardar matriz completa
  - Crear endpoint GET `/api/modulos` para obtener todos los módulos
  - _Requerimientos: 6_

- [x] 8.4 Implementar servicio de permisos



  - Editar `posNew/backend/src/api/permisos/servicio.permisos.js`
  - Implementar `obtenerPermisosPorRol` que retorna todos los permisos del rol
  - Implementar `actualizarPermisosMasivo` que:
    - Elimina permisos existentes del rol
    - Inserta nuevos permisos en una transacción
    - Maneja constraint único (id_rol, id_modulo)
  - _Requerimientos: 6_

- [ ] 8.5 Crear componente PermissionsMatrix
  - Crear archivo `posNew/frontend/src/features/settings/components/PermissionsMatrix.jsx`
  - Mostrar tabla con módulos en filas y permisos en columnas
  - Agregar checkboxes para cada permiso
  - Implementar selección por fila (todos los permisos de un módulo)
  - Implementar selección por columna (un permiso para todos los módulos)
  - Cargar permisos existentes al montar
  - _Requerimientos: 6_

- [ ] 8.6 Integrar PermissionsMatrix en página de roles
  - Editar `posNew/frontend/src/pages/RolesPage.jsx`
  - Agregar botón "Editar Permisos" en cada fila de roles
  - Abrir modal con PermissionsMatrix al hacer clic
  - Guardar permisos al confirmar modal
  - Mostrar mensaje de éxito/error
  - _Requerimientos: 6_

- [ ] 8.7 Escribir tests para permisos
  - Tests de schema de permisos
  - Tests de actualización masiva
  - Tests de componente PermissionsMatrix
  - _Requerimientos: 6_

- [x] 9. Corregir esquemas y DTOs de Categorías

  - Actualizar schema Zod del frontend
  - Actualizar DTO del backend
  - Agregar campos faltantes
  - Implementar validación de dependencias
  - _Requerimientos: 7, 9_

- [x] 9.1 Actualizar schema Zod de categorías en frontend


  - Editar `posNew/frontend/src/features/settings/schemas/category.schema.js`
  - Hacer `codigo` y `nombre` required
  - Agregar validación regex para `color` (formato hexadecimal)
  - Agregar defaults: color '#007bff', icono 'folder'
  - Agregar campo `activo` con default true
  - _Requerimientos: 7, 9_

- [x] 9.2 Actualizar DTO de categorías en backend


  - Editar `posNew/backend/src/api/categorias/dto.categorias.js`
  - Hacer `codigo` y `nombre` required
  - Agregar campos `color` e `icono` con defaults
  - Agregar validación de formato hexadecimal para color
  - _Requerimientos: 7, 9_

- [x] 9.3 Actualizar API calls de categorías

  - Editar `posNew/frontend/src/features/settings/api/categories.api.js`
  - Aplicar transformación de datos
  - Manejar errores de dependencias al eliminar
  - _Requerimientos: 7, 9_

- [x] 9.4 Implementar validación de productos antes de eliminar

  - Editar `posNew/backend/src/api/categorias/servicio.categorias.js`
  - Contar productos en la categoría antes de eliminar
  - Si hay productos, lanzar `DependencyError` con conteo
  - _Requerimientos: 7, 8_

- [x] 9.5 Agregar componente ColorPicker

  - Crear archivo `posNew/frontend/src/shared/components/forms/ColorPicker.jsx`
  - Usar input type="color" nativo
  - Mostrar preview del color seleccionado
  - Validar formato hexadecimal
  - _Requerimientos: 7_

- [x] 9.6 Integrar ColorPicker en formulario de categorías

  - Editar `posNew/frontend/src/pages/CategoriesPage.jsx`
  - Reemplazar input de texto por ColorPicker para campo color
  - Mostrar color actual en la tabla con badge de color
  - _Requerimientos: 7_

- [x] 9.7 Escribir tests para categorías

  - Tests de validación de color hexadecimal
  - Tests de validación de dependencias
  - Tests de ColorPicker
  - _Requerimientos: 7_

- [ ] 10. Mejorar manejo de errores en frontend
  - Crear utilidad de manejo de errores
  - Integrar en todas las API calls
  - Mostrar errores específicos por campo
  - Agregar mensajes de error amigables
  - _Requerimientos: 8, 11_

- [x] 10.1 Crear utilidad de manejo de errores en frontend

  - Crear archivo `posNew/frontend/src/shared/utils/errorHandler.js`
  - Crear función `handleApiError` que procesa errores de axios
  - Identificar tipo de error (validación, unicidad, dependencia, red)
  - Retornar objeto estructurado con errores por campo
  - _Requerimientos: 8_

- [x] 10.2 Crear hook useFormErrors

  - Crear archivo `posNew/frontend/src/shared/hooks/useFormErrors.js`
  - Implementar estado de errores por campo
  - Implementar función `setFieldError`
  - Implementar función `clearFieldError`
  - Implementar función `clearAllErrors`
  - Implementar función `setApiErrors` que procesa errores del backend
  - _Requerimientos: 8, 11_

- [x] 10.3 Integrar manejo de errores en API calls de impresoras

  - Editar `posNew/frontend/src/features/settings/api/printers.api.js`
  - Usar `handleApiError` en bloques catch
  - Lanzar errores estructurados
  - _Requerimientos: 8_


- [ ] 10.4 Integrar manejo de errores en API calls de métodos de pago
  - Editar `posNew/frontend/src/features/settings/api/paymentMethods.api.js`
  - Aplicar mismo patrón de manejo de errores
  - _Requerimientos: 8_

- [x] 10.5 Integrar manejo de errores en API calls de tipos de comprobantes

  - Editar `posNew/frontend/src/features/settings/api/documentTypes.api.js`
  - Aplicar mismo patrón de manejo de errores
  - _Requerimientos: 8_

- [x] 10.6 Integrar manejo de errores en API calls de serialización

  - Editar `posNew/frontend/src/features/settings/api/serialization.api.js`
  - Aplicar mismo patrón de manejo de errores
  - _Requerimientos: 8_

- [x] 10.7 Integrar manejo de errores en API calls de usuarios

  - Editar `posNew/frontend/src/features/settings/api/users.api.js`
  - Aplicar mismo patrón de manejo de errores
  - _Requerimientos: 8_

- [x] 10.8 Integrar manejo de errores en API calls de roles

  - Editar `posNew/frontend/src/features/settings/api/roles.api.js`
  - Aplicar mismo patrón de manejo de errores
  - _Requerimientos: 8_


- [x] 10.9 Integrar manejo de errores en API calls de categorías

  - Editar `posNew/frontend/src/features/settings/api/categories.api.js`
  - Aplicar mismo patrón de manejo de errores
  - _Requerimientos: 8_

- [ ] 11. Actualizar todas las páginas para usar ValidatedInput y manejo de errores
  - Actualizar PrintersPage
  - Actualizar PaymentMethodsPage
  - Actualizar DocumentTypesPage
  - Actualizar SerializationPage
  - Actualizar UsersSettingsPage
  - Actualizar RolesPage
  - Actualizar CategoriesPage
  - _Requerimientos: 11, 12_

- [ ] 11.1 Actualizar PrintersPage
  - Editar `posNew/frontend/src/pages/PrintersPage.jsx`
  - Reemplazar inputs por ValidatedInput
  - Usar hook useFormErrors
  - Mostrar errores específicos por campo
  - Agregar estados de carga (skeleton, spinner en botón)
  - _Requerimientos: 11, 12_

- [ ] 11.2 Actualizar PaymentMethodsPage
  - Editar `posNew/frontend/src/pages/PaymentMethodsPage.jsx`
  - Aplicar mismo patrón de ValidatedInput y errores
  - Agregar estados de carga
  - _Requerimientos: 11, 12_

- [ ] 11.3 Actualizar DocumentTypesPage
  - Editar `posNew/frontend/src/pages/DocumentTypesPage.jsx`
  - Aplicar mismo patrón de ValidatedInput y errores
  - Agregar estados de carga
  - _Requerimientos: 11, 12_

- [ ] 11.4 Actualizar SerializationPage
  - Editar `posNew/frontend/src/pages/SerializationPage.jsx`
  - Aplicar mismo patrón de ValidatedInput y errores
  - Agregar badge de advertencia cuando número actual se acerca al final
  - Agregar estados de carga
  - _Requerimientos: 11, 12_

- [ ] 11.5 Actualizar UsersSettingsPage
  - Editar `posNew/frontend/src/pages/UsersSettingsPage.jsx`
  - Aplicar mismo patrón de ValidatedInput y errores
  - Diferenciar formulario de creación (password required) y edición (password optional)
  - Agregar indicador de fortaleza de contraseña
  - Agregar estados de carga
  - _Requerimientos: 11, 12_

- [ ] 11.6 Actualizar RolesPage
  - Editar `posNew/frontend/src/pages/RolesPage.jsx`
  - Aplicar mismo patrón de ValidatedInput y errores
  - Mostrar conteo de usuarios por rol
  - Agregar botón de editar permisos
  - Agregar estados de carga
  - _Requerimientos: 11, 12_

- [ ] 11.7 Actualizar CategoriesPage
  - Editar `posNew/frontend/src/pages/CategoriesPage.jsx`
  - Aplicar mismo patrón de ValidatedInput y errores
  - Integrar ColorPicker
  - Mostrar color e ícono en la tabla
  - Agregar estados de carga
  - _Requerimientos: 11, 12_

- [ ] 12. Agregar validaciones de negocio faltantes
  - Implementar todas las validaciones de unicidad
  - Implementar todas las validaciones de dependencias
  - Agregar mensajes descriptivos
  - _Requerimientos: 8, 9, 10_

- [ ] 12.1 Verificar y completar validaciones de unicidad
  - Revisar que todos los servicios validen unicidad según constraints de DB
  - Impresoras: no aplica (no hay unique constraint adicional)
  - Métodos de pago: codigo por empresa ✓ (ya implementado en tarea 3.4)
  - Tipos de comprobantes: codigo por empresa (verificar implementación)
  - Serialización: (sucursal, tipo, serie) ✓ (ya implementado en tarea 5.4)
  - Usuarios: username global, email opcional ✓ (ya implementado en tareas 6.5-6.6)
  - Roles: nombre por empresa (verificar implementación)
  - Categorías: codigo por empresa (verificar implementación)
  - _Requerimientos: 9_

- [ ] 12.2 Verificar y completar validaciones de dependencias
  - Revisar que todos los servicios validen dependencias antes de eliminar
  - Impresoras: no aplica (no tiene dependencias críticas)
  - Métodos de pago: verificar si está en formas_pago_venta
  - Tipos de comprobantes: verificar si está en ventas ✓ (ya implementado en tarea 4.4)
  - Serialización: no aplica (se puede eliminar)
  - Usuarios: verificar si tiene sesiones activas o ventas
  - Roles: verificar si tiene usuarios ✓ (ya implementado en tarea 7.4)
  - Categorías: verificar si tiene productos ✓ (ya implementado en tarea 9.4)
  - _Requerimientos: 10_

- [ ] 12.3 Implementar validación de dependencias para métodos de pago
  - Editar `posNew/backend/src/api/metodos_pago/servicio.metodos_pago.js`
  - Verificar si el método está en tabla formas_pago_venta antes de eliminar
  - Contar número de transacciones que usan el método
  - Lanzar `DependencyError` si hay dependencias
  - _Requerimientos: 10_

- [ ] 12.4 Implementar validación de dependencias para usuarios
  - Editar `posNew/backend/src/api/usuarios/servicio.usuarios.js`
  - Verificar si el usuario tiene sesiones activas
  - Verificar si el usuario tiene ventas registradas
  - Lanzar `DependencyError` con detalles si hay dependencias
  - Alternativamente, permitir eliminación lógica (activo = false)
  - _Requerimientos: 10_

- [ ] 13. Agregar sanitización de datos
  - Crear funciones de sanitización
  - Aplicar en todos los servicios antes de guardar
  - Prevenir inyección de código
  - _Requerimientos: 8_

- [ ] 13.1 Crear utilidades de sanitización
  - Crear archivo `posNew/backend/src/shared/utils/sanitize.js`
  - Implementar función `sanitizeString` que elimina caracteres peligrosos
  - Implementar función `sanitizeObject` que sanitiza recursivamente
  - _Requerimientos: 8_

- [ ] 13.2 Integrar sanitización en servicios
  - Editar todos los servicios de configuración
  - Aplicar `sanitizeObject` a datos antes de pasar al repositorio
  - Mantener tipos de datos correctos (no sanitizar números, booleans)
  - _Requerimientos: 8_

- [ ] 14. Documentar cambios y crear guía de uso
  - Documentar nuevos patrones de código
  - Crear guía de validación
  - Documentar manejo de errores
  - Crear ejemplos de uso
  - _Requerimientos: Todos_

- [ ] 14.1 Crear documento de patrones de código
  - Crear archivo `posNew/docs/CODING_PATTERNS.md`
  - Documentar patrón de transformación de datos
  - Documentar patrón de validación en múltiples capas
  - Documentar patrón de manejo de errores
  - Incluir ejemplos de código
  - _Requerimientos: Todos_

- [ ] 14.2 Crear guía de validación
  - Crear archivo `posNew/docs/VALIDATION_GUIDE.md`
  - Explicar cómo crear schemas Zod
  - Explicar cómo agregar validaciones personalizadas
  - Explicar cómo manejar errores de validación
  - Incluir checklist de validaciones comunes
  - _Requerimientos: 8, 9, 11_

- [ ] 14.3 Actualizar README con cambios
  - Editar `posNew/README.md`
  - Agregar sección sobre validación y manejo de errores
  - Agregar enlaces a documentación nueva
  - Agregar ejemplos de uso común
  - _Requerimientos: Todos_

- [ ] 15. Realizar pruebas de integración completas
  - Probar flujo completo de cada sección
  - Verificar mensajes de error
  - Verificar validaciones
  - Verificar transformación de datos
  - _Requerimientos: Todos_

- [ ] 15.1 Probar flujo completo de impresoras
  - Crear impresora con todos los campos
  - Crear impresora con campos mínimos
  - Actualizar impresora
  - Intentar crear con datos inválidos (verificar errores)
  - Eliminar impresora
  - Verificar que datos se guardan correctamente en DB
  - _Requerimientos: 1_

- [ ] 15.2 Probar flujo completo de métodos de pago
  - Crear método de pago
  - Intentar crear con código duplicado (verificar error de unicidad)
  - Actualizar método de pago
  - Intentar eliminar método en uso (verificar error de dependencia)
  - Eliminar método sin uso
  - _Requerimientos: 2_

- [ ] 15.3 Probar flujo completo de tipos de comprobantes
  - Crear tipo de comprobante
  - Filtrar por destino
  - Intentar crear con código duplicado
  - Intentar eliminar tipo en uso
  - Eliminar tipo sin uso
  - _Requerimientos: 3_

- [ ] 15.4 Probar flujo completo de serialización
  - Crear serialización
  - Intentar crear con serie duplicada para misma sucursal y tipo
  - Crear serie predeterminada
  - Crear otra serie predeterminada (verificar que anterior se desactiva)
  - Intentar crear con número actual > número final (verificar error)
  - Verificar advertencia cuando se acerca al final
  - _Requerimientos: 4_

- [ ] 15.5 Probar flujo completo de usuarios
  - Crear usuario con contraseña
  - Intentar crear con username duplicado
  - Intentar crear con email duplicado
  - Actualizar usuario sin cambiar contraseña
  - Actualizar usuario cambiando contraseña
  - Verificar que contraseña se hashea correctamente
  - Intentar eliminar usuario con dependencias
  - _Requerimientos: 5_

- [ ] 15.6 Probar flujo completo de roles y permisos
  - Crear rol
  - Intentar crear con nombre duplicado
  - Editar permisos del rol usando matriz
  - Verificar que permisos se guardan correctamente
  - Intentar eliminar rol con usuarios asignados
  - Eliminar rol sin usuarios
  - _Requerimientos: 6_

- [ ] 15.7 Probar flujo completo de categorías
  - Crear categoría con color e ícono
  - Verificar que color se muestra correctamente en tabla
  - Intentar crear con código duplicado
  - Intentar eliminar categoría con productos
  - Eliminar categoría sin productos
  - _Requerimientos: 7_

## Notas de Implementación

### Orden de Ejecución

Las tareas deben ejecutarse en orden secuencial, ya que cada una construye sobre las anteriores:

1. **Tareas 1-1.5**: Infraestructura base (utilidades, componentes, middleware)
2. **Tareas 2-9**: Corrección de cada sección de configuración
3. **Tareas 10-11**: Mejoras de manejo de errores y UI
4. **Tareas 12-13**: Validaciones de negocio y sanitización
5. **Tareas 14-15**: Documentación y pruebas

### Prioridades

**Alta Prioridad (Crítico):**
- Tareas 1-1.5: Infraestructura base
- Tareas 2-9: Corrección de schemas y DTOs
- Tarea 10: Manejo de errores
- Tarea 12: Validaciones de negocio

**Media Prioridad:**
- Tarea 11: Actualización de páginas
- Tarea 13: Sanitización
- Tarea 15: Pruebas de integración

**Baja Prioridad:**
- Tarea 14: Documentación
- Tests marcados con * (opcionales pero recomendados)

### Testing

Todas las tareas de testing son requeridas para asegurar la calidad del sistema y prevenir regresiones. Se debe mantener una cobertura de código adecuada en todas las secciones.

### Estimación de Tiempo

- **Tareas 1**: 1-2 días
- **Tareas 2-9**: 8-12 días (1-1.5 días por sección)
- **Tareas 10-11**: 3-4 días
- **Tareas 12-13**: 2-3 días
- **Tareas 14-15**: 2-3 días

**Total estimado**: 16-24 días de desarrollo

### Dependencias

- Node.js y npm instalados
- Base de datos MySQL con esquema actualizado
- Backend corriendo en desarrollo
- Frontend corriendo en desarrollo
- Acceso a la base de datos para verificar datos

## Conclusión

Este plan de implementación proporciona una ruta clara y estructurada para corregir todas las inconsistencias en las secciones de configuración del POS. Cada tarea es incremental y construye sobre las anteriores, permitiendo validación continua y entrega de valor progresiva.

El enfoque prioriza las correcciones críticas primero (infraestructura y schemas), seguido de mejoras de validación y UX, asegurando que el sistema sea funcional desde las primeras etapas de desarrollo.
