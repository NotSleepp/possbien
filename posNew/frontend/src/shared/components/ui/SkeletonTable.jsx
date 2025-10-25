import Skeleton from './Skeleton';

/**
 * SkeletonTable Component
 * Pre-built skeleton loader for table layouts
 * 
 * @param {Object} props
 * @param {number} props.rows - Number of rows to display
 * @param {number} props.columns - Number of columns to display
 * @param {boolean} props.hasActions - Whether to show action column
 * @param {string} props.className - Additional CSS classes
 */
const SkeletonTable = ({
  rows = 5,
  columns = 4,
  hasActions = true,
  className = '',
}) => {
  const totalColumns = hasActions ? columns + 1 : columns;

  return (
    <div className={`bg-base-100 rounded-lg shadow-sm border border-base-300 overflow-hidden ${className}`}>
      {/* Table Header */}
      <div className="bg-base-200 border-b border-base-300 px-6 py-3">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${totalColumns}, 1fr)` }}>
          {Array.from({ length: totalColumns }).map((_, index) => (
            <Skeleton key={`header-${index}`} variant="text" width="80px" height="12px" />
          ))}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-base-300">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={`row-${rowIndex}`} className="px-6 py-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${totalColumns}, 1fr)` }}>
              {Array.from({ length: totalColumns }).map((_, colIndex) => (
                <Skeleton
                  key={`cell-${rowIndex}-${colIndex}`}
                  variant="text"
                  width={colIndex === totalColumns - 1 && hasActions ? '60px' : '100%'}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonTable;
