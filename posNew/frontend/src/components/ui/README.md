# UI Components Library

This directory contains reusable UI components for the POS system. All components follow the design system defined in `src/styles/theme.js`.

## Components

### Button
Reusable button with multiple variants and loading states.

**Props:**
- `variant`: 'primary' | 'secondary' | 'danger' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `isLoading`: boolean (default: false)
- `disabled`: boolean (default: false)
- `icon`: ReactNode
- `children`: ReactNode
- `onClick`: Function

**Example:**
```jsx
import { Button } from '@/components/ui';

<Button variant="primary" size="md" onClick={handleClick}>
  Guardar
</Button>

<Button variant="danger" isLoading={isSubmitting}>
  Eliminar
</Button>
```

### Input
Input field with label, error display, and icon support.

**Props:**
- `type`: string (default: 'text')
- `label`: string
- `error`: string
- `icon`: ReactNode
- `placeholder`: string
- `value`: string
- `onChange`: Function
- `required`: boolean (default: false)
- `disabled`: boolean (default: false)

**Example:**
```jsx
import { Input } from '@/components/ui';

<Input
  label="Correo Electrónico"
  type="email"
  value={email}
  onChange={setEmail}
  error={errors.email}
  required
/>
```

### Card
Container component for consistent content presentation.

**Props:**
- `title`: string
- `subtitle`: string
- `icon`: ReactNode
- `children`: ReactNode
- `actions`: ReactNode
- `variant`: 'default' | 'elevated' | 'outlined' (default: 'default')
- `hoverable`: boolean (default: false)
- `onClick`: Function

**Example:**
```jsx
import { Card } from '@/components/ui';

<Card
  title="Ventas del Día"
  subtitle="Resumen de ventas"
  icon={<ChartIcon />}
  actions={<Button size="sm">Ver más</Button>}
>
  <p>Contenido de la tarjeta</p>
</Card>
```

### LoadingSpinner
Loading spinner for loading states.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `color`: string (Tailwind color class, default: 'text-blue-600')
- `fullScreen`: boolean (default: false)
- `text`: string

**Example:**
```jsx
import { LoadingSpinner } from '@/components/ui';

<LoadingSpinner size="lg" text="Cargando datos..." />

<LoadingSpinner fullScreen text="Procesando..." />
```

### Badge
Badge for status indicators and labels.

**Props:**
- `children`: ReactNode
- `variant`: 'primary' | 'success' | 'danger' | 'warning' | 'gray' | 'info' | 'error' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- `icon`: ReactNode
- `dot`: boolean (default: false)
- `onRemove`: Function

**Example:**
```jsx
import { Badge } from '@/components/ui';

<Badge variant="success" dot>
  Activo
</Badge>

<Badge variant="danger" onRemove={handleRemove}>
  Error
</Badge>
```

### MetricCard
Card component for displaying key metrics with icons and trends.

**Props:**
- `title`: string (required)
- `value`: string | number (required)
- `icon`: ReactNode (required)
- `trend`: Object { value: number, isPositive: boolean }
- `color`: 'blue' | 'green' | 'purple' | 'orange' | 'red' (default: 'blue')
- `subtitle`: string
- `isLoading`: boolean (default: false)

**Example:**
```jsx
import { MetricCard } from '@/components/ui';
import { FiDollarSign } from 'react-icons/fi';

<MetricCard
  title="Ventas Totales"
  value="$45,231"
  icon={<FiDollarSign />}
  color="blue"
  subtitle="Este mes"
  trend={{ value: 12.5, isPositive: true }}
/>
```

### Toast & ToastContainer
Toast notification system for displaying temporary messages.

**Toast Store Methods:**
- `addToast({ message, type, duration })`: Add a new toast
- `removeToast(id)`: Remove a specific toast
- `clearToasts()`: Clear all toasts
- `success(message, duration)`: Show success toast
- `error(message, duration)`: Show error toast
- `warning(message, duration)`: Show warning toast
- `info(message, duration)`: Show info toast

**Toast Types:**
- `success`: Green, for successful operations
- `error`: Red, for errors and failures
- `warning`: Yellow, for warnings
- `info`: Blue, for informational messages

**Example:**
```jsx
import { useToastStore } from '@/store/useToastStore';

function MyComponent() {
  const { success, error, warning, info } = useToastStore();

  const handleSave = async () => {
    try {
      await saveData();
      success('Datos guardados correctamente');
    } catch (err) {
      error('Error al guardar los datos');
    }
  };

  return <button onClick={handleSave}>Guardar</button>;
}
```

**ToastContainer Setup:**
The ToastContainer is already included in the App component and doesn't need to be added manually. It automatically displays all active toasts in the top-right corner of the screen.

**Toast Features:**
- Auto-dismiss after duration (default: 5000ms)
- Manual dismiss with close button
- Smooth enter/exit animations
- Stacked display for multiple toasts
- Accessible with ARIA attributes

## Design System

All components use the design system defined in `src/styles/theme.js`, which includes:

- **Colors**: Primary, success, danger, warning, gray palettes
- **Typography**: Font families, sizes, weights, line heights
- **Spacing**: Consistent spacing scale
- **Border Radius**: Consistent border radius values
- **Shadows**: Shadow scale for depth
- **Transitions**: Consistent animation timings
- **Breakpoints**: Responsive design breakpoints
- **Z-Index**: Layering system

## Usage

Import components from the centralized index:

```jsx
import { Button, Input, Card, LoadingSpinner, Badge } from '@/components/ui';
```

Or import individually:

```jsx
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
```

## Accessibility

All components follow accessibility best practices:
- Semantic HTML elements
- ARIA labels and attributes
- Keyboard navigation support
- Focus indicators
- Screen reader support
- Color contrast compliance

## Customization

Components accept a `className` prop for additional styling:

```jsx
<Button className="w-full mt-4">
  Custom Styled Button
</Button>
```
