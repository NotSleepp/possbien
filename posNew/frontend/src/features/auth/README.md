# Authentication Features

This directory contains authentication-related components, utilities, and API configurations.

## Components

### ProtectedRoute

A route wrapper component that ensures only authenticated users can access certain routes. It also supports role-based access control.

**Features:**
- Loading state while checking authentication
- Automatic redirect to login for unauthenticated users
- Role-based access control for admin-only routes
- Preserves the intended destination for redirect after login
- Displays AccessDenied component for unauthorized access

**Usage:**

```jsx
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import { USER_ROLES } from './utils/constants';

// Basic usage - any authenticated user can access
{
  element: <ProtectedRoute />,
  children: [
    { path: '/', element: <HomePage /> },
    { path: '/dashboard', element: <DashboardPage /> },
  ],
}

// Role-based access - only admins can access
{
  element: <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]} />,
  children: [
    { path: '/users', element: <UsersPage /> },
    { path: '/settings', element: <SettingsPage /> },
  ],
}
```

### withRoleProtection (HOC)

A Higher-Order Component that wraps individual components with role-based protection.

**Usage:**

```jsx
import withRoleProtection from './features/auth/components/withRoleProtection';
import { USER_ROLES } from './utils/constants';

const AdminPanel = () => {
  return <div>Admin Panel Content</div>;
};

// Wrap the component with role protection
const ProtectedAdminPanel = withRoleProtection(AdminPanel, [
  USER_ROLES.SUPER_ADMIN,
  USER_ROLES.ADMIN,
]);

// Use in your app
<ProtectedAdminPanel />
```

### AccessDenied

A component displayed when a user tries to access a route or component they don't have permission for.

**Features:**
- Clear error message
- Navigation options (go back or go home)
- Responsive design

## Utilities

### Permission Helpers

Located in `src/utils/permissions.js`, these functions help check user permissions:

```jsx
import { 
  hasPermission, 
  isAdmin, 
  isSuperAdmin,
  canManageUsers,
  canViewReports,
  canManageProducts,
  canProcessSales 
} from './utils/permissions';

// Check if user has specific role
if (hasPermission(user, [USER_ROLES.ADMIN])) {
  // Show admin features
}

// Check if user is admin
if (isAdmin(user)) {
  // Show admin menu
}

// Check specific permissions
if (canManageUsers(user)) {
  // Show user management
}
```

### Conditional Rendering Based on Roles

```jsx
import { useAuthStore } from './store/useAuthStore';
import { isAdmin } from './utils/permissions';

const Sidebar = () => {
  const { user } = useAuthStore();

  return (
    <nav>
      <MenuItem to="/">Home</MenuItem>
      <MenuItem to="/dashboard">Dashboard</MenuItem>
      <MenuItem to="/products">Products</MenuItem>
      
      {/* Only show for admins */}
      {isAdmin(user) && (
        <>
          <MenuItem to="/users">Users</MenuItem>
          <MenuItem to="/settings">Settings</MenuItem>
        </>
      )}
    </nav>
  );
};
```

## User Roles

The following roles are defined in `src/utils/constants.js`:

- **SUPER_ADMIN (1)**: Full system access, typically Google OAuth users
- **ADMIN (2)**: Administrative access
- **MANAGER (3)**: Management-level access
- **CASHIER (4)**: Point-of-sale operations
- **EMPLOYEE (5)**: Basic employee access

## Authentication Flow

1. User attempts to access a protected route
2. ProtectedRoute checks if user is authenticated
3. If not authenticated, redirects to login with the intended destination
4. If authenticated but lacks required role, shows AccessDenied component
5. If authenticated and authorized, renders the protected content

## API Integration

The authentication API client is configured with interceptors in `src/features/auth/api/api.js`:

- **Request Interceptor**: Automatically attaches JWT token to all requests
- **Response Interceptor**: Handles 401 errors with automatic logout and redirect

## State Management

Authentication state is managed using Zustand in `src/store/useAuthStore.js`:

```jsx
import { useAuthStore } from './store/useAuthStore';

const MyComponent = () => {
  const { user, isAuthenticated, isLoading, login, logout } = useAuthStore();

  // Use authentication state and actions
};
```

## Best Practices

1. **Always use ProtectedRoute** for routes that require authentication
2. **Specify allowedRoles** for admin-only routes
3. **Use permission helpers** for conditional rendering
4. **Handle loading states** to prevent flickering
5. **Preserve navigation state** for better UX after login
6. **Test role-based access** thoroughly

## Testing

When testing components with authentication:

```jsx
import { renderWithAuth } from './test-utils';

test('renders admin panel for admin users', () => {
  const mockUser = { id: 1, id_rol: USER_ROLES.ADMIN };
  renderWithAuth(<AdminPanel />, { user: mockUser });
  // assertions
});
```
