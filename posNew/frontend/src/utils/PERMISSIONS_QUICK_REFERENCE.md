# Role-Based Permissions - Quick Reference

## 🚀 Quick Start

### Import What You Need

```javascript
// For hooks
import { usePermissions } from '../hooks/usePermissions';

// For components
import RoleBasedRender from '../components/common/RoleBasedRender';

// For HOCs
import { withRoleProtection, withConditionalRender } from '../components/common/withRoleProtection';

// For utilities
import { hasRole, isAdmin, canAccessModule } from '../utils/permissions';

// For constants
import { USER_ROLES } from '../utils/constants';
```

## 📋 Common Use Cases

### 1. Show/Hide Button Based on Permission

```javascript
function MyComponent() {
  const { canPerformAction } = usePermissions();
  
  return (
    <div>
      {canPerformAction('create', 'products') && (
        <button>Create Product</button>
      )}
    </div>
  );
}
```

### 2. Show Admin-Only Section

```javascript
function MyComponent() {
  const { isAdmin } = usePermissions();
  
  return (
    <div>
      {isAdmin() && (
        <div>Admin Settings</div>
      )}
    </div>
  );
}
```

### 3. Declarative Permission Check

```javascript
function MyComponent() {
  return (
    <div>
      <RoleBasedRender allowedRoles={[USER_ROLES.ADMIN]}>
        <AdminPanel />
      </RoleBasedRender>
    </div>
  );
}
```

### 4. Protect Entire Component

```javascript
const AdminSettings = () => <div>Settings</div>;

export default withRoleProtection(
  AdminSettings,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);
```

### 5. Hide Component (No AccessDenied)

```javascript
const AdminButton = withConditionalRender(
  () => <button>Admin Action</button>,
  [USER_ROLES.ADMIN]
);

// Use it
<AdminButton />
```

## 🎯 Permission Functions

### Role Checks

```javascript
const { hasRole, hasAnyRole, isAdmin, isSuperAdmin, isManagerOrHigher } = usePermissions();

hasRole(USER_ROLES.ADMIN)                    // Is user admin?
hasAnyRole([USER_ROLES.ADMIN, USER_ROLES.MANAGER])  // Is user admin OR manager?
isAdmin()                                     // Is user super admin or admin?
isSuperAdmin()                                // Is user super admin?
isManagerOrHigher()                           // Is user manager, admin, or super admin?
```

### Module Access

```javascript
const { canAccessModule } = usePermissions();

canAccessModule('users')      // Can access users module?
canAccessModule('reports')    // Can access reports module?
canAccessModule('settings')   // Can access settings module?
```

### Action Permissions

```javascript
const { canPerformAction } = usePermissions();

canPerformAction('create', 'products')  // Can create products?
canPerformAction('delete', 'products')  // Can delete products?
canPerformAction('update', 'sales')     // Can update sales?
canPerformAction('create', 'users')     // Can create users?
```

## 🔑 User Roles

```javascript
USER_ROLES.SUPER_ADMIN  // 1 - Full access
USER_ROLES.ADMIN        // 2 - Admin access
USER_ROLES.MANAGER      // 3 - Management access
USER_ROLES.CASHIER      // 4 - Sales operations
USER_ROLES.EMPLOYEE     // 5 - Basic operations
```

## 📊 Permission Matrix

### Module Access

| Module     | Super Admin | Admin | Manager | Cashier | Employee |
|------------|-------------|-------|---------|---------|----------|
| Dashboard  | ✅          | ✅    | ✅      | ✅      | ✅       |
| Products   | ✅          | ✅    | ✅      | ✅      | ✅       |
| Sales      | ✅          | ✅    | ✅      | ✅      | ✅       |
| Reports    | ✅          | ✅    | ✅      | ❌      | ❌       |
| Users      | ✅          | ✅    | ❌      | ❌      | ❌       |
| Settings   | ✅          | ✅    | ❌      | ❌      | ❌       |

### Product Actions

| Action | Super Admin | Admin | Manager | Cashier | Employee |
|--------|-------------|-------|---------|---------|----------|
| Create | ✅          | ✅    | ✅      | ❌      | ❌       |
| Read   | ✅          | ✅    | ✅      | ✅      | ✅       |
| Update | ✅          | ✅    | ✅      | ❌      | ❌       |
| Delete | ✅          | ✅    | ❌      | ❌      | ❌       |

### Sales Actions

| Action | Super Admin | Admin | Manager | Cashier | Employee |
|--------|-------------|-------|---------|---------|----------|
| Create | ✅          | ✅    | ✅      | ✅      | ❌       |
| Read   | ✅          | ✅    | ✅      | ✅      | ✅       |
| Update | ✅          | ✅    | ✅      | ❌      | ❌       |
| Delete | ✅          | ✅    | ❌      | ❌      | ❌       |

### User Actions

| Action | Super Admin | Admin | Manager | Cashier | Employee |
|--------|-------------|-------|---------|---------|----------|
| Create | ✅          | ✅    | ❌      | ❌      | ❌       |
| Read   | ✅          | ✅    | ❌      | ❌      | ❌       |
| Update | ✅          | ✅    | ❌      | ❌      | ❌       |
| Delete | ✅          | ❌    | ❌      | ❌      | ❌       |

## 🎨 Component Patterns

### Pattern 1: Inline Check

```javascript
{isAdmin() && <AdminButton />}
```

**Use when:** Simple show/hide logic

### Pattern 2: Declarative Component

```javascript
<RoleBasedRender allowedRoles={[USER_ROLES.ADMIN]}>
  <AdminContent />
</RoleBasedRender>
```

**Use when:** Want declarative, readable code

### Pattern 3: HOC with AccessDenied

```javascript
export default withRoleProtection(Component, [USER_ROLES.ADMIN]);
```

**Use when:** Protecting entire pages/components

### Pattern 4: HOC without AccessDenied

```javascript
export default withConditionalRender(Component, [USER_ROLES.ADMIN]);
```

**Use when:** Want to hide component completely

### Pattern 5: Route Protection

```javascript
<ProtectedRoute allowedRoles={[USER_ROLES.ADMIN]} />
```

**Use when:** Protecting entire routes

## 💡 Best Practices

### ✅ DO

```javascript
// Use constants
import { USER_ROLES } from '../utils/constants';
hasRole(USER_ROLES.ADMIN)

// Use hooks in components
const { isAdmin } = usePermissions();

// Combine checks when needed
if (isAdmin() && canPerformAction('delete', 'users')) {
  // ...
}

// Provide fallbacks
<RoleBasedRender 
  allowedRoles={[USER_ROLES.ADMIN]}
  fallback={<p>No access</p>}
>
  <AdminContent />
</RoleBasedRender>
```

### ❌ DON'T

```javascript
// Don't hardcode role IDs
hasRole(user, 2)  // Bad

// Don't check user.id_rol directly
if (user.id_rol === 2) { }  // Bad

// Don't forget backend validation
// Frontend checks are for UX only!

// Don't nest too many permission checks
if (isAdmin()) {
  if (canPerformAction('delete', 'users')) {
    if (hasRole(USER_ROLES.SUPER_ADMIN)) {
      // Too complex!
    }
  }
}
```

## 🔍 Debugging

### Check Current User

```javascript
const { user, getUserRoleName } = usePermissions();
console.log('User:', user);
console.log('Role:', getUserRoleName());
```

### Check Specific Permission

```javascript
const { canPerformAction } = usePermissions();
console.log('Can delete products:', canPerformAction('delete', 'products'));
```

### Check All Permissions

```javascript
const permissions = usePermissions();
console.log('All permissions:', permissions);
```

## 📚 More Information

- Full documentation: `src/utils/PERMISSIONS_README.md`
- Implementation details: `TASK_12_IMPLEMENTATION_SUMMARY.md`
- Testing guide: `TASK_12_TESTING_GUIDE.md`
- Live examples: `src/components/examples/RoleBasedExamples.jsx`

## ⚠️ Security Warning

**Frontend permission checks are for UX only!**

Always validate permissions on the backend:
- ✅ Backend validates every request
- ✅ Backend checks user permissions
- ✅ Backend returns 403 for unauthorized access

Frontend checks only:
- Hide UI elements
- Improve user experience
- Prevent accidental navigation

**Never trust frontend permission checks for security!**
