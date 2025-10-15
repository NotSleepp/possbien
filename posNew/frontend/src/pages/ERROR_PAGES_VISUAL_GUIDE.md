# Error Pages Visual Guide

This guide shows what each error page looks like and when it appears.

## 1. NotFoundPage (404)

**When it appears:** User navigates to a route that doesn't exist

**Visual Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│              404                    │
│         (huge blue text)            │
│                                     │
│         ┌─────────┐                │
│         │   😕    │                │
│         │  (sad)  │                │
│         └─────────┘                │
│      (blue circle bg)              │
│                                     │
│    Página No Encontrada            │
│         (bold title)                │
│                                     │
│  Lo sentimos, la página que        │
│  buscas no existe o ha sido        │
│  movida.                           │
│                                     │
│  [Ir al Inicio] [Volver Atrás]    │
│   (blue btn)    (gray btn)         │
│                                     │
│  ─────────────────────────────     │
│                                     │
│  Si crees que esto es un error,    │
│  por favor contacta al soporte     │
│  técnico.                          │
│                                     │
└─────────────────────────────────────┘
```

**Color Scheme:**
- Number: Blue (#3b82f6)
- Icon background: Light blue (#dbeafe)
- Icon: Blue (#3b82f6)
- Primary button: Blue
- Secondary button: Gray

**Test URL:** `http://localhost:5173/does-not-exist`

---

## 2. ForbiddenPage / AccessDenied (403)

**When it appears:** User tries to access a page without permission

**Visual Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│              403                    │
│         (huge red text)             │
│                                     │
│         ┌─────────┐                │
│         │   🔒    │                │
│         │ (lock)  │                │
│         └─────────┘                │
│       (red circle bg)              │
│                                     │
│      Acceso Denegado               │
│         (bold title)                │
│                                     │
│  No tienes permisos para acceder   │
│  a esta página. Si crees que esto  │
│  es un error, contacta al          │
│  administrador.                    │
│                                     │
│  [Ir al Inicio] [Volver Atrás]    │
│   (blue btn)    (gray btn)         │
│                                     │
│  ─────────────────────────────     │
│                                     │
│  Esta página requiere permisos     │
│  especiales. Contacta al           │
│  administrador si necesitas        │
│  acceso.                           │
│                                     │
└─────────────────────────────────────┘
```

**Color Scheme:**
- Number: Red (#ef4444)
- Icon background: Light red (#fee2e2)
- Icon: Red (#ef4444)
- Primary button: Blue
- Secondary button: Gray

**Test URL:** `http://localhost:5173/settings` (as non-admin)

---

## 3. ErrorPage (Generic)

**When it appears:** Unexpected routing error or generic error

**Visual Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────┐                │
│         │   ⚠️    │                │
│         │(warning)│                │
│         └─────────┘                │
│     (orange circle bg)             │
│                                     │
│      Error Inesperado              │
│         (bold title)                │
│                                     │
│  Ha ocurrido un error inesperado.  │
│  Por favor, intenta de nuevo.      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Detalles del Error (dev):    │ │
│  │ [error stack trace]          │ │
│  │ (only in development)        │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Ir al Inicio] [Volver Atrás]    │
│  [Recargar Página]                 │
│   (blue)  (gray)  (ghost)          │
│                                     │
│  ─────────────────────────────     │
│                                     │
│  Si el problema persiste, por      │
│  favor contacta al soporte         │
│  técnico.                          │
│                                     │
└─────────────────────────────────────┘
```

**Color Scheme:**
- Icon background: Light orange (#fef3c7)
- Icon: Orange (#f59e0b)
- Primary button: Blue
- Secondary button: Gray
- Ghost button: Transparent

**Adapts to error type:**
- 404 error → Shows blue theme (like NotFoundPage)
- 403 error → Shows red theme (like ForbiddenPage)
- Generic → Shows orange theme

---

## 4. ErrorBoundary Fallback

**When it appears:** React component throws an error during rendering

**Visual Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│         ┌─────────┐                │
│         │   ⚠️    │                │
│         │ (alert) │                │
│         └─────────┘                │
│       (red circle bg)              │
│                                     │
│      ¡Algo salió mal!              │
│         (bold title)                │
│                                     │
│  Lo sentimos, ha ocurrido un       │
│  error inesperado. Por favor,      │
│  intenta recargar la página.       │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Detalles del Error (dev):    │ │
│  │ Error: Something went wrong  │ │
│  │ at Component (file.jsx:10)   │ │
│  │ (only in development)        │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Recargar Página]                 │
│  [Intentar de Nuevo]               │
│  [Ir al Inicio]                    │
│   (blue)  (gray)  (ghost)          │
│                                     │
└─────────────────────────────────────┘
```

**Color Scheme:**
- Icon background: Light red (#fee2e2)
- Icon: Red (#ef4444)
- Primary button: Blue
- Secondary button: Gray
- Ghost button: Transparent

**Test:** Create a component that throws an error

---

## Common Elements

All error pages share these common elements:

### 1. Container
- Full screen height (`min-h-screen`)
- Centered content (`flex items-center justify-center`)
- Light gray background (`bg-gray-50`)
- Padding for mobile (`px-4`)

### 2. Content Card
- Max width: `max-w-md` or `max-w-2xl`
- Centered text (`text-center`)
- White background (implicit)

### 3. Icon Circle
- Size: `h-24 w-24`
- Rounded full (`rounded-full`)
- Centered (`mx-auto`)
- Icon inside: `h-12 w-12`

### 4. Typography
- Title: `text-3xl font-bold text-gray-900`
- Message: `text-lg text-gray-600`
- Help text: `text-sm text-gray-500`

### 5. Buttons
- Primary: Blue background, white text
- Secondary: Gray background, dark text
- Ghost: Transparent, gray text
- All have hover states and transitions

### 6. Spacing
- Icon margin bottom: `mb-6`
- Title margin bottom: `mb-3`
- Message margin bottom: `mb-8`
- Button gap: `gap-3`
- Help section: `mt-8 pt-8`

---

## Responsive Behavior

### Mobile (< 640px)
- Buttons stack vertically (`flex-col`)
- Full width buttons
- Smaller icon sizes
- Reduced padding

### Tablet (640px - 1024px)
- Buttons in row (`flex-row`)
- Medium spacing
- Standard icon sizes

### Desktop (> 1024px)
- Buttons in row
- Maximum spacing
- Large icon sizes
- Wider content area

---

## Development vs Production

### Development Mode
```
┌─────────────────────────────────────┐
│  Error Title                        │
│  Error Message                      │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Detalles del Error:          │ │
│  │ Error: Cannot read property  │ │
│  │ at Component (file.jsx:10)   │ │
│  │ at App (App.jsx:5)           │ │
│  └───────────────────────────────┘ │
│                                     │
│  [Buttons]                         │
└─────────────────────────────────────┘
```

### Production Mode
```
┌─────────────────────────────────────┐
│  Error Title                        │
│  Error Message                      │
│                                     │
│  (no error details shown)          │
│                                     │
│  [Buttons]                         │
└─────────────────────────────────────┘
```

---

## Accessibility Features

### Keyboard Navigation
- All buttons are keyboard accessible
- Tab order is logical (top to bottom)
- Focus indicators are visible

### Screen Readers
- Icons have `aria-hidden="true"`
- Semantic HTML structure
- Clear heading hierarchy

### Color Contrast
- Text meets WCAG AA standards
- Buttons have sufficient contrast
- Focus indicators are visible

---

## Testing Checklist

For each error page, verify:

- [ ] Correct error code displays (404, 403)
- [ ] Icon is centered and properly sized
- [ ] Icon has correct background color
- [ ] Title is bold and prominent
- [ ] Message is clear and helpful
- [ ] Buttons are properly styled
- [ ] Button hover states work
- [ ] Layout is centered
- [ ] Background is gray-50
- [ ] Help text is separated by border
- [ ] Responsive on mobile
- [ ] Responsive on tablet
- [ ] Responsive on desktop
- [ ] All buttons navigate correctly
- [ ] Error details show in dev mode
- [ ] Error details hidden in prod mode

---

## Quick Reference

| Page | Code | Color | Icon | Test URL |
|------|------|-------|------|----------|
| NotFound | 404 | Blue | Sad face | `/does-not-exist` |
| Forbidden | 403 | Red | Lock | `/settings` (non-admin) |
| Error | - | Orange | Warning | Trigger error |
| ErrorBoundary | - | Red | Alert | Throw in component |

---

## Component Locations

```
src/
├── components/
│   └── common/
│       ├── ErrorBoundary.jsx
│       └── AccessDenied.jsx (403)
└── pages/
    ├── NotFoundPage.jsx (404)
    ├── ForbiddenPage.jsx (403)
    └── ErrorPage.jsx (generic)
```

---

## Usage in Routes

```jsx
// 404 catch-all
{
  path: '*',
  element: <NotFoundPage />,
}

// Error handling
{
  path: '/dashboard',
  element: <DashboardPage />,
  errorElement: <ErrorPage />,
}

// Permission check
if (!hasPermission) {
  return <AccessDenied />;
}
```

---

This visual guide helps ensure all error pages are consistent and properly implemented.
