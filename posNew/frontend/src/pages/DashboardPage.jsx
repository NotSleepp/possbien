import { useState, useEffect } from 'react';
import { 
  FiDollarSign, 
  FiPackage, 
  FiUsers, 
  FiShoppingCart,
  FiTrendingUp 
} from 'react-icons/fi';
import { MetricCard } from '../shared/components/ui';
import { SalesChart, RecentActivity } from '../shared/components/dashboard';

const DashboardPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [metricsData, setMetricsData] = useState(null);
  const [salesChartData, setSalesChartData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);

  // Simulate data fetching
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data - Replace with actual API calls
      setMetricsData({
        totalSales: {
          value: '$45,231',
          trend: { value: 12.5, isPositive: true }
        },
        totalProducts: {
          value: '350',
          trend: { value: 5.2, isPositive: true }
        },
        activeUsers: {
          value: '45',
          trend: { value: 2.1, isPositive: false }
        },
        totalOrders: {
          value: '128',
          trend: { value: 8.3, isPositive: true }
        }
      });

      setSalesChartData([
        { name: 'Lun', ventas: 4200 },
        { name: 'Mar', ventas: 3800 },
        { name: 'Mié', ventas: 5100 },
        { name: 'Jue', ventas: 4600 },
        { name: 'Vie', ventas: 6200 },
        { name: 'Sáb', ventas: 7800 },
        { name: 'Dom', ventas: 5400 }
      ]);

      setRecentActivities([
        {
          id: 1,
          type: 'sale',
          title: 'Nueva Venta',
          description: 'Venta #1234 - Cliente: Juan Pérez',
          amount: 1250,
          status: 'completed',
          date: '2 min ago'
        },
        {
          id: 2,
          type: 'product',
          title: 'Producto Actualizado',
          description: 'Stock actualizado - Laptop Dell XPS',
          amount: null,
          status: 'completed',
          date: '15 min ago'
        },
        {
          id: 3,
          type: 'payment',
          title: 'Pago Recibido',
          description: 'Pago #5678 - Transferencia bancaria',
          amount: 3400,
          status: 'processing',
          date: '1 hora ago'
        },
        {
          id: 4,
          type: 'user',
          title: 'Nuevo Usuario',
          description: 'Usuario registrado - María González',
          amount: null,
          status: 'completed',
          date: '2 horas ago'
        },
        {
          id: 5,
          type: 'sale',
          title: 'Venta Cancelada',
          description: 'Venta #1230 - Cancelada por cliente',
          amount: 890,
          status: 'cancelled',
          date: '3 horas ago'
        }
      ]);

      setIsLoading(false);
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas Totales"
          value={metricsData?.totalSales?.value ?? '-'}
          icon={FiDollarSign}
          trend={metricsData?.totalSales?.trend}
          color="blue"
          isLoading={isLoading}
        />
        <MetricCard
          title="Productos"
          value={metricsData?.totalProducts?.value ?? '-'}
          icon={FiPackage}
          trend={metricsData?.totalProducts?.trend}
          color="green"
          isLoading={isLoading}
        />
        <MetricCard
          title="Usuarios Activos"
          value={metricsData?.activeUsers?.value ?? '-'}
          icon={FiUsers}
          trend={metricsData?.activeUsers?.trend}
          color="purple"
          isLoading={isLoading}
        />
        <MetricCard
          title="Pedidos"
          value={metricsData?.totalOrders?.value ?? '-'}
          icon={FiShoppingCart}
          trend={metricsData?.totalOrders?.trend}
          color="orange"
          isLoading={isLoading}
        />
      </div>

      {/* Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="dashboard-card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-base-content">Ventas del Mes</h2>
              <div className="flex gap-2">
                <button className="px-3 py-1 text-sm bg-primary text-primary-content rounded-md">
                  Mes
                </button>
                <button className="px-3 py-1 text-sm text-base-content/60 hover:text-base-content">
                  Año
                </button>
              </div>
            </div>
            <SalesChart data={salesChartData} isLoading={isLoading} />
          </div>
        </div>
        
        {/* Quick Stats Card */}
        <div className="dashboard-card">
          <div className="flex items-center gap-3 mb-6">
            <FiTrendingUp className="text-2xl text-primary" />
            <h3 className="text-lg font-semibold text-base-content">Estadísticas Rápidas</h3>
          </div>
          
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-base-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-base-content/60">Venta Promedio</p>
                <p className="text-2xl font-bold text-base-content">${5400}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Tasa de Conversión</p>
                <p className="text-2xl font-bold text-base-content">{3.2}%</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Productos Más Vendidos</p>
                <p className="text-2xl font-bold text-base-content">{"Laptop, Mouse, Teclado"}</p>
              </div>
              <div>
                <p className="text-sm text-base-content/60">Nuevos Clientes</p>
                <p className="text-2xl font-bold text-base-content">{12}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="dashboard-card">
        <h3 className="text-lg font-semibold text-base-content mb-6">Actividad Reciente</h3>
        <RecentActivity activities={recentActivities} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default DashboardPage;