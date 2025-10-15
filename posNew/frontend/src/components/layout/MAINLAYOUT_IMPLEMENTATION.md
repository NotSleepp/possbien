# MainLayout Implementation

## Overview

This document describes the implementation of the MainLayout component structure for the POS system. The layout provides a consistent structure across all authenticated pages with a responsive sidebar, header, and content area.

## Components Created

### 1. Header Component (`Header.jsx`)

**Location:** `src/components/layout/Header.jsx`

**Features:**
- Dynamic page title based on current route
- Mobile menu toggle button (hamburger icon)
- User menu dropdown with:
  - User avatar with initials
  - User name and role display
  - Profile link
  - Settings link (admin only)
  - Logout option with confirmation modal
- Responsive design (mobile and desktop)
- Sticky positioning at top of viewport

**Props:**
- `title` (string): The page title to display in the header

**Key Interactions:**
- Clicking the menu button toggles the sidebar (mobile only)
- Clicking the user avatar opens a dropdown menu
- Clicking outside the dropdown closes it
- Logout requires confirmation via modal

### 2. MainLayout Component (`MainLayout.jsx`)

**Location:** `src/components/layout/MainLayout.jsx`

**Features:**
- Wraps Sidebar and content area
- Responsive layout:
  - **Desktop (≥768px):** Sidebar always visible, fixed position
  - **Mobile (<768px):** Sidebar as drawer, toggleable
- Backdrop overlay on mobile when sidebar is open
- Automatic sidebar close on route change (mobile only)
- Dynamic page title generation based on route
- Proper overflow handling for content area
- Uses React Router's `<Outlet />` for nested routes

**Layout Structure:**
```
┌─────────────────────────────────────────┐
│  Sidebar (fixed/drawer)                 │
│  ┌───────────────────────────────────┐  │
│  │ Header (sticky)                   │  │
│  ├───────────────────────────────────┤  │
│  │                                   │  │
│  │ Main Content Area                 │  │
│  │ (scrollable)                      │  │
│  │                                   │  │
│  │ <Outlet /> renders page content   │  │
│  │                                   │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
```

**Responsive Behavior:**
- **Desktop:** Sidebar is always visible, takes up fixed width (256px)
- **Mobile:** Sidebar slides in from left, overlays content with backdrop
- Sidebar automatically closes when navigating to a new page on mobile

### 3. Enhanced UIStore (`useUIStore.js`)

**Location:** `src/store/useUIStore.js`

**Enhancements:**
- Intelligent initial state: sidebar open on desktop, closed on mobile
- `toggleSidebar()`: Toggle sidebar open/closed state
- `setSidebarOpen(isOpen)`: Explicitly set sidebar state

## Integration

### Routes Configuration

The MainLayout is integrated into the routing structure to wrap all authenticated pages:

```jsx
// routes/index.jsx
{
  element: <ProtectedRoute />,
  children: [
    {
      element: <MainLayout />,
      children: [
        { path: '/', element: <HomePage /> },
        { path: '/dashboard', element: <DashboardPage /> },
        { path: '/products', element: <ProductsPage /> },
      ],
    },
  ],
}
```

**Benefits:**
- All authenticated pages automatically get the layout
- Sidebar and header are shared across pages
- Page content is rendered via `<Outlet />`
- No need to manually add layout to each page

### Page Title Mapping

The MainLayout automatically determines page titles based on routes:

| Route | Title |
|-------|-------|
| `/` | Inicio |
| `/dashboard` | Dashboard |
| `/products` | Productos |
| `/sales` | Ventas |
| `/reports` | Reportes |
| `/users` | Usuarios |
| `/settings` | Configuración |

To add new routes, update the `getPageTitle()` function in `MainLayout.jsx`.

## Styling & Responsiveness

### Breakpoints

- **Mobile:** < 768px
- **Desktop:** ≥ 768px

### Key CSS Classes

**Sidebar (Mobile):**
```css
fixed inset-y-0 left-0 z-30 w-64 
transform transition-transform duration-300 ease-in-out
translate-x-0 (open) | -translate-x-full (closed)
```

**Sidebar (Desktop):**
```css
md:relative md:translate-x-0
```

**Backdrop:**
```css
fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden
```

**Main Content:**
```css
flex-1 overflow-y-auto overflow-x-hidden
```

### Overflow Handling

- **Sidebar:** `overflow-y-auto` - scrollable if content exceeds viewport
- **Main content:** `overflow-y-auto` - scrollable independently
- **Header:** `sticky top-0` - stays at top when scrolling content
- **Root container:** `overflow-hidden` - prevents double scrollbars

## User Experience

### Mobile Experience

1. User opens app → Sidebar is closed by default
2. User taps hamburger menu → Sidebar slides in from left with backdrop
3. User taps backdrop or navigates → Sidebar closes automatically
4. User taps user avatar → Dropdown menu appears
5. User taps outside dropdown → Menu closes

### Desktop Experience

1. User opens app → Sidebar is visible by default
2. Sidebar remains visible at all times
3. User can click user avatar for dropdown menu
4. Content area adjusts to available space

## Accessibility

### ARIA Labels

- Menu toggle button: `aria-label="Toggle menu"`
- User menu button: `aria-label="User menu"`
- Backdrop: `aria-hidden="true"`

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Dropdown menu can be navigated with Tab
- Escape key closes dropdown (browser default)

### Focus Management

- Focus indicators on all interactive elements
- Logical tab order maintained

## Testing Recommendations

### Manual Testing

1. **Responsive behavior:**
   - Resize browser window across breakpoint (768px)
   - Verify sidebar behavior changes appropriately
   - Test on actual mobile devices

2. **Navigation:**
   - Navigate between pages
   - Verify sidebar closes on mobile after navigation
   - Verify page title updates correctly

3. **User menu:**
   - Open/close dropdown
   - Click outside to close
   - Verify role-based menu items (Settings for admin only)

4. **Logout flow:**
   - Click logout
   - Verify confirmation modal appears
   - Test both confirm and cancel actions

### Automated Testing (Future)

```javascript
// Example test cases
describe('MainLayout', () => {
  it('renders sidebar and header', () => {});
  it('toggles sidebar on mobile', () => {});
  it('closes sidebar on route change (mobile)', () => {});
  it('displays correct page title', () => {});
  it('shows backdrop when sidebar is open (mobile)', () => {});
});

describe('Header', () => {
  it('displays user information', () => {});
  it('opens user menu on click', () => {});
  it('closes menu when clicking outside', () => {});
  it('shows settings link for admin users only', () => {});
  it('shows logout confirmation modal', () => {});
});
```

## Requirements Satisfied

✅ **Requirement 1.1:** Consistent interface with design system
- MainLayout provides consistent structure across all pages
- Uses theme colors and spacing from design system

✅ **Requirement 1.3:** Responsive design for mobile and desktop
- Sidebar adapts to screen size (drawer on mobile, fixed on desktop)
- Header is responsive with mobile-specific menu button
- Content area adjusts to available space

✅ **Requirement 5.1:** Clear navigation in all pages
- Sidebar accessible from all pages via MainLayout
- Header provides context with page title
- User menu accessible from header

## Future Enhancements

1. **Breadcrumbs:** Add breadcrumb navigation in header for nested routes
2. **Page transitions:** Add smooth transitions between page changes
3. **Sidebar width toggle:** Allow users to collapse sidebar to icon-only mode
4. **Theme toggle:** Add dark mode toggle in user menu
5. **Notifications:** Add notification bell icon in header
6. **Search:** Add global search in header

## Dependencies

- `react-router-dom`: For routing and navigation
- `react-icons/fi`: For Feather icons
- `zustand`: For UI state management
- Tailwind CSS: For styling

## Files Modified/Created

### Created:
- `src/components/layout/Header.jsx`
- `src/components/layout/MainLayout.jsx`
- `src/components/layout/MAINLAYOUT_IMPLEMENTATION.md`

### Modified:
- `src/routes/index.jsx` - Integrated MainLayout into routing
- `src/store/useUIStore.js` - Enhanced with intelligent initial state

## Usage Example

Pages no longer need to manually include layout components:

**Before:**
```jsx
// HomePage.jsx
const HomePage = () => {
  return (
    <div>
      <Sidebar />
      <div>
        <h1>Home Page</h1>
        {/* content */}
      </div>
    </div>
  );
};
```

**After:**
```jsx
// HomePage.jsx
const HomePage = () => {
  return (
    <div>
      <h1>Home Page</h1>
      {/* content */}
    </div>
  );
};
```

The MainLayout automatically wraps the page content via the routing configuration.

## Troubleshooting

### Issue: Sidebar not closing on mobile
**Solution:** Check that `toggleSidebar` is being called in the `useEffect` hook when route changes.

### Issue: Double scrollbars
**Solution:** Ensure parent container has `overflow-hidden` and only the content area has `overflow-y-auto`.

### Issue: Backdrop not appearing
**Solution:** Verify z-index values: backdrop (z-20), sidebar (z-30), header (z-10).

### Issue: Page title not updating
**Solution:** Add the route to the `getPageTitle()` function in `MainLayout.jsx`.

## Conclusion

The MainLayout implementation provides a solid foundation for the POS system's UI structure. It ensures consistency, responsiveness, and a great user experience across all authenticated pages while maintaining clean separation of concerns.
