import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  FiBarChart2, 
  FiPackage, 
  FiSettings, 
  FiShoppingCart,
  FiUsers,
  FiTrendingUp,
  FiDollarSign,
  FiArrowRight
} from 'react-icons/fi';
import { Card, MetricCard } from '../shared/components/ui';
import { USER_ROLES } from '../shared/constants';

const HomePage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  // Simulate initial data loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  // Check if user is admin
  const isAdmin = user?.id_rol === USER_ROLES.SUPER_ADMIN || user?.id_rol === USER_ROLES.ADMIN;

  // Get current time for greeting
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Buenos días';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  };

  // Quick action cards configuration
  const quickActions = [
    {
      id: 'dashboard',
      title: 'Dashboard',
      description: 'Visualiza métricas y estadísticas del negocio',
      icon: <FiBarChart2 className="w-6 h-6" />,
      color: 'blue',
      path: '/dashboard',
      show: true,
    },
    {
      id: 'products',
      title: 'Productos',
      description: 'Gestiona el inventario de productos',
      icon: <FiPackage className="w-6 h-6" />,
      color: 'purple',
      path: '/products',
      show: true,
    },
    {
      id: 'sales',
      title: 'Ventas',
      description: 'Registra y consulta ventas realizadas',
      icon: <FiShoppingCart className="w-6 h-6" />,
      color: 'green',
      path: '/sales',
      show: true,
    },
    {
      id: 'settings',
      title: 'Configuración',
      description: 'Administra usuarios y configuración del sistema',
      icon: <FiSettings className="w-6 h-6" />,
      color: 'orange',
      path: '/settings',
      show: isAdmin,
    },
  ];

  // Filter actions based on permissions
  const visibleActions = quickActions.filter(action => action.show);

  // Color classes for quick action cards
  const colorClasses = {
    blue: {
      bg: 'bg-info/10',
      icon: 'text-info',
      hover: 'hover:bg-info/20',
    },
    purple: {
      bg: 'bg-accent/10',
      icon: 'text-accent',
      hover: 'hover:bg-accent/20',
    },
    green: {
      bg: 'bg-success/10',
      icon: 'text-success',
      hover: 'hover:bg-success/20',
    },
    orange: {
      bg: 'bg-warning/10',
      icon: 'text-warning',
      hover: 'hover:bg-warning/20',
    },
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary to-primary/90 rounded-lg shadow-lg p-8 text-primary-content">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              {getGreeting()}, {user?.nombre || user?.username}!
            </h1>
            <p className="text-primary-content/80 text-lg">
              Bienvenido a tu sistema POS. Aquí tienes un resumen de tu negocio.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <div className="bg-primary-content/20 backdrop-blur-sm rounded-lg px-4 py-2 text-center">
              <p className="text-sm text-primary-content/80">Rol</p>
              <p className="text-lg font-semibold">
                {user?.id_rol === USER_ROLES.SUPER_ADMIN ? 'Super Admin' : 
                 user?.id_rol === USER_ROLES.ADMIN ? 'Administrador' : 'Empleado'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div>
        <h2 className="text-2xl font-bold text-base-content mb-4">Resumen del Día</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <MetricCard
            title="Ventas de Hoy"
            value="$12,450"
            icon={<FiDollarSign />}
            color="green"
            trend={{ value: 12.5, isPositive: true }}
            subtitle="vs. ayer"
            isLoading={isLoading}
          />
          <MetricCard
            title="Productos Vendidos"
            value="156"
            icon={<FiShoppingCart />}
            color="blue"
            trend={{ value: 8.2, isPositive: true }}
            subtitle="vs. ayer"
            isLoading={isLoading}
          />
          <MetricCard
            title="Productos en Stock"
            value="1,234"
            icon={<FiPackage />}
            color="purple"
            subtitle="total disponible"
            isLoading={isLoading}
          />
          <MetricCard
            title="Clientes Atendidos"
            value="89"
            icon={<FiUsers />}
            color="orange"
            trend={{ value: 5.1, isPositive: true }}
            subtitle="vs. ayer"
            isLoading={isLoading}
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-base-content mb-4">Accesos Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {visibleActions.map((action) => {
            const colors = colorClasses[action.color];
            return (
              <button
                key={action.id}
                onClick={() => navigate(action.path)}
                className="bg-base-100 rounded-lg shadow-sm border border-base-300 p-6 text-left transition-all duration-200 hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 ${colors.bg} rounded-lg ${colors.hover} transition-colors duration-200`}>
                    <div className={colors.icon}>
                      {action.icon}
                    </div>
                  </div>
                  <FiArrowRight className="text-base-content/40 w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-base-content mb-2">
                  {action.title}
                </h3>
                <p className="text-sm text-base-content/70">
                  {action.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recent Activity or Tips Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          title="Consejos Rápidos"
          icon={<FiTrendingUp className="w-5 h-5" />}
          variant="outlined"
        >
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-base-content/70">
                Revisa el inventario regularmente para evitar productos agotados
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-base-content/70">
                Mantén actualizados los precios de tus productos
              </p>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-sm text-base-content/70">
                Consulta el dashboard para ver tendencias de ventas
              </p>
            </li>
          </ul>
        </Card>

        <Card
          title="Información del Sistema"
          icon={<FiSettings className="w-5 h-5" />}
          variant="outlined"
        >
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-base-300">
              <span className="text-sm text-base-content/60">Empresa</span>
              <span className="text-sm font-medium text-base-content">
                {user?.id_empresa ? `Empresa #${user.id_empresa}` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-base-300">
              <span className="text-sm text-base-content/60">Sucursal</span>
              <span className="text-sm font-medium text-base-content">
                {user?.id_sucursal ? `Sucursal #${user.id_sucursal}` : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-base-content/60">Usuario</span>
              <span className="text-sm font-medium text-base-content">
                {user?.username}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;