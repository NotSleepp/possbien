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
      bg: 'bg-primary/20',
      icon: 'text-primary',
      value: 'text-base-content',
      trend: 'bg-primary/30 text-primary',
      border: 'metric-card-blue'
    },
    green: {
      bg: 'bg-secondary/20',
      icon: 'text-secondary',
      value: 'text-base-content',
      trend: 'bg-secondary/30 text-secondary',
      border: 'metric-card-green'
    },
    purple: {
      bg: 'bg-info/20',
      icon: 'text-info',
      value: 'text-base-content',
      trend: 'bg-info/30 text-info',
      border: 'metric-card-purple'
    },
    orange: {
      bg: 'bg-accent/20',
      icon: 'text-accent',
      value: 'text-base-content',
      trend: 'bg-accent/30 text-accent',
      border: 'metric-card-orange'
    },
    red: {
      bg: 'bg-error/20',
      icon: 'text-error',
      value: 'text-base-content',
      trend: 'bg-error/30 text-error',
      border: 'metric-card-red'
    }
  };

  const colors = colorClasses[color] || colorClasses.blue;

  if (isLoading) {
    return (
      <div className={`dashboard-card ${colors.border} animate-pulse`}>
        <div className="flex items-start justify-between mb-4">
          <div className="h-4 bg-base-300 rounded w-24"></div>
          <div className={`w-12 h-12 ${colors.bg} rounded-lg`}></div>
        </div>
        <div className="h-8 bg-base-300 rounded w-32 mb-2"></div>
        <div className="h-3 bg-base-300 rounded w-20"></div>
      </div>
    );
  }

  return (
    <div className={`dashboard-card ${colors.border}`}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-medium text-base-content/70 uppercase tracking-wide">{title}</h3>
        </div>
        <div className={`p-3 ${colors.bg} rounded-xl`}>
          <div className={`text-2xl ${colors.icon}`}>
            {icon}
          </div>
        </div>
      </div>
      
      <div className="mb-3">
        <p className={`text-3xl font-bold ${colors.value}`}>
          {value}
        </p>
      </div>

      <div className="flex items-center justify-between">
        {subtitle && (
          <p className="text-sm text-base-content/60">{subtitle}</p>
        )}
        
        {trend && (
          <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${colors.trend}`}>
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
