# Layout Visual Guide

## Desktop Layout (≥768px)

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  ┌──────────┐  ┌──────────────────────────────────────┐   │
│  │          │  │  Header (sticky)                      │   │
│  │          │  │  ┌────────┐              ┌─────────┐ │   │
│  │          │  │  │ [≡]    │  Dashboard   │ [👤 ▼] │ │   │
│  │          │  │  └────────┘              └─────────┘ │   │
│  │          │  └──────────────────────────────────────┘   │
│  │          │  ┌──────────────────────────────────────┐   │
│  │  Sidebar │  │                                      │   │
│  │  (fixed) │  │  Main Content Area                   │   │
│  │          │  │  (scrollable)                        │   │
│  │  • Home  │  │                                      │   │
│  │  • Dash  │  │  ┌────────┐ ┌────────┐ ┌────────┐  │   │
│  │  • Prod  │  │  │ Card 1 │ │ Card 2 │ │ Card 3 │  │   │
│  │          │  │  └────────┘ └────────┘ └────────┘  │   │
│  │          │  │                                      │   │
│  │          │  │  Content continues...                │   │
│  │          │  │                                      │   │
│  │  ┌────┐  │  │                                      │   │
│  │  │User│  │  │                                      │   │
│  │  └────┘  │  │                                      │   │
│  │  Logout  │  │                                      │   │
│  └──────────┘  └──────────────────────────────────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Key Features:**
- Sidebar is always visible (256px width)
- Header spans the remaining width
- Content area scrolls independently
- Sidebar is fixed position

## Mobile Layout (<768px)

### Sidebar Closed (Default)
```
┌─────────────────────────────────┐
│  Header                         │
│  ┌────┐                ┌─────┐ │
│  │ ≡  │  Dashboard     │ 👤▼ │ │
│  └────┘                └─────┘ │
├─────────────────────────────────┤
│                                 │
│  Main Content Area              │
│  (full width, scrollable)       │
│                                 │
│  ┌───────────────────────────┐ │
│  │ Card 1                    │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Card 2                    │ │
│  └───────────────────────────┘ │
│  ┌───────────────────────────┐ │
│  │ Card 3                    │ │
│  └───────────────────────────┘ │
│                                 │
│  Content continues...           │
│                                 │
└─────────────────────────────────┘
```

### Sidebar Open
```
┌─────────────────────────────────┐
│ ┌──────────┐ [Backdrop]         │
│ │ Sidebar  │ ░░░░░░░░░░░░░░░░░░ │
│ │          │ ░░░░░░░░░░░░░░░░░░ │
│ │  [X]     │ ░░░░░░░░░░░░░░░░░░ │
│ │          │ ░░░░░░░░░░░░░░░░░░ │
│ │ • Home   │ ░░░░░░░░░░░░░░░░░░ │
│ │ • Dash   │ ░░░░░░░░░░░░░░░░░░ │
│ │ • Prod   │ ░░░░░░░░░░░░░░░░░░ │
│ │ • Sales  │ ░░░░░░░░░░░░░░░░░░ │
│ │          │ ░░░░░░░░░░░░░░░░░░ │
│ │          │ ░░░░░░░░░░░░░░░░░░ │
│ │  ┌────┐  │ ░░░░░░░░░░░░░░░░░░ │
│ │  │User│  │ ░░░░░░░░░░░░░░░░░░ │
│ │  └────┘  │ ░░░░░░░░░░░░░░░░░░ │
│ │  Logout  │ ░░░░░░░░░░░░░░░░░░ │
│ └──────────┘ ░░░░░░░░░░░░░░░░░░ │
│              ░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────┘
```

**Key Features:**
- Sidebar slides in from left
- Semi-transparent backdrop overlays content
- Clicking backdrop or navigating closes sidebar
- Sidebar is 256px width

## Header Component Details

### Desktop Header
```
┌──────────────────────────────────────────────────────┐
│  Dashboard                          [👤 John Doe ▼] │
│                                     Administrador    │
└──────────────────────────────────────────────────────┘
```

### Mobile Header
```
┌─────────────────────────────────┐
│  [≡]  Dashboard        [👤 ▼]  │
└─────────────────────────────────┘
```

### User Menu Dropdown
```
┌─────────────────────────────┐
│  John Doe                   │
│  john@example.com           │
│  Administrador              │
├─────────────────────────────┤
│  👤 Mi Perfil               │
│  ⚙️  Configuración          │
├─────────────────────────────┤
│  🚪 Cerrar Sesión           │
└─────────────────────────────┘
```

## Component Hierarchy

```
MainLayout
├── Sidebar (aside)
│   ├── Close button (mobile only)
│   ├── Logo/Brand
│   ├── Navigation menu
│   │   ├── Home
│   │   ├── Dashboard
│   │   ├── Products
│   │   ├── Sales
│   │   ├── Reports (role-based)
│   │   ├── Users (admin only)
│   │   └── Settings (admin only)
│   └── User info + Logout
│
├── Backdrop (mobile only, when sidebar open)
│
└── Main content wrapper
    ├── Header
    │   ├── Menu button (mobile only)
    │   ├── Page title
    │   └── User menu
    │       ├── User avatar
    │       ├── Dropdown
    │       │   ├── Profile
    │       │   ├── Settings (admin only)
    │       │   └── Logout
    │       └── Logout modal
    │
    └── Content area
        └── <Outlet /> (page content)
```

## State Management Flow

```
useUIStore
    │
    ├── isSidebarOpen: boolean
    │   └── Initial: true (desktop) / false (mobile)
    │
    ├── toggleSidebar()
    │   └── Called by: Header menu button, Sidebar close button
    │
    └── setSidebarOpen(isOpen)
        └── Called by: Backdrop click, route change (mobile)
```

## Responsive Behavior

### Breakpoint: 768px

**Below 768px (Mobile):**
- Sidebar: `fixed`, `translate-x-full` (hidden), slides in when open
- Header: Shows hamburger menu button
- Backdrop: Appears when sidebar is open
- User menu: Compact (avatar only)

**Above 768px (Desktop):**
- Sidebar: `relative`, always visible
- Header: No hamburger menu button
- Backdrop: Never appears
- User menu: Shows full user info

## Scroll Behavior

```
Root Container (h-screen overflow-hidden)
    │
    ├── Sidebar (overflow-y-auto)
    │   └── Scrolls independently if content exceeds height
    │
    └── Main Content Wrapper (flex-1 overflow-hidden)
        │
        ├── Header (sticky top-0)
        │   └── Stays at top when content scrolls
        │
        └── Content Area (overflow-y-auto)
            └── Scrolls independently
```

**Result:** No double scrollbars, smooth scrolling experience

## Z-Index Layers

```
Layer 4: Sidebar (z-30)
Layer 3: Backdrop (z-20)
Layer 2: Header (z-10)
Layer 1: Content (z-0)
```

## Color Scheme

### Sidebar
- Background: `bg-gray-800` (#1f2937)
- Text: `text-white`
- Active item: `bg-blue-600` (#2563eb)
- Hover: `bg-gray-700` (#374151)

### Header
- Background: `bg-white`
- Border: `border-gray-200` (#e5e7eb)
- Text: `text-gray-800` (#1f2937)

### Content Area
- Background: `bg-gray-50` (#f9fafb)

### Backdrop
- Background: `bg-black bg-opacity-50` (rgba(0,0,0,0.5))

## Transitions

### Sidebar Slide
```css
transition-transform duration-300 ease-in-out
```

### Hover Effects
```css
transition-colors duration-200
transition-all duration-200
```

## Accessibility

### ARIA Labels
- Menu button: `aria-label="Toggle menu"`
- User menu: `aria-label="User menu"`
- Close button: `aria-label="Cerrar menú"`
- Backdrop: `aria-hidden="true"`

### Keyboard Navigation
- Tab through all interactive elements
- Enter/Space to activate buttons
- Escape to close dropdowns (browser default)

## Testing Checklist

### Visual Testing
- [ ] Sidebar visible on desktop
- [ ] Sidebar hidden on mobile
- [ ] Hamburger menu appears on mobile
- [ ] Backdrop appears when sidebar open (mobile)
- [ ] Page title updates on navigation
- [ ] User menu dropdown works
- [ ] Settings link only for admin users

### Interaction Testing
- [ ] Click hamburger → sidebar opens
- [ ] Click backdrop → sidebar closes
- [ ] Navigate → sidebar closes (mobile)
- [ ] Click user avatar → dropdown opens
- [ ] Click outside dropdown → dropdown closes
- [ ] Click logout → modal appears
- [ ] Confirm logout → redirects to login

### Responsive Testing
- [ ] Resize window across 768px breakpoint
- [ ] Test on actual mobile device
- [ ] Test on tablet (iPad)
- [ ] Test landscape and portrait orientations

### Scroll Testing
- [ ] Header stays sticky when scrolling
- [ ] Content scrolls independently
- [ ] No double scrollbars
- [ ] Sidebar scrolls if content exceeds height

## Common Issues & Solutions

### Issue: Sidebar not closing on mobile
**Solution:** Check `useEffect` in MainLayout that listens to route changes

### Issue: Double scrollbars
**Solution:** Ensure root has `overflow-hidden` and only content area has `overflow-y-auto`

### Issue: Backdrop not clickable
**Solution:** Verify z-index: backdrop (z-20) should be below sidebar (z-30)

### Issue: Header not sticky
**Solution:** Check `sticky top-0` class is applied to header

### Issue: User menu not closing
**Solution:** Verify backdrop div with `onClick` handler is rendered when menu is open
