import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiMenu } from 'react-icons/fi';
import { useAuthStore } from '../../../store/useAuthStore.js';
import Sidebar from '../../../components/layout/Sidebar';
import LoadingSpinner from '../../../components/ui/LoadingSpinner';
import AccessDenied from '../../../components/common/AccessDenied';

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  // Render protected content with layout
  return (
    <div className="flex h-screen">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-lg shadow-lg hover:bg-gray-700 transition-colors"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Abrir menú"
      >
        <FiMenu size={24} />
      </button>

      {/* Sidebar - drawer on mobile, fixed on desktop */}
      <div className={`md:block ${isSidebarOpen ? 'block' : 'hidden'} fixed md:static inset-0 z-40`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex-1 overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;