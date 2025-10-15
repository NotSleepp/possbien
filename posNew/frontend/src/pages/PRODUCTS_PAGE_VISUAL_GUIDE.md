# Products Page - Visual Guide

## Desktop Layout (≥768px)

```
┌─────────────────────────────────────────────────────────────────────┐
│  Productos                                    [+ Agregar Producto]  │
│  Gestiona el inventario de productos del sistema                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  [🔍 Buscar por nombre o código...]  [Todos] [Activos] [Inactivos] │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Código ↑ │ Nombre ↑ │ Precio ↑ │ Stock ↑ │ Estado │ Acciones│   │
│  ├──────────┼──────────┼──────────┼─────────┼────────┼─────────┤   │
│  │ PROD001  │ Laptop   │ $999.99  │   15    │ Activo │ ✏️ 🗑️  │   │
│  │          │ HP Elite │          │         │        │         │   │
│  ├──────────┼──────────┼──────────┼─────────┼────────┼─────────┤   │
│  │ PROD002  │ Mouse    │  $29.99  │    3    │ Activo │ ✏️ 🗑️  │   │
│  │          │ Logitech │          │  (Bajo) │        │         │   │
│  ├──────────┼──────────┼──────────┼─────────┼────────┼─────────┤   │
│  │ PROD003  │ Teclado  │  $79.99  │   25    │Inactivo│ ✏️ 🗑️  │   │
│  │          │ Mecánico │          │         │        │         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Mostrando 1 a 10 de 45 productos    [<] [1] [2] [3] ... [5] [>]  │
└─────────────────────────────────────────────────────────────────────┘
```

## Mobile Layout (<768px)

```
┌──────────────────────────────┐
│  Productos                   │
│  Gestiona el inventario...   │
│  [+ Agregar Producto]        │
├──────────────────────────────┤
│ [🔍 Buscar...]               │
│                              │
│ [Todos] [Activos] [Inactivos]│
├──────────────────────────────┤
│ ┌──────────────────────────┐ │
│ │ 📦  Laptop HP Elite      │ │
│ │     Código: PROD001      │ │
│ │     [Activo]             │ │
│ │                          │ │
│ │ Laptop de alta gama...   │ │
│ │                          │ │
│ │ Precio      Stock        │ │
│ │ $999.99     15           │ │
│ │                          │ │
│ │ [✏️ Editar] [🗑️ Eliminar]│ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📦  Mouse Logitech       │ │
│ │     Código: PROD002      │ │
│ │     [Activo]             │ │
│ │                          │ │
│ │ Mouse inalámbrico...     │ │
│ │                          │ │
│ │ Precio      Stock        │ │
│ │ $29.99      3 (Bajo)     │ │
│ │                          │ │
│ │ [✏️ Editar] [🗑️ Eliminar]│ │
│ └──────────────────────────┘ │
│                              │
│ Mostrando 1 a 10 de 45       │
│ [<] [1] [2] [3] ... [5] [>] │
└──────────────────────────────┘
```

## Empty State - No Products

```
┌─────────────────────────────────────┐
│  Productos                          │
│  Gestiona el inventario...          │
├─────────────────────────────────────┤
│                                     │
│           ┌─────┐                   │
│           │ 📦  │                   │
│           └─────┘                   │
│                                     │
│    No hay productos registrados     │
│                                     │
│  Comienza agregando tu primer       │
│  producto al inventario.            │
│                                     │
│      [+ Agregar Producto]           │
│                                     │
└─────────────────────────────────────┘
```

## Empty State - No Results

```
┌─────────────────────────────────────┐
│  Productos          [+ Agregar...]  │
│  Gestiona el inventario...          │
├─────────────────────────────────────┤
│ [🔍 laptop]  [Todos] [Activos] [...] │
├─────────────────────────────────────┤
│                                     │
│           ┌─────┐                   │
│           │ 📦  │                   │
│           └─────┘                   │
│                                     │
│    No se encontraron productos      │
│                                     │
│  No hay productos que coincidan     │
│  con los filtros aplicados.         │
│                                     │
│        [Limpiar filtros]            │
│                                     │
└─────────────────────────────────────┘
```

## Delete Confirmation Modal

```
┌─────────────────────────────────────┐
│  Confirmar eliminación          [×] │
├─────────────────────────────────────┤
│                                     │
│  ¿Estás seguro de que deseas        │
│  eliminar el producto?              │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Laptop HP Elite               │ │
│  │ Código: PROD001               │ │
│  └───────────────────────────────┘ │
│                                     │
│  ⚠️ Esta acción no se puede        │
│     deshacer.                       │
│                                     │
│              [Cancelar] [Eliminar]  │
└─────────────────────────────────────┘
```

## Loading State

```
┌─────────────────────────────────────┐
│  Productos                          │
│  Gestiona el inventario...          │
├─────────────────────────────────────┤
│                                     │
│                                     │
│              ⟳                      │
│         Cargando...                 │
│                                     │
│                                     │
└─────────────────────────────────────┘
```

## Error State

```
┌─────────────────────────────────────┐
│  Productos                          │
│  Gestiona el inventario...          │
├─────────────────────────────────────┤
│  ┌───────────────────────────────┐ │
│  │ ⚠️ Error al cargar productos  │ │
│  │                               │ │
│  │ No se pudieron cargar los     │ │
│  │ productos. Por favor, intenta │ │
│  │ nuevamente.                   │ │
│  │                               │ │
│  │         [Reintentar]          │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘
```

## Component Breakdown

### ProductTable (Desktop)
- **Sortable Headers**: Click to sort, shows arrow indicator
- **Product Info**: Code, name, description (truncated)
- **Price**: Formatted with 2 decimals
- **Stock**: Red text if below minimum
- **Status Badge**: Green (Active) / Red (Inactive)
- **Actions**: Edit and Delete buttons with icons

### ProductCard (Mobile)
- **Icon**: Package icon in colored circle
- **Header**: Name and code
- **Badge**: Status indicator
- **Description**: Truncated to 2 lines
- **Metrics Grid**: Price and Stock side by side
- **Actions**: Full-width buttons

### ProductFilters
- **Search Input**: Icon, placeholder, real-time search
- **Status Buttons**: Toggle between All/Active/Inactive
- **Active State**: Primary color for selected filter

### Pagination
- **Info Text**: "Showing X to Y of Z products"
- **Page Numbers**: Smart display with ellipsis
- **Navigation**: Previous/Next with disabled states
- **Current Page**: Highlighted in primary color

### EmptyState
- **Icon**: Large package icon in colored circle
- **Heading**: Clear, descriptive title
- **Description**: Helpful message
- **Action**: Primary button for next step

## Color Coding

- **Primary Blue**: Active filters, current page, primary actions
- **Green**: Active status, success states
- **Red**: Inactive status, delete actions, low stock warnings
- **Gray**: Neutral elements, disabled states, borders

## Interactive Elements

1. **Hover Effects**
   - Table rows: Light gray background
   - Buttons: Darker shade of variant color
   - Column headers: Light gray background

2. **Click Actions**
   - Column headers: Toggle sort direction
   - Filter buttons: Change active filter
   - Page numbers: Navigate to page
   - Edit button: Open edit modal (placeholder)
   - Delete button: Open confirmation modal

3. **Loading States**
   - Full page: Centered spinner
   - Delete button: Spinner replaces icon
   - Disabled state: Reduced opacity

## Responsive Breakpoints

- **Mobile**: < 768px (Cards view)
- **Desktop**: ≥ 768px (Table view)

## Accessibility Features

- ARIA labels on icon-only buttons
- Keyboard navigation support
- Focus indicators on interactive elements
- Semantic HTML structure
- Screen reader friendly text
