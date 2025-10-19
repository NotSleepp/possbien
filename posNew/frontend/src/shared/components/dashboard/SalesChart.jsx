import PropTypes from 'prop-types';
import { 
  LineChart, 
  Line, 
  AreaChart,
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { useCSSVars } from '../../../hooks/useCSSVars';

/**
 * SalesChart Component
 * 
 * Displays sales data visualization using recharts
 * 
 * @param {Array} data - Array of sales data points
 * @param {string} type - Chart type ('line' or 'area')
 * @param {boolean} isLoading - Loading state
 */
const SalesChart = ({ data = [], type = 'area', isLoading = false }) => {
  // Read theme-based colors
  const { getVar } = useCSSVars();
  const primary = getVar('--color-primary', '#3b82f6');
  const border = getVar('--color-base-300', '#e5e7eb');
  const content = getVar('--color-base-content', '#6b7280');
  if (isLoading) {
    return (
      <div className="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300">
        <div className="animate-pulse">
          <div className="h-6 bg-base-300 rounded w-48 mb-6"></div>
          <div className="h-64 bg-base-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300">
        <h3 className="text-lg font-semibold text-base-content mb-4">Ventas del Período</h3>
        <div className="h-64 flex items-center justify-center text-base-content/50">
          <p>No hay datos disponibles</p>
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-base-100 p-3 rounded-lg shadow-lg border border-base-300">
          <p className="text-sm font-medium text-base-content mb-1">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: ${entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-base-100 p-6 rounded-lg shadow-sm border border-base-300">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-base-content">Ventas del Período</h3>
        <p className="text-sm text-base-content/70 mt-1">Evolución de ventas en los últimos días</p>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        {type === 'area' ? (
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={primary} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={primary} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={border} />
            <XAxis 
              dataKey="name" 
              stroke={content}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={content}
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px', color: content }}
              iconType="circle"
            />
            <Area 
              type="monotone" 
              dataKey="ventas" 
              name="Ventas"
              stroke={primary} 
              strokeWidth={2}
              fill="url(#colorSales)"
            />
          </AreaChart>
        ) : (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke={border} />
            <XAxis 
              dataKey="name" 
              stroke={content}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke={content}
              style={{ fontSize: '12px' }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              wrapperStyle={{ fontSize: '14px', color: content }}
              iconType="circle"
            />
            <Line 
              type="monotone" 
              dataKey="ventas" 
              name="Ventas"
              stroke={primary} 
              strokeWidth={2}
              dot={{ fill: primary, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

SalesChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      ventas: PropTypes.number.isRequired
    })
  ),
  type: PropTypes.oneOf(['line', 'area']),
  isLoading: PropTypes.bool
};

export default SalesChart;
