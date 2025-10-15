# Role-Based UI Rendering System

This document describes the role-based access control (RBAC) system implemented in the frontend application.

## Overview

The system provides multiple ways to control UI rendering and component access based on user roles:

1. **Utility Functions** - Low-level permission checking functions
2. **Custom Hook** - React hook for permission checking in components
3. **HOC (Higher-Order Component)** - Wrap components to protect them
4. **Conditional Render Component** - Declarative permission-based rendering
5. **Protected Routes** - Route-level protection

## User Roles

The system supports the following roles (defined in `utils/constants.js`):

```javascript
USER_ROLES = {
  SUPER_ADMIN: 1,    // Full system access
  ADMIN: 2,          // Administrative access
  MANAGER: 3,        // Management access
  CASHIER: 4,        // Sales operations
  EMPLOYEE: 5,       // Basic operations
}
```

## 1. Utility Functions

Located in `utils/permissions.js`, these functions provide low-level permission checking:

### Basic Role Checking

```javascript
import { hasRole, hasAnyRole, isAdmin } from '../utils/permissions';

// Check if user has a specific role
if (hasRole(user, USER_ROLES.ADMIN)) {
  // User is admin
}

// Check if user has any of the specified roles
if (hasAnyRole(user, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN])) {
  // User is super admin or admin
}

// Check if user is admin (super admin or admin)
if (isAdmin(user)) {
  // User has admin privileges
}
```

### Module Access Checking

```javascript
import { canAccessModule } from '../utils/permissions';

// Check if user can access a module
if (canAccessModule(user, 'users')) {
  // User can access users module
}

// Available modules: dashboard, products, sales, reports, users, settings
```

### Action Permission Checking

```javascript
import { canPerformAction } from '../utils/permissions';

// Check if user can perform an action on a resource
if (canPerformAction(user, 'create', 'products')) {
  // User can create products
}

// Actions: create, read, update, delete
// Resources: products, sales, users
```

### Menu Filtering

```javascript
import { filterMenuByPermissions } from '../utils/permissions';

const menuItems = [
  { path: '/users', label: 'Users', roles: [1, 2] },
  { path: '/products', label: 'Products', roles: [1, 2, 3, 4, 5] },
];

const visibleItems = filterMenuByPermissions(menuItems, user);
```

## 2. Custom Hook (usePermissions)

Located in `hooks/usePermissions.js`, this hook provides easy access to permission functions:

```javascript
import { usePermissions } from '../hooks/usePermissions';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    isAdmin,
    isSuperAdmin,
    isManagerOrHigher,
    canAccessModule,
    canPerformAction,
    getUserRoleName,
  } = usePermissions();

  return (
    <div>
      <h1>Welcome, {getUserRoleName()}</h1>
      
      {isAdmin() && (
        <button>Admin Action</button>
      )}
      
      {canPerformAction('create', 'products') && (
        <button>Create Product</button>
      )}
    </div>
  );
}
```

## 3. Higher-Order Component (withRoleProtection)

Located in `components/common/withRoleProtection.jsx`, this HOC wraps components to protect them:

### Basic Usage

```javascript
import { withRoleProtection } from '../components/common/withRoleProtection';
import { USER_ROLES } from '../utils/constants';

// Original component
const AdminPanel = () => {
  return <div>Admin Panel Content</div>;
};

// Protected component - only accessible by admins
export default withRoleProtection(
  AdminPanel,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);
```

### With Custom Options

```javascript
import { withRoleProtection } from '../components/common/withRoleProtection';
import CustomFallback from './CustomFallback';

const ProtectedComponent = withRoleProtection(
  MyComponent,
  [USER_ROLES.ADMIN],
  {
    fallback: CustomFallback,  // Custom fallback component
    showLoading: false,         // Don't show loading spinner
  }
);
```

### Conditional Render HOC

Use `withConditionalRender` when you want to hide the component instead of showing AccessDenied:

```javascript
import { withConditionalRender } from '../components/common/withRoleProtection';

// Component will render for admins, return null for others
const AdminButton = withConditionalRender(
  () => <button>Admin Action</button>,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);
```

## 4. RoleBasedRender Component

Located in `components/common/RoleBasedRender.jsx`, this component provides declarative permission-based rendering:

### Basic Usage

```javascript
import RoleBasedRender from '../components/common/RoleBasedRender';
import { USER_ROLES } from '../utils/constants';

function MyComponent() {
  return (
    <div>
      <h1>Dashboard</h1>
      
      {/* Only visible to admins */}
      <RoleBasedRender allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
        <button>Admin Settings</button>
      </RoleBasedRender>
      
      {/* Visible to managers and above */}
      <RoleBasedRender 
        allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER]}
      >
        <div>Manager Dashboard</div>
      </RoleBasedRender>
    </div>
  );
}
```

### With Fallback

```javascript
<RoleBasedRender 
  allowedRoles={[USER_ROLES.ADMIN]}
  fallback={<p>You need admin access to see this content</p>}
>
  <AdminContent />
</RoleBasedRender>
```

## 5. Protected Routes

Located in `features/auth/components/ProtectedRoute.jsx`, this component protects entire routes:

### Usage in Routes

```javascript
import { createBrowserRouter } from 'react-router-dom';
import ProtectedRoute from '../features/auth/components/ProtectedRoute';
import { USER_ROLES } from '../utils/constants';

export const router = createBrowserRouter([
  {
    // Protected routes - all authenticated users
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <DashboardPage />,
      },
    ],
  },
  {
    // Admin-only routes
    element: <ProtectedRoute allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]} />,
    children: [
      {
        path: '/users',
        element: <UsersPage />,
      },
      {
        path: '/settings',
        element: <SettingsPage />,
      },
    ],
  },
]);
```

## Complete Examples

### Example 1: Product Management Page

```javascript
import { usePermissions } from '../hooks/usePermissions';
import RoleBasedRender from '../components/common/RoleBasedRender';
import { USER_ROLES } from '../utils/constants';

function ProductsPage() {
  const { canPerformAction } = usePermissions();

  return (
    <div>
      <h1>Products</h1>
      
      {/* Create button - only for managers and above */}
      {canPerformAction('create', 'products') && (
        <button>Create Product</button>
      )}
      
      {/* Product list - all users can view */}
      <ProductList />
      
      {/* Delete actions - only for admins */}
      <RoleBasedRender allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
        <button>Delete Selected</button>
      </RoleBasedRender>
    </div>
  );
}
```

### Example 2: Dashboard with Role-Based Widgets

```javascript
import { usePermissions } from '../hooks/usePermissions';
import RoleBasedRender from '../components/common/RoleBasedRender';
import { USER_ROLES } from '../utils/constants';

function Dashboard() {
  const { isAdmin, isManagerOrHigher } = usePermissions();

  return (
    <div>
      {/* All users see basic metrics */}
      <MetricCards />
      
      {/* Managers and above see reports */}
      {isManagerOrHigher() && (
        <ReportsSection />
      )}
      
      {/* Only admins see user management */}
      <RoleBasedRender allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
        <UserManagementWidget />
      </RoleBasedRender>
      
      {/* Super admin only */}
      {isAdmin() && (
        <SystemSettingsWidget />
      )}
    </div>
  );
}
```

### Example 3: Protected Admin Component

```javascript
import { withRoleProtection } from '../components/common/withRoleProtection';
import { USER_ROLES } from '../utils/constants';

// Component definition
const UserManagement = () => {
  return (
    <div>
      <h1>User Management</h1>
      <UserList />
      <CreateUserForm />
    </div>
  );
};

// Export protected version
export default withRoleProtection(
  UserManagement,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);
```

## Best Practices

1. **Use the right tool for the job:**
   - Route-level protection: Use `ProtectedRoute`
   - Component-level protection: Use `withRoleProtection` HOC
   - Conditional rendering: Use `RoleBasedRender` or `usePermissions` hook
   - Menu filtering: Use `filterMenuByPermissions`

2. **Prefer declarative over imperative:**
   ```javascript
   // Good - declarative
   <RoleBasedRender allowedRoles={[USER_ROLES.ADMIN]}>
     <AdminButton />
   </RoleBasedRender>
   
   // Also good - when you need more control
   const { isAdmin } = usePermissions();
   if (isAdmin()) {
     return <AdminButton />;
   }
   ```

3. **Always check permissions on the backend:**
   Frontend permission checks are for UX only. Always validate permissions on the backend.

4. **Use constants for roles:**
   ```javascript
   // Good
   import { USER_ROLES } from '../utils/constants';
   hasRole(user, USER_ROLES.ADMIN)
   
   // Bad
   hasRole(user, 2)
   ```

5. **Combine multiple checks when needed:**
   ```javascript
   const { isAdmin, canPerformAction } = usePermissions();
   
   if (isAdmin() && canPerformAction('delete', 'users')) {
     // Show delete button
   }
   ```

## Testing

When testing components with role-based rendering:

```javascript
import { render } from '@testing-library/react';
import { useAuthStore } from '../store/useAuthStore';

// Mock the auth store
jest.mock('../store/useAuthStore');

test('shows admin button for admin users', () => {
  useAuthStore.mockReturnValue({
    user: { id_rol: 1 },
    isAuthenticated: true,
  });
  
  const { getByText } = render(<MyComponent />);
  expect(getByText('Admin Button')).toBeInTheDocument();
});
```

## Troubleshooting

**Component not rendering for authorized user:**
- Check that user object has `id_rol` property
- Verify role ID matches constants
- Check that user is authenticated

**AccessDenied showing unexpectedly:**
- Verify `allowedRoles` array is correct
- Check that user data is loaded
- Ensure `initializeAuth` has completed

**Menu items not filtering correctly:**
- Verify menu items have `roles` property
- Check that `filterMenuByPermissions` is being used
- Ensure user object is available
