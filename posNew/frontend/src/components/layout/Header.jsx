import { useState } from 'react';
import { FiMenu, FiUser, FiLogOut, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { useUIStore } from '../../store/useUIStore';
import Modal from '../ui/Modal';

const Header = ({ title }) => {
  const { user, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowLogoutModal(false);
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    navigate('/settings');
  };

  const getRoleName = (roleId) => {
    const roles = {
      1: 'Super Administrador',
      2: 'Administrador',
      3: 'Gerente',
      4: 'Cajero',
      5: 'Empleado',
    };
    return roles[roleId] || 'Usuario';
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          {/* Left section: Menu button and title */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors md:hidden"
              aria-label="Toggle menu"
            >
              <FiMenu size={24} />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              {title}
            </h1>
          </div>

          {/* Right section: User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="User menu"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                {user?.nombre ? user.nombre.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-medium text-gray-800">
                  {user?.nombre && user?.apellido 
                    ? `${user.nombre} ${user.apellido}` 
                    : user?.username}
                </p>
                <p className="text-xs text-gray-500">
                  {getRoleName(user?.id_rol)}
                </p>
              </div>
            </button>

            {/* Dropdown menu */}
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowUserMenu(false)}
                />
                
                {/* Menu */}
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                  {/* User info */}
                  <div className="px-4 py-3 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-800">
                      {user?.nombre && user?.apellido 
                        ? `${user.nombre} ${user.apellido}` 
                        : user?.username}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {user?.email || user?.username}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {getRoleName(user?.id_rol)}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/');
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <FiUser size={16} />
                      <span>Mi Perfil</span>
                    </button>
                    
                    {(user?.id_rol === 1 || user?.id_rol === 2) && (
                      <button
                        onClick={handleSettingsClick}
                        className="flex items-center gap-3 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        <FiSettings size={16} />
                        <span>Configuración</span>
                      </button>
                    )}
                  </div>

                  {/* Logout */}
                  <div className="border-t border-gray-200 pt-1">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowLogoutModal(true);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <FiLogOut size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirmar Cierre de Sesión"
        onConfirm={handleLogout}
        confirmText="Cerrar Sesión"
        cancelText="Cancelar"
        variant="danger"
      >
        <p className="text-gray-600">
          ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
        </p>
      </Modal>
    </>
  );
};

export default Header;
