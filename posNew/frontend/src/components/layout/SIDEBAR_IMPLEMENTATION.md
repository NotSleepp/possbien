# Sidebar Component Implementation

## Overview
The Sidebar component has been redesigned with modern UI/UX features including icons, role-based navigation, user information display, and improved mobile responsiveness.

## Features Implemented

### 1. Icon Support
- **Library**: react-icons (Feather Icons - FiIcons)
- **Icons Used**:
  - FiHome - Home page
  - FiBarChart2 - Dashboard
  - FiPackage - Products
  - FiShoppingCart - Sales
  - FiFileText - Reports
  - FiUsers - Users management
  - FiSettings - Settings
  - FiLogOut - Logout
  - FiX - Close button (mobile)

### 2. Visual Indicator for Active Route
- Active routes are highlighted with:
  - Blue background (`bg-blue-600`)
  - White text
  - Shadow effect (`shadow-lg`)
- Inactive routes have:
  - Gray text (`text-gray-300`)
  - Hover effect with darker background (`hover:bg-gray-700`)
  - Smooth transitions

### 3. User Information Display
Located at the bottom of the sidebar:
- **Avatar**: Circular badge with user's initial
- **Name**: Full name (if available) or username
- **Email**: User's email or username
- **Role Badge**: Displays user role in Spanish:
  - Super Administrador (id_rol: 1)
  - Administrador (id_rol: 2)
  - Gerente (id_rol: 3)
  - Cajero (id_rol: 4)
  - Empleado (id_rol: 5)

### 4. Mobile Responsive Behavior
- **Desktop (md and up)**:
  - Sidebar is fixed and always visible
  - Width: 16rem (w-64)
  
- **Mobile (below md)**:
  - Sidebar is hidden by default
  - Opens as a drawer overlay when hamburger menu is clicked
  - Close button (X icon) in top-right corner
  - Clicking outside the sidebar (on overlay) closes it
  - Clicking a menu item closes the sidebar automatically

### 5. Logout Confirmation
- Modal dialog appears when logout button is clicked
- Prevents accidental logouts
- Modal features:
  - Title: "Confirmar Cierre de Sesión"
  - Warning message explaining the action
  - Two buttons:
    - "Cancelar" (Cancel) - closes modal
    - "Cerrar Sesión" (Logout) - confirms and logs out
  - Can be closed with ESC key
  - Can be closed by clicking outside the modal

### 6. Role-Based Menu Item Visibility
Menu items are filtered based on user role (`id_rol`):

| Menu Item | Roles with Access |
|-----------|-------------------|
| Home | All (1, 2, 3, 4, 5) |
| Dashboard | All (1, 2, 3, 4, 5) |
| Productos | All (1, 2, 3, 4, 5) |
| Ventas | All (1, 2, 3, 4, 5) |
| Reportes | Admin & Manager (1, 2, 3) |
| Usuarios | Super Admin & Admin (1, 2) |
| Configuración | Super Admin & Admin (1, 2) |

## Component Structure

```jsx
<Sidebar>
  ├── Mobile Close Button (X icon)
  ├── Logo/Brand Section
  ├── Navigation Menu
  │   └── Menu Items (filtered by role)
  │       ├── Icon
  │       └── Label
  └── User Info & Logout Section
      ├── User Avatar
      ├── User Name & Email
      ├── Role Badge
      └── Logout Button
</Sidebar>
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| onClose | function | No | Callback function to close the sidebar (used on mobile) |

## Dependencies

- `react-router-dom`: For navigation (NavLink, useNavigate)
- `react-icons/fi`: For Feather icons
- `zustand`: For auth state management (useAuthStore)
- `Modal`: Custom UI component for logout confirmation

## Usage Example

```jsx
import Sidebar from './components/layout/Sidebar';

function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Mobile menu button */}
      <button onClick={() => setIsSidebarOpen(true)}>
        Open Menu
      </button>

      {/* Sidebar */}
      <Sidebar onClose={() => setIsSidebarOpen(false)} />

      {/* Main content */}
      <main className="flex-1">
        {/* Your content here */}
      </main>
    </div>
  );
}
```

## Styling

The component uses Tailwind CSS with the following color scheme:
- **Background**: `bg-gray-800` (dark gray)
- **Text**: `text-white` (primary), `text-gray-300` (secondary), `text-gray-400` (tertiary)
- **Active State**: `bg-blue-600` (blue)
- **Hover State**: `bg-gray-700` (darker gray)
- **Logout Hover**: `bg-red-600` (red)
- **Borders**: `border-gray-700`

## Accessibility Features

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support (via NavLink)
- Focus indicators on all interactive elements
- Screen reader friendly text

## Requirements Satisfied

This implementation satisfies the following requirements:

- **1.5**: Icons displayed alongside navigation options
- **1.6**: Active route clearly highlighted in navigation menu
- **5.1**: Logo/brand, navigation with icons, and logout option
- **5.2**: Mobile hamburger menu with drawer functionality
- **5.3**: Navigation to corresponding pages with visual feedback
- **5.4**: Logout clears authentication and redirects to login
- **5.5**: Sidebar can be closed on mobile via close button or clicking outside
- **8.5**: Menu items shown/hidden based on user role

## Future Enhancements

- Collapsible sidebar on desktop
- Sidebar width customization
- Theme switching (light/dark mode)
- Nested menu items for complex navigation
- Search functionality within menu items
- Keyboard shortcuts for navigation
