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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Ventas Totales"
          value={metricsData?.totalSales.value || '$0'}
          icon={<FiDollarSign />}
          color="blue"
          subtitle="Este mes"
          trend={metricsData?.totalSales.trend}
          isLoading={isLoading}
        />
        <MetricCard
          title="Productos"
          value={metricsData?.totalProducts.value || '0'}
          icon={<FiPackage />}
          color="green"
          subtitle="En inventario"
          trend={metricsData?.totalProducts.trend}
          isLoading={isLoading}
        />
        <MetricCard
          title="Usuarios Activos"
          value={metricsData?.activeUsers.value || '0'}
          icon={<FiUsers />}
          color="purple"
          subtitle="Hoy"
          trend={metricsData?.activeUsers.trend}
          isLoading={isLoading}
        />
        <MetricCard
          title="Órdenes"
          value={metricsData?.totalOrders.value || '0'}
          icon={<FiShoppingCart />}
          color="orange"
          subtitle="Esta semana"
          trend={metricsData?.totalOrders.trend}
          isLoading={isLoading}
        />
      </div>

      {/* Sales Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart 
            data={salesChartData} 
            type="area"
            isLoading={isLoading}
          />
        </div>
        
        {/* Quick Stats Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <FiTrendingUp className="text-green-600 text-xl" />
            <h3 className="text-lg font-semibold text-gray-800">Resumen Rápido</h3>
          </div>
          
          {isLoading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Promedio de Venta</p>
                <p className="text-2xl font-bold text-gray-800">$353</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tasa de Conversión</p>
                <p className="text-2xl font-bold text-gray-800">68%</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Productos Más Vendidos</p>
                <p className="text-2xl font-bold text-gray-800">24</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Clientes Nuevos</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity Table */}
      <RecentActivity 
        activities={recentActivities}
        isLoading={isLoading}
      />
    </div>
  );
};

export default DashboardPage;