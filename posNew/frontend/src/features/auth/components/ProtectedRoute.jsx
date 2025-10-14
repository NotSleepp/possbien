import { Navigate, Outlet } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore.js';
import Sidebar from '../../../components/layout/Sidebar';

const ProtectedRoute = () => {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen">
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded-md"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        Menu
      </button>
      <div className={`md:block ${isSidebarOpen ? 'block' : 'hidden'} fixed md:static inset-0 z-40`}>
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRoute;