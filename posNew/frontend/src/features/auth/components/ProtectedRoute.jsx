import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore.js';
import { LoadingSpinner } from '../../../shared/components/ui';
import AccessDenied from '../../../shared/components/common/AccessDenied';

/**
 * ProtectedRoute Component
 * Wraps routes that require authentication and optionally specific roles
 * 
 * @param {Object} props
 * @param {number[]} props.allowedRoles - Array of role IDs that can access this route (optional)
 */
const ProtectedRoute = ({ allowedRoles = null }) => {
  const { user, isLoading, isAuthenticated, initializeAuth } = useAuthStore();
  const location = useLocation();
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize authentication on mount
  useEffect(() => {
    const initialize = async () => {
      setIsInitializing(true);
      await initializeAuth();
      setIsInitializing(false);
    };

    initialize();
  }, [initializeAuth]);

  // Show loading spinner while checking authentication
  if (isInitializing || isLoading) {
    return (
      <LoadingSpinner 
        fullScreen 
        size="lg" 
        text="Verificando autenticación..."
      />
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access control if allowedRoles is specified
  if (allowedRoles && !allowedRoles.includes(user.id_rol)) {
    return <AccessDenied />;
  }

  // Render protected content without layout (layout is handled by MainLayout)
  return <Outlet />;
};

export default ProtectedRoute;