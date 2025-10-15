/**
 * withRoleProtection HOC
 * Higher-Order Component for protecting components based on user roles
 */

import { useAuthStore } from '../../store/useAuthStore';
import { hasAnyRole } from '../../utils/permissions';
import AccessDenied from './AccessDenied';
import LoadingSpinner from '../ui/LoadingSpinner';

/**
 * HOC that wraps a component and checks if the user has the required roles
 * @param {React.Component} Component - Component to wrap
 * @param {number[]} allowedRoles - Array of role IDs that can access the component
 * @param {Object} options - Additional options
 * @param {React.Component} options.fallback - Custom fallback component (default: AccessDenied)
 * @param {boolean} options.showLoading - Show loading spinner while checking auth (default: true)
 * @returns {React.Component} - Wrapped component
 */
export const withRoleProtection = (
  Component,
  allowedRoles,
  options = {}
) => {
  const {
    fallback: FallbackComponent = AccessDenied,
    showLoading = true,
  } = options;

  return function ProtectedComponent(props) {
    const { user, isLoading, isAuthenticated } = useAuthStore();

    // Show loading spinner while checking authentication
    if (showLoading && isLoading) {
      return (
        <LoadingSpinner
          fullScreen
          size="lg"
          text="Verificando permisos..."
        />
      );
    }

    // Check if user is authenticated
    if (!isAuthenticated || !user) {
      return <FallbackComponent />;
    }

    // Check if user has required roles
    if (!hasAnyRole(user, allowedRoles)) {
      return <FallbackComponent />;
    }

    // Render the protected component
    return <Component {...props} />;
  };
};

/**
 * HOC that conditionally renders a component based on user roles
 * If user doesn't have permission, returns null instead of showing AccessDenied
 * @param {React.Component} Component - Component to wrap
 * @param {number[]} allowedRoles - Array of role IDs that can access the component
 * @returns {React.Component} - Wrapped component or null
 */
export const withConditionalRender = (Component, allowedRoles) => {
  return function ConditionalComponent(props) {
    const { user, isAuthenticated } = useAuthStore();

    // Don't render if not authenticated or doesn't have permission
    if (!isAuthenticated || !user || !hasAnyRole(user, allowedRoles)) {
      return null;
    }

    // Render the component
    return <Component {...props} />;
  };
};

export default withRoleProtection;
