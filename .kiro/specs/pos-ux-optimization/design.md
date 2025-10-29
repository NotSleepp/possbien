# Design Document - Optimización UX/UI del Sistema POS

## Overview

Este documento detalla el diseño técnico para transformar el sistema POS actual en la mejor solución del mercado. El diseño se enfoca en optimizar la experiencia de usuario para cajeros y dueños de supermercado, maximizando velocidad, minimizando errores y garantizando accesibilidad.

### Arquitectura Actual

El sistema está construido con:
- **Frontend**: React 19, Vite, Tailwind CSS 4
- **State Management**: Zustand para estado global, TanStack Query para estado del servidor
- **Routing**: React Router DOM 7
- **UI Components**: Componentes personalizados con Tailwind
- **Icons**: React Icons
- **Charts**: Recharts para visualizaciones
- **Validation**: Zod para validación de esquemas

### Principios de Diseño

1. **Touch-First**: Diseñar primero para pantallas táctiles, luego adaptar para mouse/teclado
2. **Speed-Optimized**: Cada interacción debe completarse en < 300ms
3. **Error-Preventive**: Validar y guiar antes de que ocurran errores
4. **Accessible**: WCAG 2.1 AA compliance mínimo
5. **Progressive Enhancement**: Funcionalidad básica offline, features avanzadas online
6. **Responsive**: Adaptable desde tablets hasta monitores grandes

## Architecture

### Component Hierarchy

```
App
├── ThemeProvider (dark/light mode)
├── QueryClientProvider (TanStack Query)
├── Router
│   ├── MainLayout
│   │   ├── Header (con theme toggle, user info)
│   │   ├── Sidebar (navegación)
│   │   └── PageTransition
│   │       ├── SalesPage (POS Interface)
│   │       ├── DashboardPage (Owner metrics)
│   │       ├── ProductsPage
│   │       ├── InventoryPage
│   │       └── SettingsPage
│   └── ToastContainer (notificaciones globales)
└── ErrorBoundary (manejo de errores)
```

### State Management Strategy

**Zustand Stores:**
- `useAuthStore`: Autenticación y usuario actual
- `useToastStore`: Sistema de notificaciones
- `useUIStore`: Estado de UI (sidebar, modals, theme)
- `usePOSStore` (nuevo): Estado específico del POS (carrito, método de pago, cliente)

**TanStack Query:**
- Productos, ventas, inventario (datos del servidor)
- Cache optimista para operaciones rápidas
- Invalidación automática después de mutaciones

### Performance Strategy

1. **Code Splitting**: Lazy loading de rutas no críticas
2. **Virtual Scrolling**: Para listas de productos grandes (react-window)
3. **Debouncing**: Búsquedas con 150ms debounce
4. **Optimistic Updates**: UI actualiza antes de confirmación del servidor
5. **Service Worker**: Cache de assets estáticos y datos críticos
6. **Image Optimization**: Lazy loading, WebP format, placeholders

## Components and Interfaces

### 1. Enhanced CashRegister Component

**Ubicación**: `src/features/cash-register/components/CashRegister.jsx`

**Mejoras Principales:**

- Layout optimizado: Grid 2/3 productos, 1/3 carrito en desktop
- Búsqueda mejorada con resultados instantáneos
- Teclado numérico virtual para cantidades
- Shortcuts de teclado (F1-F12 para productos frecuentes)
- Soporte para escáner de código de barras

**Props Interface:**
```typescript
interface CashRegisterProps {
  onSaleComplete?: (sale: Sale) => void;
  enableSound?: boolean;
  enableKeyboardShortcuts?: boolean;
}
```

### 2. NumericKeypad Component (Nuevo)

**Ubicación**: `src/features/cash-register/components/NumericKeypad.jsx`

**Propósito**: Teclado numérico táctil para ingresar cantidades y montos

**Features:**
- Botones grandes (60x60px mínimo)
- Feedback táctil visual
- Soporte para decimales
- Botones de acción rápida (Clear, Backspace, Enter)
- Animaciones suaves en press

**Props Interface:**
```typescript
interface NumericKeypadProps {
  value: string;
  onChange: (value: string) => void;
  onEnter?: () => void;
  maxLength?: number;
  allowDecimals?: boolean;
  size?: 'sm' | 'md' | 'lg';
}
```

### 3. ProductGrid Component (Mejorado)

**Ubicación**: `src/features/cash-register/components/ProductGrid.jsx`

**Mejoras:**
- Virtual scrolling para listas grandes
- Grid responsive (2-6 columnas según viewport)
- Cards táctiles con feedback inmediato
- Badges visuales para promociones y stock bajo
- Imágenes optimizadas con lazy loading

**Props Interface:**
```typescript
interface ProductGridProps {
  products: Product[];
  onProductSelect: (product: Product) => void;
  isLoading?: boolean;
  columns?: number;
  showStock?: boolean;
}
```

### 4. ShoppingCart Component (Mejorado)

**Ubicación**: `src/features/cash-register/components/ShoppingCart.jsx`

**Mejoras:**
- Lista optimizada con animaciones de entrada/salida
- Controles de cantidad inline con +/- táctiles
- Swipe-to-delete en móvil
- Resumen de totales sticky en bottom
- Validación de stock en tiempo real

**Props Interface:**
```typescript
interface ShoppingCartProps {
  items: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onClearCart: () => void;
  showTax?: boolean;
  taxRate?: number;
}
```

### 5. PaymentSelector Component (Nuevo)

**Ubicación**: `src/features/cash-register/components/PaymentSelector.jsx`

**Propósito**: Selector visual de métodos de pago con calculadora de cambio

**Features:**
- Botones grandes con iconos para cada método
- Calculadora de cambio para efectivo
- Soporte para pago mixto (múltiples métodos)
- Validación de montos
- Integración con terminales de pago (futuro)

**Props Interface:**
```typescript
interface PaymentSelectorProps {
  total: number;
  onPaymentComplete: (payment: Payment) => void;
  availableMethods: PaymentMethod[];
  allowSplit?: boolean;
}
```

### 6. SearchBar Component (Mejorado)

**Ubicación**: `src/shared/components/forms/SearchBar.jsx`

**Mejoras:**
- Búsqueda incremental con debounce 150ms
- Resultados en dropdown con navegación por teclado
- Highlight de términos coincidentes
- Búsqueda por múltiples campos (nombre, código, barcode)
- Historial de búsquedas recientes
- Soporte para escáner de código de barras

**Props Interface:**
```typescript
interface SearchBarProps {
  onSearch: (term: string) => void;
  onResultSelect?: (result: any) => void;
  placeholder?: string;
  showResults?: boolean;
  autoFocus?: boolean;
  enableBarcode?: boolean;
}
```

### 7. TouchButton Component (Nuevo)

**Ubicación**: `src/shared/components/ui/TouchButton.jsx`

**Propósito**: Botón optimizado para interacción táctil

**Features:**
- Tamaño mínimo 48x48px (WCAG)
- Feedback visual inmediato (< 100ms)
- Ripple effect en tap
- Soporte para long-press
- Estados: default, hover, active, disabled, loading
- Variantes: primary, secondary, danger, success

**Props Interface:**
```typescript
interface TouchButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost';
  icon?: ReactNode;
  isLoading?: boolean;
  onLongPress?: () => void;
  hapticFeedback?: boolean;
}
```

### 8. Toast System (Mejorado)

**Ubicación**: `src/shared/components/ui/Toast.jsx` y `src/store/useToastStore.js`

**Mejoras:**
- Posicionamiento configurable (top-right, bottom-center, etc.)
- Animaciones suaves de entrada/salida
- Soporte para acciones (undo, retry)
- Queue management (máximo 3 toasts visibles)
- Sonidos opcionales por tipo
- Accesibilidad con ARIA live regions

**Store Interface:**
```typescript
interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
}
```

### 9. OwnerDashboard Component (Mejorado)

**Ubicación**: `src/pages/DashboardPage.jsx`

**Mejoras:**
- Métricas en tiempo real con auto-refresh
- Gráficos interactivos con Recharts
- Filtros rápidos (hoy, semana, mes, custom)
- Alertas visuales para stock bajo
- Comparativas con períodos anteriores
- Export de datos (CSV, PDF)

**Sections:**
- Sales Summary (ventas del día, comparativa)
- Top Products (productos más vendidos)
- Low Stock Alerts (productos con stock bajo)
- Sales Chart (gráfico de ventas por hora/día)
- Recent Transactions (últimas ventas)
- Quick Actions (acciones rápidas)

### 10. DiscountModal Component (Nuevo)

**Ubicación**: `src/features/cash-register/components/DiscountModal.jsx`

**Propósito**: Modal para aplicar descuentos manuales

**Features:**
- Selector de tipo (porcentaje o monto fijo)
- Teclado numérico integrado
- Previsualización del total con descuento
- Validación de permisos (requiere autorización para descuentos > X%)
- Historial de descuentos aplicados

**Props Interface:**
```typescript
interface DiscountModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTotal: number;
  onApplyDiscount: (discount: Discount) => void;
  requiresAuthorization?: boolean;
}
```

## Data Models

### Cart Item Model

```typescript
interface CartItem {
  id: string;
  productId: string;
  nombre: string;
  codigo: string;
  precio_venta: number;
  quantity: number;
  subtotal: number;
  discount?: Discount;
  tax?: number;
  stock_available: number;
}
```

### Sale Model

```typescript
interface Sale {
  id?: string;
  items: CartItem[];
  cliente_info?: CustomerInfo;
  payment: Payment;
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  fecha_venta: string;
  estado: 'COMPLETADA' | 'PENDIENTE' | 'ANULADA';
  id_empresa: string;
  id_usuario: string;
  id_caja?: string;
}
```

### Payment Model

```typescript
interface Payment {
  method: 'cash' | 'card' | 'transfer' | 'mixed';
  amount: number;
  received?: number; // Para efectivo
  change?: number; // Para efectivo
  splits?: PaymentSplit[]; // Para pago mixto
  reference?: string; // Referencia de transacción
}

interface PaymentSplit {
  method: string;
  amount: number;
}
```

### Discount Model

```typescript
interface Discount {
  type: 'percentage' | 'fixed';
  value: number;
  reason?: string;
  authorized_by?: string;
  applied_at: string;
}
```

### Customer Info Model

```typescript
interface CustomerInfo {
  name?: string;
  phone?: string;
  email?: string;
  document?: string;
  address?: string;
}
```

### Product Model (Extended)

```typescript
interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  codigo: string;
  codigo_barras?: string;
  codigo_interno?: string;
  sku?: string;
  precio_venta: number;
  precio_compra?: number;
  stock_actual: number;
  stock_minimo: number;
  categoria?: string;
  imagen_url?: string;
  activo: boolean;
  tiene_promocion?: boolean;
  promocion?: Promotion;
}

interface Promotion {
  type: 'percentage' | 'fixed' | 'bogo' | 'volume';
  value: number;
  description: string;
  valid_from: string;
  valid_to: string;
}
```

## Error Handling

### Error Types

1. **Network Errors**: Sin conexión, timeout
2. **Validation Errors**: Datos inválidos, stock insuficiente
3. **Authorization Errors**: Permisos insuficientes
4. **Business Logic Errors**: Descuento excede límite, caja cerrada
5. **System Errors**: Errores inesperados del servidor

### Error Handling Strategy

**Toast Notifications:**
- Errores críticos: Toast rojo con acción de retry
- Advertencias: Toast amarillo con opción de continuar
- Información: Toast azul con auto-dismiss
- Éxito: Toast verde con auto-dismiss

**Inline Validation:**
- Validación en tiempo real en inputs
- Mensajes específicos debajo del campo
- Prevención de submit si hay errores

**Error Boundaries:**
- Captura errores de React
- Fallback UI con opción de reload
- Logging automático para debugging

**Offline Handling:**
- Detección automática de pérdida de conexión
- Banner persistente indicando modo offline
- Queue de operaciones pendientes
- Sincronización automática al reconectar

### Error Recovery Patterns

```typescript
// Retry with exponential backoff
const retryWithBackoff = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
};

// Optimistic update with rollback
const optimisticUpdate = async (updateFn, rollbackFn) => {
  try {
    updateFn(); // Update UI immediately
    await apiCall(); // Confirm with server
  } catch (error) {
    rollbackFn(); // Revert UI on error
    throw error;
  }
};
```

## Testing Strategy

### Unit Tests

**Coverage Target**: 80% mínimo

**Priority Components:**
- Utility functions (formatCurrency, calculateTax, etc.)
- Store actions (Zustand)
- Validation functions
- Data transformations

**Tools**: Vitest, React Testing Library

### Integration Tests

**Focus Areas:**
- Flujo completo de venta
- Búsqueda y selección de productos
- Aplicación de descuentos
- Procesamiento de pagos
- Manejo de errores

### E2E Tests

**Critical Paths:**
- Venta simple (1 producto, efectivo)
- Venta múltiple (varios productos, tarjeta)
- Venta con descuento
- Cancelación de venta
- Búsqueda de productos

**Tools**: Playwright o Cypress

### Performance Tests

**Metrics:**
- Time to Interactive (TTI) < 2s
- First Contentful Paint (FCP) < 1s
- Largest Contentful Paint (LCP) < 2.5s
- Cumulative Layout Shift (CLS) < 0.1
- First Input Delay (FID) < 100ms

**Tools**: Lighthouse, WebPageTest

### Accessibility Tests

**Compliance**: WCAG 2.1 AA

**Automated Tools:**
- axe-core
- WAVE
- Lighthouse accessibility audit

**Manual Testing:**
- Keyboard navigation
- Screen reader (NVDA, JAWS)
- Color contrast
- Touch target sizes

## UI/UX Design Specifications

### Touch Targets

**Minimum Sizes:**
- Botones primarios: 60x60px
- Botones secundarios: 48x48px
- Botones terciarios: 44x44px
- Spacing entre targets: 8px mínimo

### Typography

**Font Stack**: System fonts para mejor rendimiento
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

**Scale:**
- Heading 1: 2rem (32px) - Títulos principales
- Heading 2: 1.5rem (24px) - Secciones
- Heading 3: 1.25rem (20px) - Subsecciones
- Body: 1rem (16px) - Texto general
- Small: 0.875rem (14px) - Texto secundario
- Tiny: 0.75rem (12px) - Labels, badges

**Line Height:**
- Headings: 1.2
- Body: 1.5
- Buttons: 1

### Color System

**Semantic Colors** (usando variables CSS de Tailwind):
- Primary: Acciones principales, botones CTA
- Secondary: Acciones secundarias
- Success: Confirmaciones, ventas completadas
- Warning: Advertencias, stock bajo
- Error: Errores, cancelaciones
- Info: Información general

**Contrast Ratios:**
- Text on background: 4.5:1 mínimo
- Large text: 3:1 mínimo
- UI components: 3:1 mínimo

### Spacing System

**Base Unit**: 4px (0.25rem)

**Scale:**
- xs: 4px (0.25rem)
- sm: 8px (0.5rem)
- md: 16px (1rem)
- lg: 24px (1.5rem)
- xl: 32px (2rem)
- 2xl: 48px (3rem)

### Animation Guidelines

**Durations:**
- Micro-interactions: 100-200ms
- Transitions: 200-300ms
- Complex animations: 300-500ms

**Easing:**
- Enter: ease-out
- Exit: ease-in
- Move: ease-in-out

**Principles:**
- Prefer transform over position changes
- Use will-change for performance
- Reduce motion for accessibility (prefers-reduced-motion)

### Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Tablets portrait */
md: 768px   /* Tablets landscape */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

**POS Specific:**
- Mobile (< 768px): Single column, full-screen cart
- Tablet (768px - 1024px): 2 columns, side cart
- Desktop (> 1024px): 3 columns, optimized layout

## Keyboard Shortcuts

**Global:**
- `Ctrl/Cmd + K`: Focus search
- `Ctrl/Cmd + N`: New sale
- `Ctrl/Cmd + P`: Process payment
- `Ctrl/Cmd + D`: Apply discount
- `Esc`: Close modal/cancel action
- `F1`: Help/shortcuts guide

**Product Selection:**
- `F1-F12`: Quick add favorite products
- `Enter`: Add selected product to cart
- `Arrow keys`: Navigate product grid
- `+/-`: Increase/decrease quantity

**Cart Management:**
- `Delete`: Remove selected item
- `Ctrl/Cmd + Backspace`: Clear cart
- `Tab`: Navigate cart items

**Payment:**
- `1`: Cash payment
- `2`: Card payment
- `3`: Transfer payment
- `Enter`: Confirm payment

## Accessibility Features

### Keyboard Navigation

- Logical tab order
- Visible focus indicators
- Skip links for main content
- Keyboard shortcuts documented

### Screen Reader Support

- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content
- Meaningful alt text for images

### Visual Accessibility

- High contrast mode support
- Scalable text (up to 200%)
- Color-blind friendly palette
- Clear visual hierarchy

### Motor Accessibility

- Large touch targets (48x48px min)
- No time-based interactions required
- Alternative input methods supported
- Undo/redo functionality

## Performance Optimizations

### Code Splitting

```javascript
// Route-based splitting
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Component-based splitting
const Charts = lazy(() => import('./components/Charts'));
```

### Image Optimization

- WebP format with fallback
- Lazy loading with Intersection Observer
- Responsive images with srcset
- Placeholder blur effect

### Data Fetching

```javascript
// Prefetch on hover
const prefetchProduct = (productId) => {
  queryClient.prefetchQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId)
  });
};

// Stale-while-revalidate
useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

### Virtual Scrolling

```javascript
// For large product lists
import { FixedSizeGrid } from 'react-window';

<FixedSizeGrid
  columnCount={columns}
  columnWidth={200}
  height={600}
  rowCount={Math.ceil(products.length / columns)}
  rowHeight={250}
  width={1000}
>
  {ProductCell}
</FixedSizeGrid>
```

## Sound Design (Optional)

### Audio Feedback

**Events:**
- Product added: Soft "beep" (200ms)
- Sale completed: Success chime (500ms)
- Error: Alert tone (300ms)
- Barcode scan: Scanner beep (150ms)

**Implementation:**
```javascript
const playSound = (soundType) => {
  if (!settings.soundEnabled) return;
  
  const audio = new Audio(`/sounds/${soundType}.mp3`);
  audio.volume = settings.soundVolume;
  audio.play().catch(console.error);
};
```

**Settings:**
- Enable/disable sounds
- Volume control (0-100%)
- Individual sound toggles

## Offline Support

### Service Worker Strategy

**Cache First:**
- Static assets (JS, CSS, images)
- UI components
- Icons and fonts

**Network First:**
- Product data
- Sales data
- User data

**Offline Queue:**
- Queue sales when offline
- Sync when connection restored
- Show pending operations count

### Implementation

```javascript
// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}

// Offline detection
window.addEventListener('online', handleOnline);
window.addEventListener('offline', handleOffline);

// Queue management
const offlineQueue = {
  add: (operation) => {
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    queue.push(operation);
    localStorage.setItem('offlineQueue', JSON.stringify(queue));
  },
  process: async () => {
    const queue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
    for (const operation of queue) {
      await processOperation(operation);
    }
    localStorage.removeItem('offlineQueue');
  }
};
```

## Barcode Scanner Integration

### Scanner Detection

```javascript
let barcodeBuffer = '';
let lastKeyTime = Date.now();

document.addEventListener('keypress', (e) => {
  const currentTime = Date.now();
  
  // Scanner types very fast (< 50ms between keys)
  if (currentTime - lastKeyTime < 50) {
    barcodeBuffer += e.key;
  } else {
    barcodeBuffer = e.key;
  }
  
  lastKeyTime = currentTime;
  
  // Enter key signals end of barcode
  if (e.key === 'Enter' && barcodeBuffer.length > 3) {
    handleBarcodeScanned(barcodeBuffer);
    barcodeBuffer = '';
  }
});
```

### Barcode Formats Supported

- EAN-13 (European Article Number)
- UPC-A (Universal Product Code)
- Code 128
- QR Codes (for customer loyalty)

## Print Integration

### Receipt Printer

**Protocol**: ESC/POS (Epson Standard Code for Point of Sale)

**Connection Methods:**
- USB
- Network (IP)
- Bluetooth

**Implementation:**
```javascript
const printReceipt = async (sale) => {
  const printer = await navigator.usb.requestDevice({
    filters: [{ vendorId: 0x04b8 }] // Epson
  });
  
  const receipt = formatReceipt(sale);
  await printer.transferOut(1, receipt);
};

const formatReceipt = (sale) => {
  // ESC/POS commands
  const ESC = '\x1B';
  const GS = '\x1D';
  
  let receipt = '';
  receipt += ESC + '@'; // Initialize
  receipt += ESC + 'a' + '\x01'; // Center align
  receipt += GS + '!' + '\x11'; // Double size
  receipt += 'SUPERMERCADO XYZ\n';
  receipt += ESC + 'a' + '\x00'; // Left align
  receipt += GS + '!' + '\x00'; // Normal size
  // ... format items, totals, etc.
  receipt += ESC + 'd' + '\x03'; // Feed 3 lines
  receipt += GS + 'V' + '\x00'; // Cut paper
  
  return new TextEncoder().encode(receipt);
};
```

## Security Considerations

### Authentication

- JWT tokens with refresh mechanism
- Session timeout after inactivity (configurable)
- Role-based access control (RBAC)
- Secure password requirements

### Data Protection

- HTTPS only in production
- Sensitive data encryption
- No PII in localStorage
- Secure cookie flags (httpOnly, secure, sameSite)

### Authorization

**Roles:**
- Cashier: Sales operations only
- Supervisor: Sales + discounts + reports
- Manager: All operations + settings
- Owner: Full access

**Permission Checks:**
```javascript
const canApplyDiscount = (user, discountPercent) => {
  if (discountPercent <= 5) return true;
  if (discountPercent <= 15 && user.role === 'supervisor') return true;
  if (user.role === 'manager' || user.role === 'owner') return true;
  return false;
};
```

### Audit Trail

- Log all sales transactions
- Track user actions (discounts, cancellations)
- Timestamp all operations
- Immutable transaction records

## Internationalization (i18n)

### Language Support

**Initial**: Español (Colombia)
**Future**: English, Portuguese

### Implementation

```javascript
// Using react-i18next
import { useTranslation } from 'react-i18next';

const Component = () => {
  const { t } = useTranslation();
  
  return (
    <button>{t('pos.addToCart')}</button>
  );
};
```

### Currency Formatting

```javascript
const formatCurrency = (amount, locale = 'es-CO', currency = 'COP') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
```

### Date/Time Formatting

```javascript
const formatDateTime = (date, locale = 'es-CO') => {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};
```

## Configuration Management

### Settings Structure

```typescript
interface POSSettings {
  // Display
  theme: 'light' | 'dark' | 'auto';
  fontSize: 'sm' | 'md' | 'lg';
  
  // Behavior
  soundEnabled: boolean;
  soundVolume: number; // 0-100
  autoFocusSearch: boolean;
  confirmBeforeDelete: boolean;
  
  // Business
  taxRate: number;
  currency: string;
  locale: string;
  
  // Hardware
  printerEnabled: boolean;
  printerIP?: string;
  barcodeScanner: boolean;
  
  // Security
  sessionTimeout: number; // minutes
  requireAuthForDiscount: boolean;
  maxDiscountPercent: number;
}
```

### Settings Persistence

```javascript
// Save to localStorage
const saveSettings = (settings) => {
  localStorage.setItem('posSettings', JSON.stringify(settings));
};

// Load from localStorage
const loadSettings = () => {
  const saved = localStorage.getItem('posSettings');
  return saved ? JSON.parse(saved) : defaultSettings;
};
```

## Migration Strategy

### Phase 1: Foundation (Week 1-2)
- Implement new component library (TouchButton, NumericKeypad)
- Update theme system with new color tokens
- Setup performance monitoring

### Phase 2: Core POS (Week 3-4)
- Refactor CashRegister component
- Implement enhanced search
- Add keyboard shortcuts
- Optimize cart management

### Phase 3: Payment & Checkout (Week 5)
- Build PaymentSelector component
- Implement discount system
- Add receipt printing

### Phase 4: Dashboard & Reports (Week 6)
- Enhance owner dashboard
- Add real-time metrics
- Implement data export

### Phase 5: Polish & Testing (Week 7-8)
- Accessibility audit and fixes
- Performance optimization
- E2E testing
- User acceptance testing

### Phase 6: Deployment (Week 9)
- Staging deployment
- Training materials
- Production rollout
- Monitoring and support

## Success Metrics

### Performance Metrics
- Average sale completion time: < 30 seconds
- Search response time: < 200ms
- Page load time: < 2 seconds
- Error rate: < 0.1%

### User Experience Metrics
- User satisfaction score: > 4.5/5
- Task completion rate: > 95%
- Error recovery rate: > 90%
- Training time for new users: < 2 hours

### Business Metrics
- Transactions per hour: +30%
- Average transaction value: +15%
- Customer wait time: -40%
- Cashier errors: -60%

## Conclusion

Este diseño proporciona una base sólida para transformar el sistema POS en la mejor solución del mercado. El enfoque en velocidad, accesibilidad y prevención de errores garantizará una experiencia superior tanto para cajeros como para dueños de supermercado.

Las optimizaciones propuestas aprovechan las tecnologías modernas (React 19, Tailwind CSS 4, TanStack Query) mientras mantienen la compatibilidad con hardware estándar de POS (impresoras, escáneres).

La implementación incremental por fases permite validar cada mejora antes de continuar, minimizando riesgos y permitiendo ajustes basados en feedback real de usuarios.
