import PropTypes from 'prop-types';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

/**
 * MetricCard Component
 * 
 * Displays a key metric with icon, value, and optional trend indicator
 * 
 * @param {string} title - The metric title
 * @param {string|number} value - The metric value to display
 * @param {ReactNode} icon - Icon component to display
 * @param {Object} trend - Optional trend data
 * @param {number} trend.value - Percentage change
 * @param {boolean} trend.isPositive - Whether the trend is positive
 * @param {string} color - Color variant (blue, green, purple, orange, red)
 * @param {string} subtitle - Optional subtitle text
 * @param {boolean} isLoading - Loading state
 */
const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  color = 'blue',
  subtitle,
  isLoading = false 
}) => {
  const colorClasses = {
    blue: {
      bg: 'bg-blue-50',
      icon: 'text-blue-600',
      value: 'text-blue-600',
      trend: 'bg-blue-100 text-blue-700'
    },
    green: {
      bg: 'bg-green-50',
      icon: 'text-green-600',
      value: 'text-green-600',
      trend: 'bg-green-100 text-green-700'
    },
    purple: {
      bg: 'bg-purple-50',
      icon: 'text-purple-600',
      value: 'text-purple-600',
      trend: 'bg-purple-100 text-purple-700'
    },
    orange: {
      bg: 'bg-orange-50',
      icon: 'text-orange-600',
      value: 'text-orange-600',
      trend: 'bg-orange-100 text-orange-700'
    },
    red: {
      bg: 'bg-red-50',
      icon: 'text-red-600',
      value: 'text-red-600',
      trend: 'bg-red-100 text-red-700'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
          <div className={`w-12 h-12 ${colors.bg} rounded-lg`}></div>
        </div>
        <div className="h-8 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        </div>
        <div className={`p-3 ${colors.bg} rounded-lg`}>
          <div className={`text-2xl ${colors.icon}`}>
            {icon}
          </div>
        </div>
      </div>
      
      <div className="mb-2">
        <p className={`text-3xl font-bold ${colors.value}`}>
          {value}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}
        
        {trend && (
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${colors.trend}`}>
            {trend.isPositive ? (
              <FiTrendingUp className="w-3 h-3" />
            ) : (
              <FiTrendingDown className="w-3 h-3" />
            )}
            <span>{Math.abs(trend.value)}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.node.isRequired,
  trend: PropTypes.shape({
    value: PropTypes.number.isRequired,
    isPositive: PropTypes.bool.isRequired
  }),
  color: PropTypes.oneOf(['blue', 'green', 'purple', 'orange', 'red']),
  subtitle: PropTypes.string,
  isLoading: PropTypes.bool
};

export default MetricCard;
