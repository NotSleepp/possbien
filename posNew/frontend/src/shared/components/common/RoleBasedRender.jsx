/**
 * RoleBasedRender Component
 * Conditionally renders children based on user roles
 */

import { useAuthStore } from '../../../store/useAuthStore';
import { hasAnyRole } from '../../../utils/permissions';

/**
 * Component that conditionally renders children based on user roles
 * @param {Object} props
 * @param {number[]} props.allowedRoles - Array of role IDs that can see the content
 * @param {React.ReactNode} props.children - Content to render if user has permission
 * @param {React.ReactNode} props.fallback - Content to render if user doesn't have permission (optional)
 * @returns {React.ReactNode} - Children or fallback
 */
const RoleBasedRender = ({ allowedRoles, children, fallback = null }) => {
  const { user, isAuthenticated } = useAuthStore();

  // Don't render if not authenticated
  if (!isAuthenticated || !user) {
    return fallback;
  }

  // Check if user has required roles
  if (!hasAnyRole(user, allowedRoles)) {
    return fallback;
  }

  // Render children
  return <>{children}</>;
};

export default RoleBasedRender;
