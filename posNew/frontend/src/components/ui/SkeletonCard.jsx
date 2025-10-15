import Skeleton from './Skeleton';

/**
 * SkeletonCard Component
 * Pre-built skeleton loader for card layouts
 * 
 * @param {Object} props
 * @param {boolean} props.hasImage - Whether to show image skeleton
 * @param {boolean} props.hasActions - Whether to show action buttons skeleton
 * @param {number} props.lines - Number of text lines
 * @param {string} props.className - Additional CSS classes
 */
const SkeletonCard = ({
  hasImage = false,
  hasActions = false,
  lines = 3,
  className = '',
}) => {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-200 ${className}`}>
      {hasImage && (
        <Skeleton variant="rectangle" height="200px" className="mb-4" />
      )}
      
      <Skeleton variant="title" className="mb-3" />
      <Skeleton variant="text" lines={lines} className="mb-4" />
      
      {hasActions && (
        <div className="flex gap-2 mt-4">
          <Skeleton variant="button" width="100px" />
          <Skeleton variant="button" width="100px" />
        </div>
      )}
    </div>
  );
};

export default SkeletonCard;
