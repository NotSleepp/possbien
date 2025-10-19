import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  FiHome, 
  FiBarChart2, 
  FiPackage, 
  FiShoppingCart, 
  FiFileText, 
  FiUsers, 
  FiSettings, 
  FiLogOut,
  FiX
} from 'react-icons/fi';
import { useAuthStore } from '../../../store/useAuthStore';
import { useToastStore } from '../../../store/useToastStore';
import Modal from '../ui/Modal';
import { filterMenuByPermissions, getUserRoleName } from '../../../utils/permissions';

const Sidebar = ({ onClose }) => {
  const { user, logout } = useAuthStore();
  const { info: showInfoToast } = useToastStore();
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    showInfoToast('Sesión cerrada correctamente. ¡Hasta pronto!');
    navigate('/login');
    setShowLogoutModal(false);
  };

  // Define menu items with role-based visibility
  const menuItems = [
    {
      path: '/',
      label: 'Home',
      icon: FiHome,
      roles: [1, 2, 3, 4, 5], // All roles
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: FiBarChart2,
      roles: [1, 2, 3, 4, 5], // All roles
    },
    {
      path: '/products',
      label: 'Productos',
      icon: FiPackage,
      roles: [1, 2, 3, 4, 5], // All roles
    },
    {
      path: '/sales',
      label: 'Ventas',
      icon: FiShoppingCart,
      roles: [1, 2, 3, 4, 5], // All roles
    },
    {
      path: '/reports',
      label: 'Reportes',
      icon: FiFileText,
      roles: [1, 2, 3], // Admin, Manager roles
    },
    {
      path: '/users',
      label: 'Usuarios',
      icon: FiUsers,
      roles: [1, 2], // Super Admin, Admin only
    },
    {
      path: '/settings',
      label: 'Configuración',
      icon: FiSettings,
      roles: [1, 2], // Super Admin, Admin only
    },
  ];

  // Filter menu items based on user role using utility function
  const visibleMenuItems = filterMenuByPermissions(menuItems, user);

  return (
    <>
      <div className="flex h-full w-full md:w-64 flex-col bg-base-200 text-base-content overflow-y-auto">
        {/* Mobile close button */}
        <div className="md:hidden flex justify-end p-4">
          <button
            onClick={onClose}
            className="text-base-content hover:text-base-content/70 transition-colors"
            aria-label="Cerrar menú"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Logo/Brand */}
        <div className="flex items-center justify-center py-6 px-4 border-b border-base-300">
          <h1 className="text-2xl font-bold text-base-content">POS System</h1>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => onClose && onClose()}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-content shadow-lg ring-1 ring-primary font-medium !text-white'
                      : 'text-base-content/70 hover:bg-primary/10 hover:text-base-content'
                  }`
                }
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* User Info and Logout */}
        <div className="border-t border-base-300 p-4">
          {/* User Information */}
          {user && (
            <div className="mb-4 px-2">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-content font-semibold">
                  {user.nombre ? user.nombre.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-content truncate">
                    {user.nombre && user.apellido 
                      ? `${user.nombre} ${user.apellido}` 
                      : user.username}
                  </p>
                  <p className="text-xs text-base-content/60 truncate">
                    {user.email || user.username}
                  </p>
                </div>
              </div>
              <div className="text-xs text-base-content/60">
                {getUserRoleName(user)}
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-base-content/70 hover:bg-error hover:text-error-content transition-all duration-200"
          >
            <FiLogOut size={20} />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </div>

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
        <p className="text-base-content/70">
          ¿Estás seguro de que deseas cerrar sesión? Tendrás que volver a iniciar sesión para acceder al sistema.
        </p>
      </Modal>
    </>
  );
};

export default Sidebar;