/**
 * usePermissions Hook
 * Custom hook for checking user permissions in components
 */

import { useAuthStore } from '../store/useAuthStore';
import {
  hasRole,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  isManagerOrHigher,
  canAccessModule,
  canPerformAction,
  getUserRoleName,
} from '../utils/permissions';

/**
 * Hook that provides permission checking functions
 * @returns {Object} - Permission checking functions and user info
 */
export const usePermissions = () => {
  const { user, isAuthenticated } = useAuthStore();

  return {
    user,
    isAuthenticated,
    hasRole: (roleId) => hasRole(user, roleId),
    hasAnyRole: (roleIds) => hasAnyRole(user, roleIds),
    isAdmin: () => isAdmin(user),
    isSuperAdmin: () => isSuperAdmin(user),
    isManagerOrHigher: () => isManagerOrHigher(user),
    canAccessModule: (module) => canAccessModule(user, module),
    canPerformAction: (action, resource) => canPerformAction(user, action, resource),
    getUserRoleName: () => getUserRoleName(user),
  };
};

export default usePermissions;
