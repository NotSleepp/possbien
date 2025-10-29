import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import PageTransition from '../common/PageTransition';
import { useUIStore } from '../../../store/useUIStore';

const MainLayout = () => {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 768 && isSidebarOpen) {
      toggleSidebar();
    }
  }, [location.pathname]);

  // Get page title based on current route
  const getPageTitle = () => {
    const titles = {
      '/': 'Inicio',
      '/dashboard': 'Dashboard',
      '/products': 'Productos',
      '/sales': 'Ventas',
      '/reports': 'Reportes',
      '/users': 'Usuarios',
      '/settings': 'Configuración',
      '/settings/printers': 'Impresoras',
      '/settings/payment-methods': 'Métodos de Pago',
      '/settings/company': 'Empresa',
      '/settings/categories': 'Categorías de productos',
      '/settings/customers': 'Clientes',
      '/settings/providers': 'Proveedores',
      '/settings/branches-cajas': 'Sucursales y cajas',
      '/settings/users': 'Usuarios',
      '/settings/warehouses': 'Almacenes',
      '/settings/ticket': 'Configuración de ticket',
      '/settings/serialization': 'Serialización de comprobantes',
    };
    return titles[location.pathname] || 'POS System';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-base-100">
      {/* Sidebar - Desktop: always visible, Mobile: drawer */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-30 w-64 transform transition-transform duration-300 ease-in-out
          md:relative md:translate-x-0
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <Sidebar onClose={toggleSidebar} />
      </aside>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-base-content/50 z-20 md:hidden"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Main content area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <Header title={getPageTitle()} />

        {/* Page content */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="w-full h-full px-4 py-6 md:px-6 md:py-8">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
