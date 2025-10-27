# Requirements Document - Arreglar Configuración de Impresoras

## Introduction

Este documento define los requisitos para arreglar y mejorar la funcionalidad de la página de configuración de impresoras en el sistema POS. Actualmente existen varios problemas que impiden el correcto funcionamiento del CRUD de impresoras, incluyendo problemas de validación, transformación de datos, y filtrado por sucursal.

## Requirements

### Requirement 1: Arreglar Validación de Formulario de Impresoras

**User Story:** Como administrador del sistema, quiero que el formulario de impresoras valide correctamente todos los campos, para que pueda crear y editar impresoras sin errores de validación.

#### Acceptance Criteria

1. WHEN el usuario intenta crear una impresora THEN el sistema SHALL validar que `idEmpresa` e `idSucursal` sean números válidos y no undefined
2. WHEN el usuario selecciona una caja THEN el sistema SHALL convertir el valor a número o null correctamente
3. WHEN el usuario marca el checkbox de estado THEN el sistema SHALL guardar el valor como boolean (true/false) y no como number (0/1)
4. WHEN el usuario ingresa un puerto THEN el sistema SHALL validar que sea un número entre 1 y 65535
5. WHEN el usuario ingresa una IP THEN el sistema SHALL validar que sea una dirección IP válida o permitir campo vacío
6. WHEN el usuario ingresa configuración JSON THEN el sistema SHALL validar que sea JSON válido o permitir campo vacío

### Requirement 2: Arreglar Transformación de Datos entre Frontend y Backend

**User Story:** Como desarrollador, quiero que los datos se transformen correctamente entre camelCase (frontend) y snake_case (backend), para mantener consistencia en todo el sistema.

#### Acceptance Criteria

1. WHEN el backend devuelve datos con snake_case THEN el frontend SHALL transformarlos a camelCase automáticamente
2. WHEN el frontend envía datos al backend THEN SHALL transformarlos a snake_case automáticamente
3. WHEN se muestran datos en la tabla THEN el sistema SHALL soportar ambos formatos (camelCase y snake_case) como fallback
4. WHEN se filtran datos THEN el sistema SHALL usar los campos transformados correctamente

### Requirement 3: Arreglar Filtrado por Sucursal

**User Story:** Como usuario, quiero filtrar las impresoras por sucursal, para ver solo las impresoras de la sucursal seleccionada.

#### Acceptance Criteria

1. WHEN el usuario selecciona "Todas las sucursales" THEN el sistema SHALL mostrar todas las impresoras de la empresa
2. WHEN el usuario selecciona una sucursal específica THEN el sistema SHALL mostrar solo las impresoras de esa sucursal
3. WHEN se comparan IDs de sucursal THEN el sistema SHALL convertir ambos valores a número para evitar problemas de tipos (string vs number)
4. WHEN no hay impresoras en una sucursal THEN el sistema SHALL mostrar un mensaje apropiado

### Requirement 4: Arreglar Carga de Cajas por Sucursal

**User Story:** Como usuario, quiero que al seleccionar una sucursal se carguen automáticamente las cajas de esa sucursal, para poder asignar la impresora a una caja específica.

#### Acceptance Criteria

1. WHEN el usuario abre el modal de crear impresora THEN el sistema SHALL requerir que se seleccione una sucursal primero
2. WHEN el usuario selecciona una sucursal en el formulario THEN el sistema SHALL cargar las cajas de esa sucursal automáticamente
3. WHEN el usuario cambia de sucursal THEN el sistema SHALL limpiar la caja seleccionada y cargar las nuevas cajas
4. WHEN no hay cajas disponibles THEN el sistema SHALL mostrar un mensaje informativo
5. WHEN el usuario edita una impresora THEN el sistema SHALL cargar las cajas de la sucursal de esa impresora

### Requirement 5: Mejorar Experiencia de Usuario (UX)

**User Story:** Como usuario, quiero recibir mensajes claros y útiles durante el uso del sistema, para entender qué está pasando y qué debo hacer.

#### Acceptance Criteria

1. WHEN el usuario intenta crear una impresora sin seleccionar sucursal THEN el sistema SHALL mostrar un mensaje de error claro
2. WHEN se están cargando datos THEN el sistema SHALL mostrar indicadores de carga apropiados
3. WHEN no hay sucursales disponibles THEN el sistema SHALL mostrar un mensaje sugiriendo crear una sucursal primero
4. WHEN ocurre un error THEN el sistema SHALL mostrar un mensaje de error descriptivo
5. WHEN una operación es exitosa THEN el sistema SHALL mostrar un mensaje de éxito

### Requirement 6: Arreglar Schema de Validación Zod

**User Story:** Como desarrollador, quiero que el schema de validación Zod sea robusto y flexible, para manejar diferentes tipos de datos de entrada correctamente.

#### Acceptance Criteria

1. WHEN el campo `idCaja` es null, undefined, o string vacío THEN el schema SHALL transformarlo a null
2. WHEN el campo `puerto` es string THEN el schema SHALL transformarlo a número
3. WHEN el campo `state` es number, string, o boolean THEN el schema SHALL transformarlo a boolean
4. WHEN el campo `configuracion` es objeto THEN el schema SHALL permitirlo y el backend lo convertirá a JSON string
5. WHEN hay errores de validación THEN el schema SHALL devolver mensajes de error claros y específicos

### Requirement 7: Agregar Logs de Debugging

**User Story:** Como desarrollador, quiero tener logs detallados en todo el flujo de datos, para poder diagnosticar problemas rápidamente.

#### Acceptance Criteria

1. WHEN se hace una petición al backend THEN el sistema SHALL loggear la petición completa (método, URL, headers, data)
2. WHEN se recibe una respuesta del backend THEN el sistema SHALL loggear la respuesta (status, data)
3. WHEN se transforman datos THEN el sistema SHALL loggear los datos antes y después de la transformación
4. WHEN se validan datos THEN el sistema SHALL loggear los datos y el resultado de la validación
5. WHEN se filtran datos THEN el sistema SHALL loggear cada comparación del filtro

### Requirement 8: Arreglar Columnas de la Tabla

**User Story:** Como usuario, quiero que la tabla de impresoras muestre correctamente todos los datos, para poder ver la información completa de cada impresora.

#### Acceptance Criteria

1. WHEN se muestra la tabla THEN el sistema SHALL usar los campos en camelCase con fallback a snake_case
2. WHEN se muestra la sucursal THEN el sistema SHALL mostrar el nombre de la sucursal, no el ID
3. WHEN se muestra la caja THEN el sistema SHALL mostrar el nombre de la caja o "Sin asignar" si no tiene
4. WHEN se muestra el estado THEN el sistema SHALL mostrar "Activa" o "Inactiva" con colores apropiados
5. WHEN se muestra la IP THEN el sistema SHALL mostrar la IP o "-" si no tiene

### Requirement 9: Arreglar Inicialización del Formulario

**User Story:** Como usuario, quiero que el formulario se inicialice correctamente con los valores por defecto, para poder crear impresoras sin problemas.

#### Acceptance Criteria

1. WHEN se abre el modal de crear THEN el formulario SHALL tener `idEmpresa` del usuario actual
2. WHEN se abre el modal de crear THEN el formulario SHALL tener `idSucursal` de la sucursal seleccionada
3. WHEN se abre el modal de editar THEN el formulario SHALL cargar todos los datos de la impresora correctamente
4. WHEN se abre el modal de editar THEN el sistema SHALL cargar las cajas de la sucursal de la impresora
5. WHEN se cierra el modal THEN el formulario SHALL limpiarse completamente

### Requirement 10: Asegurar Compatibilidad con Multitenant

**User Story:** Como administrador de empresa, quiero que el sistema respete el aislamiento de datos entre empresas, para que cada empresa solo vea sus propias impresoras.

#### Acceptance Criteria

1. WHEN se listan impresoras THEN el sistema SHALL filtrar por `id_empresa` del usuario actual
2. WHEN se crea una impresora THEN el sistema SHALL asignar automáticamente el `id_empresa` del usuario actual
3. WHEN se actualiza una impresora THEN el sistema SHALL verificar que pertenece a la empresa del usuario
4. WHEN se elimina una impresora THEN el sistema SHALL verificar que pertenece a la empresa del usuario
5. WHEN se listan sucursales THEN el sistema SHALL mostrar solo las sucursales de la empresa del usuario
