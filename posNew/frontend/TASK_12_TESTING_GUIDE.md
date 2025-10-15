# Task 12: Role-Based UI Rendering - Testing Guide

## Manual Testing Checklist

### Prerequisites
- Backend server running
- Frontend development server running
- Test users with different roles available

### Test Scenarios

#### 1. Test Permission Utilities

**Test File:** `src/utils/permissions.js`

Create a temporary test page or use browser console:

```javascript
import { hasRole, hasAnyRole, isAdmin, canAccessModule, canPerformAction } from './utils/permissions';
import { USER_ROLES } from './utils/constants';

// Test with different user objects
const superAdminUser = { id_rol: 1 };
const adminUser = { id_rol: 2 };
const managerUser = { id_rol: 3 };
const cashierUser = { id_rol: 4 };
const employeeUser = { id_rol: 5 };

// Test hasRole
console.log(hasRole(adminUser, USER_ROLES.ADMIN)); // Should be true
console.log(hasRole(employeeUser, USER_ROLES.ADMIN)); // Should be false

// Test isAdmin
console.log(isAdmin(superAdminUser)); // Should be true
console.log(isAdmin(adminUser)); // Should be true
console.log(isAdmin(managerUser)); // Should be false

// Test canAccessModule
console.log(canAccessModule(adminUser, 'users')); // Should be true
console.log(canAccessModule(employeeUser, 'users')); // Should be false

// Test canPerformAction
console.log(canPerformAction(adminUser, 'delete', 'products')); // Should be true
console.log(canPerformAction(cashierUser, 'delete', 'products')); // Should be false
```

**Expected Results:**
- ✅ All role checks return correct boolean values
- ✅ Module access checks match defined permissions
- ✅ Action permissions match defined CRUD rules

#### 2. Test usePermissions Hook

**Test Component:** Create a test component or use existing pages

```javascript
import { usePermissions } from '../hooks/usePermissions';

function TestComponent() {
  const {
    isAdmin,
    canPerformAction,
    getUserRoleName,
  } = usePermissions();

  return (
    <div>
      <p>Role: {getUserRoleName()}</p>
      <p>Is Admin: {isAdmin() ? 'Yes' : 'No'}</p>
      <p>Can Create Products: {canPerformAction('create', 'products') ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

**Test Steps:**
1. Login with different user roles
2. Navigate to test component
3. Verify displayed permissions match user role

**Expected Results:**
- ✅ Super Admin: All permissions = Yes
- ✅ Admin: Most permissions = Yes
- ✅ Manager: Create products = Yes, Delete users = No
- ✅ Cashier: Create products = No, Create sales = Yes
- ✅ Employee: Most create/delete = No

#### 3. Test RoleBasedRender Component

**Test Page:** Use the examples page or create test scenarios

```javascript
import RoleBasedRender from '../components/common/RoleBasedRender';
import { USER_ROLES } from '../utils/constants';

function TestPage() {
  return (
    <div>
      <RoleBasedRender allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
        <div>Admin Only Content</div>
      </RoleBasedRender>
      
      <RoleBasedRender 
        allowedRoles={[USER_ROLES.SUPER_ADMIN]}
        fallback={<div>Super Admin Only (Fallback)</div>}
      >
        <div>Super Admin Only Content</div>
      </RoleBasedRender>
    </div>
  );
}
```

**Test Steps:**
1. Login as Super Admin
   - Should see both "Admin Only Content" and "Super Admin Only Content"
2. Login as Admin
   - Should see "Admin Only Content"
   - Should see "Super Admin Only (Fallback)"
3. Login as Employee
   - Should not see "Admin Only Content"
   - Should see "Super Admin Only (Fallback)"

**Expected Results:**
- ✅ Content renders only for allowed roles
- ✅ Fallback content shows when permission denied
- ✅ No content shows when no fallback provided

#### 4. Test withRoleProtection HOC

**Test Component:**

```javascript
import { withRoleProtection } from '../components/common/withRoleProtection';
import { USER_ROLES } from '../utils/constants';

const AdminComponent = () => <div>Admin Component</div>;

const ProtectedAdminComponent = withRoleProtection(
  AdminComponent,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);

// Use in route or parent component
<ProtectedAdminComponent />
```

**Test Steps:**
1. Login as Admin
   - Should see "Admin Component"
2. Login as Employee
   - Should see AccessDenied page
3. Check loading state
   - Should show loading spinner briefly

**Expected Results:**
- ✅ Authorized users see the component
- ✅ Unauthorized users see AccessDenied page
- ✅ Loading spinner shows during auth check

#### 5. Test withConditionalRender HOC

**Test Component:**

```javascript
import { withConditionalRender } from '../components/common/withRoleProtection';
import { USER_ROLES } from '../utils/constants';

const AdminButton = withConditionalRender(
  () => <button>Admin Action</button>,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);

function TestPage() {
  return (
    <div>
      <h1>Page Title</h1>
      <AdminButton />
      <p>Other content</p>
    </div>
  );
}
```

**Test Steps:**
1. Login as Admin
   - Should see the button
2. Login as Employee
   - Should NOT see the button (no AccessDenied, just hidden)
3. Inspect DOM
   - Button should not exist in DOM for unauthorized users

**Expected Results:**
- ✅ Authorized users see the component
- ✅ Unauthorized users see nothing (null)
- ✅ No AccessDenied page shown

#### 6. Test Sidebar Menu Filtering

**Test Steps:**
1. Login as Super Admin
   - Should see: Home, Dashboard, Products, Sales, Reports, Users, Settings
2. Login as Admin
   - Should see: Home, Dashboard, Products, Sales, Reports, Users, Settings
3. Login as Manager
   - Should see: Home, Dashboard, Products, Sales, Reports
   - Should NOT see: Users, Settings
4. Login as Cashier
   - Should see: Home, Dashboard, Products, Sales
   - Should NOT see: Reports, Users, Settings
5. Login as Employee
   - Should see: Home, Dashboard, Products, Sales
   - Should NOT see: Reports, Users, Settings

**Expected Results:**
- ✅ Menu items filter correctly based on role
- ✅ Role name displays correctly at bottom of sidebar
- ✅ No console errors

#### 7. Test Route Protection

**Test Steps:**
1. Login as Employee
2. Try to navigate to `/settings` (admin-only route)
   - Should see AccessDenied page
3. Try to navigate to `/users` (admin-only route)
   - Should see AccessDenied page
4. Navigate to `/dashboard` (all users)
   - Should see dashboard

5. Login as Admin
6. Navigate to `/settings`
   - Should see settings page
7. Navigate to `/users`
   - Should see users page (if implemented)

**Expected Results:**
- ✅ Admin routes protected correctly
- ✅ AccessDenied shows for unauthorized access
- ✅ Public routes accessible to all authenticated users

#### 8. Test Examples Page

**Test Steps:**
1. Add route for examples page (temporary):
   ```javascript
   {
     path: '/examples',
     element: <RoleBasedExamples />,
   }
   ```
2. Login with different roles
3. Navigate to `/examples`
4. Verify all examples work correctly

**Expected Results:**
- ✅ Example 1: Buttons show/hide based on permissions
- ✅ Example 2: Content blocks show/hide based on roles
- ✅ Example 3: Protected component shows or AccessDenied
- ✅ Example 4: Conditional button renders or not
- ✅ Example 5: Permission checkboxes match user role

### Browser Testing

Test in multiple browsers:
- ✅ Chrome
- ✅ Firefox
- ✅ Safari
- ✅ Edge

### Responsive Testing

Test on different screen sizes:
- ✅ Desktop (1920x1080)
- ✅ Tablet (768x1024)
- ✅ Mobile (375x667)

## Automated Testing

### Unit Tests

Create test file: `src/utils/permissions.test.js`

```javascript
import { describe, test, expect } from 'vitest';
import {
  hasRole,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  canAccessModule,
  canPerformAction,
  getUserRoleName,
  filterMenuByPermissions,
} from './permissions';
import { USER_ROLES } from './constants';

describe('Permission Utilities', () => {
  const superAdminUser = { id_rol: USER_ROLES.SUPER_ADMIN };
  const adminUser = { id_rol: USER_ROLES.ADMIN };
  const managerUser = { id_rol: USER_ROLES.MANAGER };
  const cashierUser = { id_rol: USER_ROLES.CASHIER };
  const employeeUser = { id_rol: USER_ROLES.EMPLOYEE };

  describe('hasRole', () => {
    test('returns true when user has the role', () => {
      expect(hasRole(adminUser, USER_ROLES.ADMIN)).toBe(true);
    });

    test('returns false when user does not have the role', () => {
      expect(hasRole(employeeUser, USER_ROLES.ADMIN)).toBe(false);
    });

    test('returns false when user is null', () => {
      expect(hasRole(null, USER_ROLES.ADMIN)).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    test('returns true when user has one of the roles', () => {
      expect(hasAnyRole(adminUser, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN])).toBe(true);
    });

    test('returns false when user has none of the roles', () => {
      expect(hasAnyRole(employeeUser, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN])).toBe(false);
    });
  });

  describe('isAdmin', () => {
    test('returns true for super admin', () => {
      expect(isAdmin(superAdminUser)).toBe(true);
    });

    test('returns true for admin', () => {
      expect(isAdmin(adminUser)).toBe(true);
    });

    test('returns false for non-admin', () => {
      expect(isAdmin(managerUser)).toBe(false);
    });
  });

  describe('canAccessModule', () => {
    test('admin can access users module', () => {
      expect(canAccessModule(adminUser, 'users')).toBe(true);
    });

    test('employee cannot access users module', () => {
      expect(canAccessModule(employeeUser, 'users')).toBe(false);
    });

    test('manager can access reports module', () => {
      expect(canAccessModule(managerUser, 'reports')).toBe(true);
    });

    test('cashier cannot access reports module', () => {
      expect(canAccessModule(cashierUser, 'reports')).toBe(false);
    });
  });

  describe('canPerformAction', () => {
    test('admin can delete products', () => {
      expect(canPerformAction(adminUser, 'delete', 'products')).toBe(true);
    });

    test('manager cannot delete products', () => {
      expect(canPerformAction(managerUser, 'delete', 'products')).toBe(false);
    });

    test('cashier can create sales', () => {
      expect(canPerformAction(cashierUser, 'create', 'sales')).toBe(true);
    });

    test('employee cannot create sales', () => {
      expect(canPerformAction(employeeUser, 'create', 'sales')).toBe(false);
    });
  });

  describe('getUserRoleName', () => {
    test('returns correct name for super admin', () => {
      expect(getUserRoleName(superAdminUser)).toBe('Super Administrador');
    });

    test('returns correct name for admin', () => {
      expect(getUserRoleName(adminUser)).toBe('Administrador');
    });

    test('returns Desconocido for null user', () => {
      expect(getUserRoleName(null)).toBe('Desconocido');
    });
  });

  describe('filterMenuByPermissions', () => {
    const menuItems = [
      { path: '/dashboard', label: 'Dashboard', roles: [1, 2, 3, 4, 5] },
      { path: '/users', label: 'Users', roles: [1, 2] },
      { path: '/reports', label: 'Reports', roles: [1, 2, 3] },
    ];

    test('admin sees all menu items', () => {
      const filtered = filterMenuByPermissions(menuItems, adminUser);
      expect(filtered).toHaveLength(3);
    });

    test('manager sees dashboard and reports', () => {
      const filtered = filterMenuByPermissions(menuItems, managerUser);
      expect(filtered).toHaveLength(2);
      expect(filtered.find(item => item.path === '/users')).toBeUndefined();
    });

    test('employee sees only dashboard', () => {
      const filtered = filterMenuByPermissions(menuItems, employeeUser);
      expect(filtered).toHaveLength(1);
      expect(filtered[0].path).toBe('/dashboard');
    });
  });
});
```

### Component Tests

Create test file: `src/components/common/RoleBasedRender.test.jsx`

```javascript
import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import RoleBasedRender from './RoleBasedRender';
import { useAuthStore } from '../../store/useAuthStore';
import { USER_ROLES } from '../../utils/constants';

vi.mock('../../store/useAuthStore');

describe('RoleBasedRender', () => {
  test('renders children when user has permission', () => {
    useAuthStore.mockReturnValue({
      user: { id_rol: USER_ROLES.ADMIN },
      isAuthenticated: true,
    });

    render(
      <RoleBasedRender allowedRoles={[USER_ROLES.ADMIN]}>
        <div>Admin Content</div>
      </RoleBasedRender>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  test('does not render children when user lacks permission', () => {
    useAuthStore.mockReturnValue({
      user: { id_rol: USER_ROLES.EMPLOYEE },
      isAuthenticated: true,
    });

    render(
      <RoleBasedRender allowedRoles={[USER_ROLES.ADMIN]}>
        <div>Admin Content</div>
      </RoleBasedRender>
    );

    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });

  test('renders fallback when user lacks permission', () => {
    useAuthStore.mockReturnValue({
      user: { id_rol: USER_ROLES.EMPLOYEE },
      isAuthenticated: true,
    });

    render(
      <RoleBasedRender 
        allowedRoles={[USER_ROLES.ADMIN]}
        fallback={<div>No Access</div>}
      >
        <div>Admin Content</div>
      </RoleBasedRender>
    );

    expect(screen.getByText('No Access')).toBeInTheDocument();
    expect(screen.queryByText('Admin Content')).not.toBeInTheDocument();
  });
});
```

### Run Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test -- --coverage
```

## Common Issues and Solutions

### Issue 1: Permission checks not working
**Symptoms:** Components render for unauthorized users
**Solution:** 
- Verify user object has `id_rol` property
- Check that `initializeAuth` has completed
- Ensure role IDs match constants

### Issue 2: AccessDenied showing for authorized users
**Symptoms:** Admin users see AccessDenied
**Solution:**
- Check `allowedRoles` array is correct
- Verify user data is loaded in auth store
- Check for typos in role constants

### Issue 3: Menu items not filtering
**Symptoms:** All users see all menu items
**Solution:**
- Verify menu items have `roles` property
- Check that `filterMenuByPermissions` is being called
- Ensure user object is available

### Issue 4: HOC not working
**Symptoms:** Protected component always shows
**Solution:**
- Verify HOC is wrapping the component correctly
- Check that component is exported as wrapped version
- Ensure auth store is properly initialized

## Performance Testing

### Check for Performance Issues

1. **Large Menu Lists:**
   - Test with 50+ menu items
   - Verify filtering is fast (<100ms)

2. **Multiple Permission Checks:**
   - Test page with 100+ permission checks
   - Verify no lag or stuttering

3. **Re-renders:**
   - Use React DevTools Profiler
   - Verify components don't re-render unnecessarily

## Accessibility Testing

1. **Keyboard Navigation:**
   - Tab through all visible elements
   - Verify focus indicators

2. **Screen Reader:**
   - Test with NVDA/JAWS
   - Verify AccessDenied message is announced

3. **ARIA Labels:**
   - Verify all interactive elements have labels

## Security Testing

⚠️ **Important:** Always verify backend permissions!

1. **Direct URL Access:**
   - Try accessing admin routes directly
   - Should redirect or show AccessDenied

2. **Token Manipulation:**
   - Modify token in localStorage
   - Should logout and redirect to login

3. **Role Manipulation:**
   - Try modifying user role in browser
   - Backend should reject unauthorized requests

## Sign-off Checklist

- ✅ All utility functions work correctly
- ✅ usePermissions hook provides correct data
- ✅ RoleBasedRender component works as expected
- ✅ withRoleProtection HOC protects components
- ✅ withConditionalRender HOC hides components
- ✅ Sidebar filters menu items correctly
- ✅ Route protection works for admin routes
- ✅ No console errors or warnings
- ✅ All tests pass
- ✅ Documentation is complete
- ✅ Examples page demonstrates all features

## Conclusion

This testing guide covers all aspects of the role-based UI rendering system. Follow each test scenario to ensure the implementation works correctly across all user roles and use cases.
