# Documento de Requerimientos - Corrección de Secciones de Configuración

## Introducción

Esta especificación aborda problemas críticos en las secciones de configuración del POS incluyendo impresoras, métodos de pago, tipos de comprobantes, serialización, usuarios, roles/permisos y categorías. El sistema actualmente sufre de inconsistencias entre los esquemas de validación del frontend, las llamadas API y la estructura de la base de datos del backend, resultando en operaciones fallidas, mensajes de error poco claros y funcionalidad faltante.

## Glosario

- **Frontend**: Aplicación React ubicada en `posNew/frontend`
- **Backend**: API Node.js/Express ubicada en `posNew/backend`
- **Esquema de Base de Datos**: Estructura de base de datos MySQL definida en `posNew/backend/db/schema.sql`
- **Esquema Zod**: Esquemas de validación del frontend en `posNew/frontend/src/features/settings/schemas/`
- **Capa API**: Llamadas API del frontend en `posNew/frontend/src/features/settings/api/`
- **Controlador Backend**: Manejadores de endpoints del backend en `posNew/backend/src/api/*/controlador.*.js`
- **DTO Backend**: Objetos de transferencia de datos del backend en `posNew/backend/src/api/*/dto.*.js`
- **Repositorio Backend**: Capa de acceso a base de datos del backend en `posNew/backend/src/api/*/repositorio.*.js`
- **Sección de Configuración**: Un módulo para gestionar configuraciones específicas del POS (impresoras, métodos de pago, etc.)

## Requerimientos

### Requerimiento 1: Consistencia en Configuración de Impresoras

**Historia de Usuario:** Como administrador del sistema, quiero configurar impresoras con todos los campos requeridos que coincidan con el esquema de la base de datos, para que la configuración de impresoras funcione correctamente sin errores.

#### Criterios de Aceptación

1. CUANDO el administrador accede a la página de configuración de impresoras, EL Frontend DEBE mostrar campos de entrada para todas las columnas de la base de datos: `name`, `tipo`, `puerto`, `pc_name`, `ip_local`, `state`, `configuracion`, `id_sucursal`, y `id_caja`
2. CUANDO el administrador envía un formulario de impresora, EL Frontend DEBE validar todos los campos usando un esquema Zod que coincida con las restricciones de la base de datos
3. CUANDO el backend recibe una solicitud de creación de impresora, EL Backend DEBE aceptar y almacenar todos los campos definidos en el esquema de la tabla `impresoras`
4. SI la validación falla, ENTONCES EL Frontend DEBE mostrar mensajes de error específicos por campo indicando qué campos son inválidos y por qué
5. CUANDO una impresora se crea o actualiza exitosamente, EL Frontend DEBE mostrar un mensaje de éxito y refrescar la lista de impresoras

### Requerimiento 2: Consistencia en Configuración de Métodos de Pago

**Historia de Usuario:** Como administrador del sistema, quiero configurar métodos de pago con manejo adecuado de imágenes y requisitos de referencia, para que las opciones de pago estén correctamente configuradas para las ventas.

#### Criterios de Aceptación

1. CUANDO el administrador accede a la página de métodos de pago, EL Frontend DEBE mostrar campos de entrada para `codigo`, `nombre`, `descripcion`, `imagen`, y `requiere_referencia`
2. CUANDO el administrador sube una imagen para un método de pago, EL Frontend DEBE manejar la carga de imagen y almacenar la ruta en el campo `imagen`
3. CUANDO el backend recibe una solicitud de método de pago, EL Backend DEBE validar que `codigo` sea único por `id_empresa`
4. SI existe un método de pago con `codigo` duplicado, ENTONCES EL Backend DEBE retornar un mensaje de error claro indicando "El código del método de pago ya existe"
5. CUANDO se alterna `requiere_referencia`, EL Frontend DEBE reflejar el cambio inmediatamente sin requerir envío del formulario

### Requerimiento 3: Consistencia en Configuración de Tipos de Comprobantes

**Historia de Usuario:** Como administrador del sistema, quiero configurar tipos de comprobantes con filtrado adecuado por destino, para poder organizar correctamente documentos de ventas, compras e internos.

#### Criterios de Aceptación

1. CUANDO el administrador accede a la página de tipos de comprobantes, EL Frontend DEBE mostrar campos de entrada para `codigo`, `nombre`, `descripcion`, y `destino` con opciones 'VENTA', 'COMPRA', 'INTERNO'
2. CUANDO el administrador filtra por destino, EL Frontend DEBE mostrar solo los tipos de comprobantes que coincidan con el valor de `destino` seleccionado
3. CUANDO el backend recibe una solicitud de tipo de comprobante, EL Backend DEBE validar que `codigo` sea único por `id_empresa`
4. CUANDO el administrador intenta eliminar un tipo de comprobante en uso, EL Backend DEBE prevenir la eliminación y retornar un mensaje indicando cuántas ventas/compras lo referencian
5. CUANDO se crea un tipo de comprobante, EL Frontend DEBE validar que `destino` sea uno de los valores ENUM permitidos

### Requerimiento 4: Consistencia en Configuración de Serialización

**Historia de Usuario:** Como administrador del sistema, quiero configurar la serialización de documentos con rangos de números apropiados y series predeterminadas, para que la numeración de documentos funcione correctamente en todas las sucursales.

#### Criterios de Aceptación

1. CUANDO el administrador accede a la página de serialización, EL Frontend DEBE mostrar campos de entrada para `serie`, `numero_inicial`, `numero_actual`, `numero_final`, `cantidad_numeros`, `por_default`, `id_sucursal`, y `id_tipo_comprobante`
2. CUANDO el administrador establece una serie como predeterminada, EL Frontend DEBE asegurar que solo una serie por sucursal y tipo de comprobante pueda ser predeterminada
3. CUANDO el backend recibe una solicitud de serialización, EL Backend DEBE validar que `numero_actual` esté entre `numero_inicial` y `numero_final`
4. SI `numero_actual` se acerca a `numero_final` (dentro del 10%), ENTONCES EL Frontend DEBE mostrar un mensaje de advertencia
5. CUANDO se crea una serialización, EL Backend DEBE validar que la combinación de `id_sucursal`, `id_tipo_comprobante`, y `serie` sea única

### Requerimiento 5: Consistencia en Configuración de Usuarios

**Historia de Usuario:** Como administrador del sistema, quiero gestionar usuarios con información completa de perfil y asignaciones de roles, para que las cuentas de usuario estén correctamente configuradas con los niveles de acceso correctos.

#### Criterios de Aceptación

1. CUANDO el administrador accede a la página de usuarios, EL Frontend DEBE mostrar campos de entrada para `username`, `password`, `nombres`, `apellidos`, `email`, `telefono`, `id_rol`, `id_tipodocumento`, `nro_doc`, `tema`, y `estado`
2. CUANDO se crea un nuevo usuario, EL Frontend DEBE requerir el campo `password` y validar que cumpla con los requisitos de seguridad (mínimo 8 caracteres, al menos una mayúscula, una minúscula, un número)
3. CUANDO se edita un usuario existente, EL Frontend DEBE hacer el campo `password` opcional y solo actualizarlo si se proporciona
4. CUANDO el backend recibe una solicitud de usuario, EL Backend DEBE validar que `username` sea único en todo el sistema
5. SI existe un usuario con `username` o `email` duplicado, ENTONCES EL Backend DEBE retornar mensajes de error específicos para cada campo
6. CUANDO el administrador asigna un rol a un usuario, EL Frontend DEBE cargar y mostrar los roles disponibles de la tabla `roles` filtrados por `id_empresa`

### Requerimiento 6: Consistencia en Configuración de Roles y Permisos

**Historia de Usuario:** Como administrador del sistema, quiero gestionar roles con permisos granulares por módulo, para poder controlar el acceso de usuarios a diferentes funcionalidades del sistema.

#### Criterios de Aceptación

1. CUANDO el administrador accede a la página de roles, EL Frontend DEBE mostrar una lista de roles con el conteo de usuarios para cada rol
2. CUANDO el administrador edita permisos de rol, EL Frontend DEBE mostrar una matriz de permisos mostrando todos los módulos con checkboxes para `puede_ver`, `puede_crear`, `puede_editar`, `puede_eliminar`
3. CUANDO el administrador guarda permisos de rol, EL Backend DEBE actualizar o crear registros en la tabla `permisos` con la restricción única en `(id_rol, id_modulo)`
4. CUANDO el administrador intenta eliminar un rol con usuarios asignados, EL Backend DEBE prevenir la eliminación y retornar un mensaje listando los usuarios afectados
5. CUANDO se carga la matriz de permisos, EL Frontend DEBE obtener todos los módulos de la tabla `modulos` y los permisos existentes de la tabla `permisos`

### Requerimiento 7: Consistencia en Configuración de Categorías

**Historia de Usuario:** Como administrador del sistema, quiero configurar categorías de productos con identificadores visuales, para que los productos estén correctamente organizados y sean fácilmente identificables.

#### Criterios de Aceptación

1. CUANDO el administrador accede a la página de categorías, EL Frontend DEBE mostrar campos de entrada para `codigo`, `nombre`, `descripcion`, `color`, e `icono`
2. CUANDO el administrador selecciona un color, EL Frontend DEBE proporcionar un componente selector de color y mostrar una vista previa del color seleccionado
3. CUANDO el backend recibe una solicitud de categoría, EL Backend DEBE validar que `codigo` sea único por `id_empresa`
4. CUANDO el administrador intenta eliminar una categoría con productos, EL Backend DEBE prevenir la eliminación y retornar un mensaje indicando el número de productos en esa categoría
5. CUANDO se muestra la lista de categorías, EL Frontend DEBE mostrar el color e ícono para cada categoría como indicadores visuales

### Requerimiento 8: Manejo Integral de Errores

**Historia de Usuario:** Como administrador del sistema, quiero ver mensajes de error claros y específicos cuando las operaciones fallan, para poder entender y corregir problemas de configuración rápidamente.

#### Criterios de Aceptación

1. CUANDO falla una validación Zod, EL Frontend DEBE mostrar mensajes de error específicos por campo debajo de cada campo de entrada inválido
2. CUANDO falla una validación del backend, EL Backend DEBE retornar una respuesta de error estructurada con propiedades `field`, `message`, y `code`
3. CUANDO ocurre una violación de restricción de base de datos, EL Backend DEBE transformar el error de base de datos en un mensaje amigable para el usuario
4. CUANDO ocurre un error de red, EL Frontend DEBE mostrar un mensaje indicando problemas de conexión y sugerir reintentar
5. CUANDO ocurre un error inesperado, EL Frontend DEBE registrar los detalles completos del error en la consola y mostrar un mensaje de error genérico al usuario

### Requerimiento 9: Validación de Consistencia de Campos

**Historia de Usuario:** Como desarrollador, quiero que todas las secciones de configuración tengan nombres y tipos de campos consistentes entre frontend, backend y base de datos, para que los datos fluyan correctamente a través de todas las capas.

#### Criterios de Aceptación

1. CUANDO se comparan esquemas Zod del frontend con el esquema de base de datos, EL Sistema DEBE tener nombres de campos coincidentes para todos los campos requeridos y opcionales
2. CUANDO se comparan llamadas API del frontend con DTOs del backend, EL Sistema DEBE enviar y recibir los mismos nombres de campos
3. CUANDO se comparan DTOs del backend con columnas de base de datos, EL Sistema DEBE mapear todos los campos correctamente sin campos faltantes o extras
4. CUANDO un campo es requerido en la base de datos (NOT NULL), EL Frontend DEBE marcarlo como requerido en el esquema Zod
5. CUANDO un campo tiene un valor predeterminado en la base de datos, EL Frontend DEBE proporcionar el mismo valor predeterminado o hacer el campo opcional

### Requerimiento 10: Operaciones CRUD Completas

**Historia de Usuario:** Como administrador del sistema, quiero crear, leer, actualizar y eliminar elementos de configuración de manera confiable, para poder gestionar completamente todas las configuraciones del sistema.

#### Criterios de Aceptación

1. CUANDO el administrador crea un nuevo elemento de configuración, EL Backend DEBE insertar todos los campos proporcionados en la base de datos y retornar el elemento creado con su ID
2. CUANDO el administrador actualiza un elemento de configuración, EL Backend DEBE actualizar solo los campos proporcionados y retornar el elemento actualizado
3. CUANDO el administrador elimina un elemento de configuración, EL Backend DEBE verificar dependencias y realizar eliminación lógica o retornar errores de dependencia
4. CUANDO el administrador ve una lista de configuración, EL Frontend DEBE mostrar todos los elementos no eliminados filtrados por `id_empresa` y `eliminado = FALSE`
5. CUANDO el administrador ve un elemento de configuración individual, EL Frontend DEBE cargar todos los campos del backend y poblar el formulario correctamente

### Requerimiento 11: Retroalimentación de Validación

**Historia de Usuario:** Como administrador del sistema, quiero retroalimentación inmediata de validación mientras lleno formularios, para poder corregir errores antes del envío.

#### Criterios de Aceptación

1. CUANDO el administrador escribe en un campo requerido, EL Frontend DEBE remover el mensaje de error una vez que el campo se vuelve válido
2. CUANDO el administrador deja un campo requerido vacío, EL Frontend DEBE mostrar un mensaje de error después de que el campo pierde el foco
3. CUANDO el administrador ingresa un formato de datos inválido (ej. email inválido), EL Frontend DEBE mostrar un mensaje de error específico del formato
4. CUANDO el administrador envía un formulario con errores, EL Frontend DEBE prevenir el envío y enfocar en el primer campo inválido
5. CUANDO todos los campos son válidos, EL Frontend DEBE habilitar el botón de envío y permitir el envío del formulario

### Requerimiento 12: Estados de Carga de Datos

**Historia de Usuario:** Como administrador del sistema, quiero ver indicadores de carga cuando los datos están siendo obtenidos o guardados, para saber que el sistema está procesando mi solicitud.

#### Criterios de Aceptación

1. CUANDO el administrador abre una página de configuración, EL Frontend DEBE mostrar un cargador skeleton mientras obtiene los datos
2. CUANDO el administrador envía un formulario, EL Frontend DEBE deshabilitar el botón de envío y mostrar un spinner de carga
3. CUANDO falla la carga de datos, EL Frontend DEBE mostrar un mensaje de error con un botón de reintentar
4. CUANDO la carga de datos tiene éxito, EL Frontend DEBE ocultar el cargador y mostrar los datos
5. CUANDO una mutación está en progreso, EL Frontend DEBE prevenir que el usuario navegue fuera o envíe nuevamente
