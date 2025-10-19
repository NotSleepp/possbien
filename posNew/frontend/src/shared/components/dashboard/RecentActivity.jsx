import PropTypes from 'prop-types';
import { FiShoppingCart, FiPackage, FiUser, FiDollarSign } from 'react-icons/fi';
import { Badge } from '../ui';

/**
 * RecentActivity Component
 * 
 * Displays a table of recent activities/transactions
 * 
 * @param {Array} activities - Array of activity objects
 * @param {boolean} isLoading - Loading state
 */
const RecentActivity = ({ activities = [], isLoading = false }) => {
  const getActivityIcon = (type) => {
    const icons = {
      sale: <FiShoppingCart className="w-5 h-5 text-success" />, // green → success
      product: <FiPackage className="w-5 h-5 text-primary" />,   // blue → primary
      user: <FiUser className="w-5 h-5 text-accent" />,          // purple → accent
      payment: <FiDollarSign className="w-5 h-5 text-warning" /> // orange → warning
    };
    return icons[type] || icons.sale;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { variant: 'success', label: 'Completado' },
      pending: { variant: 'warning', label: 'Pendiente' },
      cancelled: { variant: 'error', label: 'Cancelado' },
      processing: { variant: 'info', label: 'Procesando' }
    };
    
    const config = statusConfig[status] || statusConfig.completed;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
        <div className="p-6 border-b border-base-300">
          <div className="h-6 bg-base-300 rounded w-48 animate-pulse"></div>
        </div>
        <div className="p-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center gap-4 py-3 animate-pulse">
              <div className="w-10 h-10 bg-base-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-base-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-base-300 rounded w-1/2"></div>
              </div>
              <div className="h-6 bg-base-300 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
        <div className="p-6 border-b border-base-300">
          <h3 className="text-lg font-semibold text-base-content">Actividad Reciente</h3>
        </div>
        <div className="p-12 text-center">
          <p className="text-base-content/60">No hay actividad reciente</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 rounded-lg shadow-sm border border-base-300">
      <div className="p-6 border-b border-base-300">
        <h3 className="text-lg font-semibold text-base-content">Actividad Reciente</h3>
        <p className="text-sm text-base-content/70 mt-1">Últimas transacciones y eventos</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-base-200 border-b border-base-300">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Actividad
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Descripción
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Monto
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-base-content/70 uppercase tracking-wider">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="bg-base-100 divide-y divide-base-300">
            {activities.map((activity) => (
              <tr key={activity.id} className="hover:bg-base-200 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-10 h-10 bg-base-200 rounded-full flex items-center justify-center">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="text-sm font-medium text-base-content">
                      {activity.title}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-base-content/70">{activity.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-base-content">
                    {activity.amount ? `$${activity.amount.toLocaleString()}` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {getStatusBadge(activity.status)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-base-content/70">
                  {activity.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      type: PropTypes.oneOf(['sale', 'product', 'user', 'payment']).isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      amount: PropTypes.number,
      status: PropTypes.oneOf(['completed', 'pending', 'cancelled', 'processing']).isRequired,
      date: PropTypes.string.isRequired
    })
  ),
  isLoading: PropTypes.bool
};

export default RecentActivity;
