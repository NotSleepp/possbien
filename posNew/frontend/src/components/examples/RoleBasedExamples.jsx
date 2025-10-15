/**
 * Role-Based Rendering Examples
 * This file demonstrates all the different ways to implement role-based UI rendering
 */

import { usePermissions } from '../../hooks/usePermissions';
import RoleBasedRender from '../common/RoleBasedRender';
import { withRoleProtection, withConditionalRender } from '../common/withRoleProtection';
import { USER_ROLES } from '../../utils/constants';
import Button from '../ui/Button';
import Card from '../ui/Card';

// ============================================================================
// Example 1: Using usePermissions Hook
// ============================================================================

export const Example1_UsePermissionsHook = () => {
  const {
    isAdmin,
    isSuperAdmin,
    isManagerOrHigher,
    canPerformAction,
    getUserRoleName,
  } = usePermissions();

  return (
    <Card title="Example 1: usePermissions Hook">
      <div className="space-y-4">
        <p className="text-gray-600">
          Current Role: <span className="font-semibold">{getUserRoleName()}</span>
        </p>

        {/* Show button only for admins */}
        {isAdmin() && (
          <Button variant="primary">Admin Only Button</Button>
        )}

        {/* Show button only for super admins */}
        {isSuperAdmin() && (
          <Button variant="danger">Super Admin Only Button</Button>
        )}

        {/* Show button for managers and above */}
        {isManagerOrHigher() && (
          <Button variant="secondary">Manager+ Button</Button>
        )}

        {/* Show button based on specific action permission */}
        {canPerformAction('create', 'products') && (
          <Button variant="primary">Create Product</Button>
        )}

        {canPerformAction('delete', 'users') && (
          <Button variant="danger">Delete User</Button>
        )}
      </div>
    </Card>
  );
};

// ============================================================================
// Example 2: Using RoleBasedRender Component
// ============================================================================

export const Example2_RoleBasedRenderComponent = () => {
  return (
    <Card title="Example 2: RoleBasedRender Component">
      <div className="space-y-4">
        {/* Admin only content */}
        <RoleBasedRender allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]}>
          <div className="p-4 bg-blue-50 border border-blue-200 rounded">
            <p className="text-blue-800 font-semibold">Admin Content</p>
            <p className="text-blue-600 text-sm">
              This content is only visible to Super Admins and Admins
            </p>
          </div>
        </RoleBasedRender>

        {/* Manager and above content */}
        <RoleBasedRender
          allowedRoles={[USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN, USER_ROLES.MANAGER]}
        >
          <div className="p-4 bg-green-50 border border-green-200 rounded">
            <p className="text-green-800 font-semibold">Manager+ Content</p>
            <p className="text-green-600 text-sm">
              This content is visible to Managers, Admins, and Super Admins
            </p>
          </div>
        </RoleBasedRender>

        {/* With fallback */}
        <RoleBasedRender
          allowedRoles={[USER_ROLES.SUPER_ADMIN]}
          fallback={
            <div className="p-4 bg-gray-50 border border-gray-200 rounded">
              <p className="text-gray-600">
                You need Super Admin access to see this content
              </p>
            </div>
          }
        >
          <div className="p-4 bg-purple-50 border border-purple-200 rounded">
            <p className="text-purple-800 font-semibold">Super Admin Only</p>
            <p className="text-purple-600 text-sm">
              This content is only visible to Super Admins
            </p>
          </div>
        </RoleBasedRender>
      </div>
    </Card>
  );
};

// ============================================================================
// Example 3: Using withRoleProtection HOC
// ============================================================================

// Component that should only be visible to admins
const AdminOnlyComponent = () => {
  return (
    <div className="p-4 bg-red-50 border border-red-200 rounded">
      <p className="text-red-800 font-semibold">Protected Component</p>
      <p className="text-red-600 text-sm">
        This entire component is protected by the withRoleProtection HOC
      </p>
      <Button variant="danger" className="mt-2">
        Admin Action
      </Button>
    </div>
  );
};

// Wrap with HOC to protect it
const ProtectedAdminComponent = withRoleProtection(
  AdminOnlyComponent,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);

export const Example3_WithRoleProtectionHOC = () => {
  return (
    <Card title="Example 3: withRoleProtection HOC">
      <div className="space-y-4">
        <p className="text-gray-600">
          The component below is wrapped with withRoleProtection HOC.
          It will show AccessDenied page if user doesn't have permission.
        </p>
        <ProtectedAdminComponent />
      </div>
    </Card>
  );
};

// ============================================================================
// Example 4: Using withConditionalRender HOC
// ============================================================================

// Component that should conditionally render
const ConditionalButton = () => {
  return (
    <Button variant="primary">
      This button only renders for admins (no AccessDenied page)
    </Button>
  );
};

// Wrap with conditional render HOC
const AdminButton = withConditionalRender(
  ConditionalButton,
  [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]
);

export const Example4_WithConditionalRenderHOC = () => {
  return (
    <Card title="Example 4: withConditionalRender HOC">
      <div className="space-y-4">
        <p className="text-gray-600">
          The button below uses withConditionalRender HOC.
          It will return null (not render) if user doesn't have permission.
        </p>
        <AdminButton />
        <p className="text-sm text-gray-500">
          (If you don't see a button above, you don't have admin access)
        </p>
      </div>
    </Card>
  );
};

// ============================================================================
// Example 5: Complex Permission Checking
// ============================================================================

export const Example5_ComplexPermissions = () => {
  const { canPerformAction, isAdmin, hasAnyRole } = usePermissions();

  const canCreateProduct = canPerformAction('create', 'products');
  const canDeleteProduct = canPerformAction('delete', 'products');
  const canCreateSale = canPerformAction('create', 'sales');
  const canManageUsers = canPerformAction('create', 'users');

  return (
    <Card title="Example 5: Complex Permission Checking">
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Product permissions */}
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold text-gray-800 mb-2">Product Permissions</p>
            <ul className="space-y-1 text-sm">
              <li className={canCreateProduct ? 'text-green-600' : 'text-red-600'}>
                {canCreateProduct ? '✓' : '✗'} Create Products
              </li>
              <li className={canDeleteProduct ? 'text-green-600' : 'text-red-600'}>
                {canDeleteProduct ? '✓' : '✗'} Delete Products
              </li>
            </ul>
          </div>

          {/* Sales permissions */}
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold text-gray-800 mb-2">Sales Permissions</p>
            <ul className="space-y-1 text-sm">
              <li className={canCreateSale ? 'text-green-600' : 'text-red-600'}>
                {canCreateSale ? '✓' : '✗'} Create Sales
              </li>
            </ul>
          </div>

          {/* User management permissions */}
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold text-gray-800 mb-2">User Management</p>
            <ul className="space-y-1 text-sm">
              <li className={canManageUsers ? 'text-green-600' : 'text-red-600'}>
                {canManageUsers ? '✓' : '✗'} Manage Users
              </li>
            </ul>
          </div>

          {/* Admin status */}
          <div className="p-3 bg-gray-50 rounded">
            <p className="font-semibold text-gray-800 mb-2">Admin Status</p>
            <ul className="space-y-1 text-sm">
              <li className={isAdmin() ? 'text-green-600' : 'text-red-600'}>
                {isAdmin() ? '✓' : '✗'} Is Admin
              </li>
              <li
                className={
                  hasAnyRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN])
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {hasAnyRole([USER_ROLES.MANAGER, USER_ROLES.ADMIN, USER_ROLES.SUPER_ADMIN])
                  ? '✓'
                  : '✗'}{' '}
                Is Manager+
              </li>
            </ul>
          </div>
        </div>

        {/* Action buttons based on permissions */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          {canCreateProduct && (
            <Button variant="primary" size="sm">
              Create Product
            </Button>
          )}
          {canDeleteProduct && (
            <Button variant="danger" size="sm">
              Delete Product
            </Button>
          )}
          {canCreateSale && (
            <Button variant="secondary" size="sm">
              New Sale
            </Button>
          )}
          {canManageUsers && (
            <Button variant="primary" size="sm">
              Manage Users
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

// ============================================================================
// Main Examples Component
// ============================================================================

const RoleBasedExamples = () => {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Role-Based Rendering Examples</h1>
        <p className="text-gray-600 mt-2">
          This page demonstrates all the different ways to implement role-based UI rendering
        </p>
      </div>

      <Example1_UsePermissionsHook />
      <Example2_RoleBasedRenderComponent />
      <Example3_WithRoleProtectionHOC />
      <Example4_WithConditionalRenderHOC />
      <Example5_ComplexPermissions />

      <Card title="Summary">
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-600">
            Choose the right approach based on your needs:
          </p>
          <ul className="text-gray-600 space-y-2">
            <li>
              <strong>usePermissions Hook:</strong> Best for inline conditional rendering and
              complex permission logic
            </li>
            <li>
              <strong>RoleBasedRender Component:</strong> Best for declarative, component-based
              conditional rendering
            </li>
            <li>
              <strong>withRoleProtection HOC:</strong> Best for protecting entire components/pages
              (shows AccessDenied)
            </li>
            <li>
              <strong>withConditionalRender HOC:</strong> Best for hiding components without showing
              AccessDenied
            </li>
            <li>
              <strong>ProtectedRoute:</strong> Best for protecting entire routes in the router
              configuration
            </li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default RoleBasedExamples;
