import { useAuthStore } from '../../../store/useAuthStore';
import { AccessDenied } from '../../../shared/components/common';
import { hasPermission } from '../../../utils/permissions';

/**
 * Higher-Order Component for role-based component protection
 * Wraps a component and only renders it if the user has the required role
 * 
 * @param {React.Component} Component - Component to protect
 * @param {number[]} allowedRoles - Array of role IDs that can access this component
 * @returns {React.Component} - Protected component
 * 
 * @example
 * const ProtectedAdminPanel = withRoleProtection(AdminPanel, [USER_ROLES.SUPER_ADMIN, USER_ROLES.ADMIN]);
 */
const withRoleProtection = (Component, allowedRoles) => {
  return function ProtectedComponent(props) {
    const { user } = useAuthStore();

    // Check if user has permission
    if (!hasPermission(user, allowedRoles)) {
      return <AccessDenied />;
    }

    // Render the component if user has permission
    return <Component {...props} />;
  };
};

export default withRoleProtection;
