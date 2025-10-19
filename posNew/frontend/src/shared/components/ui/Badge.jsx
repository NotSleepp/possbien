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
  // Base styles using CSS variables
  const baseStyles = 'badge';

  // Variant styles using CSS variables
  const variantStyles = {
    primary: 'badge-primary',
    success: 'badge-success',
    danger: 'badge-error',
    warning: 'badge-warning',
    gray: 'badge-neutral',
    info: 'badge-info',
    error: 'badge-error',
  };

  // Size styles using CSS variables
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-sm px-2.5 py-1 gap-1.5',
    lg: 'text-base px-3 py-1.5 gap-2',
  };

  // Dot color styles using CSS variables
  const dotColorStyles = {
    primary: 'bg-primary',
    success: 'bg-success',
    danger: 'bg-error',
    warning: 'bg-warning',
    gray: 'bg-neutral',
    info: 'bg-info',
    error: 'bg-error',
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
