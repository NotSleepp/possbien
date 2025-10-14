import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

const HomePage = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Página de Inicio</h1>
      <p>Bienvenido al sistema POS.</p>
      <button onClick={handleLogout} className="mt-4 p-2 bg-red-500 text-white">
        Cerrar Sesión
      </button>
    </div>
  );
};

export default HomePage;