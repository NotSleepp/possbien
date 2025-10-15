# Toast Notification System - Visual Guide

## Overview
This guide provides visual representations and usage examples for the toast notification system.

---

## Toast Variants

### 1. Success Toast
```
┌─────────────────────────────────────────────────┐
│ ✓  Datos guardados correctamente            × │
└─────────────────────────────────────────────────┘
```
**Colors:**
- Background: Light green (#f0fdf4)
- Border: Green (#22c55e)
- Text: Dark green (#166534)
- Icon: Green checkmark

**Use Cases:**
- Successful login
- Data saved successfully
- Operation completed
- Item created/updated
- File uploaded

---

### 2. Error Toast
```
┌─────────────────────────────────────────────────┐
│ ⊗  Error al procesar la solicitud           × │
└─────────────────────────────────────────────────┘
```
**Colors:**
- Background: Light red (#fef2f2)
- Border: Red (#ef4444)
- Text: Dark red (#991b1b)
- Icon: Red X circle

**Use Cases:**
- Login failed
- Validation errors
- Network errors
- Permission denied
- Operation failed

---

### 3. Warning Toast
```
┌─────────────────────────────────────────────────┐
│ ⚠  Tu sesión expirará en 5 minutos          × │
└─────────────────────────────────────────────────┘
```
**Colors:**
- Background: Light yellow (#fefce8)
- Border: Yellow (#eab308)
- Text: Dark yellow (#854d0e)
- Icon: Yellow alert triangle

**Use Cases:**
- Session expiring soon
- Unsaved changes
- Low stock warning
- Approaching limits
- Deprecation notices

---

### 4. Info Toast
```
┌─────────────────────────────────────────────────┐
│ ℹ  Nueva actualización disponible           × │
└─────────────────────────────────────────────────┘
```
**Colors:**
- Background: Light blue (#eff6ff)
- Border: Blue (#3b82f6)
- Text: Dark blue (#1e3a8a)
- Icon: Blue info circle

**Use Cases:**
- Logout confirmation
- General information
- Tips and hints
- Feature announcements
- Status updates

---

## Toast Anatomy

```
┌─────────────────────────────────────────────────┐
│ [Icon] [Message Text]                    [Close]│
│   │         │                                │   │
│   │         │                                │   │
│   │         └─ Main message content         │   │
│   │                                          │   │
│   └─ Variant-specific icon                  │   │
│                                              │   │
│                                              │   │
│                      Close button (X) ──────┘   │
└─────────────────────────────────────────────────┘
│                                                 │
└─ 4px colored left border                       │
```

**Dimensions:**
- Min Width: 320px
- Max Width: 448px
- Padding: 16px
- Border Left: 4px
- Border Radius: 8px
- Shadow: Large (0 10px 15px rgba(0,0,0,0.1))

---

## Toast Positioning

### Desktop View
```
┌─────────────────────────────────────────────────┐
│                                    [Toast 1]    │
│                                    [Toast 2]    │
│                                    [Toast 3]    │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
│                                                 │
└─────────────────────────────────────────────────┘
```
- Position: Fixed top-right
- Top: 16px
- Right: 16px
- Z-Index: 50

### Mobile View
```
┌─────────────────────────┐
│      [Toast 1]          │
│      [Toast 2]          │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
│                         │
└─────────────────────────┘
```
- Position: Fixed top-right
- Top: 16px
- Right: 16px
- Adjusts width for smaller screens

---

## Toast Stacking

### Multiple Toasts
```
┌─────────────────────────────────────────────────┐
│                                                 │
│                    ┌─────────────────────────┐  │
│                    │ ✓ Item 1 saved      × │  │
│                    └─────────────────────────┘  │
│                           ↓ 12px gap            │
│                    ┌─────────────────────────┐  │
│                    │ ⊗ Item 2 failed     × │  │
│                    └─────────────────────────┘  │
│                           ↓ 12px gap            │
│                    ┌─────────────────────────┐  │
│                    │ ℹ Processing...     × │  │
│                    └─────────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
```
- Vertical stacking
- 12px gap between toasts
- Newest on top
- Independent dismissal

---

## Animations

### Enter Animation
```
Frame 1:  [Off screen right] →
Frame 2:      [Sliding in] →
Frame 3:         [Visible]
```
- Duration: 300ms
- Easing: ease-in-out
- Transform: translateX(100%) → translateX(0)
- Opacity: 0 → 1

### Exit Animation
```
Frame 1:  [Visible]
Frame 2:  [Sliding out] →
Frame 3:  [Off screen right] →
```
- Duration: 300ms
- Easing: ease-in-out
- Transform: translateX(0) → translateX(100%)
- Opacity: 1 → 0

---

## Usage Examples

### Example 1: Login Success
```javascript
import { useToastStore } from '@/store/useToastStore';

function LoginPage() {
  const { success } = useToastStore();

  const handleLogin = async () => {
    try {
      await login(credentials);
      success('¡Inicio de sesión exitoso! Bienvenido.');
      navigate('/dashboard');
    } catch (error) {
      // Handle error
    }
  };
}
```

**Result:**
```
┌─────────────────────────────────────────────────┐
│ ✓  ¡Inicio de sesión exitoso! Bienvenido.  × │
└─────────────────────────────────────────────────┘
```

---

### Example 2: Form Validation Error
```javascript
import { useToastStore } from '@/store/useToastStore';

function ProductForm() {
  const { error } = useToastStore();

  const handleSubmit = async (data) => {
    if (!data.name) {
      error('El nombre del producto es requerido');
      return;
    }
    // Continue with submission
  };
}
```

**Result:**
```
┌─────────────────────────────────────────────────┐
│ ⊗  El nombre del producto es requerido      × │
└─────────────────────────────────────────────────┘
```

---

### Example 3: Network Error
```javascript
import { useToastStore } from '@/store/useToastStore';

function DataFetcher() {
  const { error } = useToastStore();

  const fetchData = async () => {
    try {
      const response = await api.get('/data');
      return response.data;
    } catch (err) {
      if (!err.response) {
        error('No se pudo conectar con el servidor');
      }
    }
  };
}
```

**Result:**
```
┌─────────────────────────────────────────────────┐
│ ⊗  No se pudo conectar con el servidor      × │
└─────────────────────────────────────────────────┘
```

---

### Example 4: Session Warning
```javascript
import { useToastStore } from '@/store/useToastStore';

function SessionMonitor() {
  const { warning } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      warning('Tu sesión expirará en 5 minutos', 10000);
    }, SESSION_WARNING_TIME);

    return () => clearTimeout(timer);
  }, []);
}
```

**Result:**
```
┌─────────────────────────────────────────────────┐
│ ⚠  Tu sesión expirará en 5 minutos          × │
└─────────────────────────────────────────────────┘
```

---

### Example 5: Logout Confirmation
```javascript
import { useToastStore } from '@/store/useToastStore';

function Sidebar() {
  const { info } = useToastStore();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    info('Sesión cerrada correctamente. ¡Hasta pronto!');
    navigate('/login');
  };
}
```

**Result:**
```
┌─────────────────────────────────────────────────┐
│ ℹ  Sesión cerrada correctamente. ¡Hasta...  × │
└─────────────────────────────────────────────────┘
```

---

## Custom Duration Examples

### Quick Message (2 seconds)
```javascript
success('Copiado al portapapeles', 2000);
```

### Standard Message (5 seconds - default)
```javascript
success('Producto guardado correctamente');
// or
success('Producto guardado correctamente', 5000);
```

### Long Message (10 seconds)
```javascript
warning('Hay cambios sin guardar. Asegúrate de guardar antes de salir.', 10000);
```

### Persistent Message (manual close only)
```javascript
error('Error crítico del sistema. Contacta al administrador.', 0);
```

---

## Responsive Behavior

### Desktop (> 1024px)
```
┌─────────────────────────────────────────────────┐
│                                    [Toast]      │
│                                    (448px max)  │
└─────────────────────────────────────────────────┘
```

### Tablet (768px - 1024px)
```
┌─────────────────────────────────────────────────┐
│                              [Toast]            │
│                              (adjusts)          │
└─────────────────────────────────────────────────┘
```

### Mobile (< 768px)
```
┌─────────────────────────┐
│    [Toast]              │
│    (320px min)          │
│    (full width - 32px)  │
└─────────────────────────┘
```

---

## Accessibility Features

### Screen Reader Announcement
```
[Toast appears]
Screen Reader: "Alert: Inicio de sesión exitoso. Bienvenido."
```

### Keyboard Navigation
```
[Toast appears]
User presses Tab → Focus moves to close button
User presses Enter → Toast closes
```

### ARIA Attributes
```html
<div role="alert" aria-live="polite">
  <p>Message content</p>
  <button aria-label="Close notification">×</button>
</div>
```

---

## Best Practices

### ✅ DO
- Keep messages concise (< 100 characters)
- Use appropriate variant for context
- Provide manual close for important messages
- Use consistent language and tone
- Test with screen readers

### ❌ DON'T
- Show too many toasts simultaneously (max 3-4)
- Use toasts for critical errors (use modals instead)
- Make messages too long
- Rely solely on color to convey meaning
- Use toasts for permanent information

---

## Common Patterns

### Pattern 1: CRUD Operations
```javascript
// Create
success('Producto creado correctamente');

// Update
success('Producto actualizado correctamente');

// Delete
success('Producto eliminado correctamente');

// Error
error('Error al guardar el producto');
```

### Pattern 2: Authentication
```javascript
// Login success
success('¡Inicio de sesión exitoso! Bienvenido.');

// Login error
error('Usuario o contraseña incorrectos');

// Logout
info('Sesión cerrada correctamente. ¡Hasta pronto!');

// Session expired
warning('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
```

### Pattern 3: Network Operations
```javascript
// Loading (with manual dismiss)
const toastId = info('Cargando datos...', 0);

// Success (remove loading, show success)
removeToast(toastId);
success('Datos cargados correctamente');

// Error (remove loading, show error)
removeToast(toastId);
error('Error al cargar los datos');
```

---

## Integration with Other Components

### With Forms
```javascript
function ProductForm() {
  const { success, error } = useToastStore();

  const handleSubmit = async (data) => {
    try {
      await saveProduct(data);
      success('Producto guardado correctamente');
      resetForm();
    } catch (err) {
      error('Error al guardar el producto');
    }
  };
}
```

### With Modals
```javascript
function DeleteModal({ onConfirm }) {
  const { success, error } = useToastStore();

  const handleDelete = async () => {
    try {
      await deleteItem();
      success('Elemento eliminado correctamente');
      onClose();
    } catch (err) {
      error('Error al eliminar el elemento');
    }
  };
}
```

### With API Calls
```javascript
function DataTable() {
  const { success, error } = useToastStore();

  const refreshData = async () => {
    try {
      const data = await fetchData();
      setData(data);
      success('Datos actualizados');
    } catch (err) {
      error('Error al actualizar los datos');
    }
  };
}
```

---

## Troubleshooting

### Toast Not Appearing
1. Check ToastContainer is in App.jsx
2. Verify useToastStore import is correct
3. Check browser console for errors
4. Verify z-index is not being overridden

### Toast Not Auto-Dismissing
1. Check duration parameter is set
2. Verify duration is > 0
3. Check for JavaScript errors
4. Verify setTimeout is working

### Multiple Toasts Overlapping
1. Check ToastContainer has proper flex-col class
2. Verify gap-3 class is applied
3. Check for CSS conflicts
4. Verify pointer-events classes

### Animation Not Smooth
1. Check browser performance
2. Verify transition classes are applied
3. Check for CSS conflicts
4. Test in different browsers

---

## Summary

The toast notification system provides a consistent, accessible, and user-friendly way to display temporary messages. Use the appropriate variant for each context, keep messages concise, and ensure proper integration with your application's workflows.

**Key Points:**
- 4 variants: success, error, warning, info
- Auto-dismiss with configurable duration
- Manual close option
- Smooth animations
- Fully accessible
- Responsive design
- Easy to integrate
