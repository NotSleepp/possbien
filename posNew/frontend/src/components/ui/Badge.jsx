/**
 * Badge Component
 * Reusable badge for status indicators and labels
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Badge content
 * @param {'primary' | 'success' | 'danger' | 'warning' | 'gray' | 'info' | 'error'} props.variant - Badge color variant
 * @param {'sm' | 'md' | 'lg'} props.size - Badge size
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {boolean} props.dot - Show dot indicator
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onRemove - Remove handler (shows X button)
 */
const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  icon = null,
  dot = false,
  className = '',
  onRemove,
}) => {
  // Base styles
  const baseStyles = 'inline-flex items-center font-medium rounded-full transition-colors duration-200';

  // Variant styles
  const variantStyles = {
    primary: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    danger: 'bg-red-100 text-red-800',
    warning: 'bg-yellow-100 text-yellow-800',
    gray: 'bg-gray-100 text-gray-800',
    info: 'bg-blue-100 text-blue-800',
    error: 'bg-red-100 text-red-800',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs gap-1',
    md: 'px-2.5 py-1 text-sm gap-1.5',
    lg: 'px-3 py-1.5 text-base gap-2',
  };

  // Dot color styles
  const dotColorStyles = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    danger: 'bg-red-600',
    warning: 'bg-yellow-600',
    gray: 'bg-gray-600',
    info: 'bg-blue-600',
    error: 'bg-red-600',
  };

  const badgeClasses = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`;

  return (
    <span className={badgeClasses}>
      {/* Dot Indicator */}
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColorStyles[variant]}`}
          aria-hidden="true"
        />
      )}

      {/* Icon */}
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Content */}
      <span>{children}</span>

      {/* Remove Button */}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="flex-shrink-0 ml-1 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-current rounded-full"
          aria-label="Eliminar"
        >
          <svg
            className="w-3 h-3"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;
