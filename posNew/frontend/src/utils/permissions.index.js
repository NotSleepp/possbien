/**
 * Permissions Module - Central Export
 * Import everything you need from one place
 */

// Export all permission utilities
export {
  hasRole,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  isManagerOrHigher,
  canAccessModule,
  canPerformAction,
  getUserRoleName,
  filterMenuByPermissions,
} from './permissions';

// Export permission hook
export { usePermissions } from '../hooks/usePermissions';

// Export permission components
export { default as RoleBasedRender } from '../components/common/RoleBasedRender';
export {
  withRoleProtection,
  withConditionalRender,
} from '../components/common/withRoleProtection';

// Export constants
export { USER_ROLES, ROLE_NAMES } from './constants';

/**
 * Usage Examples:
 * 
 * // Import everything
 * import { usePermissions, RoleBasedRender, withRoleProtection, USER_ROLES } from '../utils/permissions.index';
 * 
 * // Or import specific items
 * import { usePermissions, USER_ROLES } from '../utils/permissions.index';
 */
