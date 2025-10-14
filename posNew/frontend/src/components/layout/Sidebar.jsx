import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const Sidebar = ({ onClose }) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex h-full w-full md:w-64 flex-col bg-gray-800 text-white overflow-y-auto">
      <button
        className="md:hidden self-end p-4 text-white"
        onClick={onClose}
      >
        Cerrar
      </button>
      <div className="flex items-center justify-center py-4 text-2xl font-bold">
        POS System
      </div>
      <nav className="mt-10 flex-1 px-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `block rounded px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          Home
        </NavLink>
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `block rounded px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `block rounded px-4 py-2 hover:bg-gray-700 ${isActive ? 'bg-gray-700' : ''}`
          }
        >
          Products
        </NavLink>
        <button
          onClick={handleLogout}
          className="block w-full rounded px-4 py-2 text-left hover:bg-gray-700"
        >
          Logout
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;