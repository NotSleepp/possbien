/**
 * Card Component
 * Reusable card container for consistent content presentation
 * 
 * @param {Object} props
 * @param {string} props.title - Card title
 * @param {string} props.subtitle - Card subtitle
 * @param {React.ReactNode} props.icon - Icon element to display in header
 * @param {React.ReactNode} props.children - Card content
 * @param {React.ReactNode} props.actions - Action buttons or elements
 * @param {string} props.className - Additional CSS classes
 * @param {'default' | 'elevated' | 'outlined'} props.variant - Card style variant
 * @param {boolean} props.hoverable - Add hover effect
 * @param {Function} props.onClick - Click handler (makes card clickable)
 */
const Card = ({
  title = '',
  subtitle = '',
  icon = null,
  children,
  actions = null,
  className = '',
  variant = 'default',
  hoverable = false,
  onClick,
  ...props
}) => {
  // Base styles using CSS variables
  const baseStyles = 'card';

  // Variant styles using CSS variables
  const variantStyles = {
    default: 'card-bordered',
    elevated: 'shadow-md',
    outlined: 'border-2 border-base-300',
  };

  // Hover styles
  const hoverStyles = hoverable || onClick
    ? 'hover:shadow-lg hover:scale-[1.02] cursor-pointer'
    : '';

  // Clickable styles using CSS variables
  const clickableStyles = onClick ? 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2' : '';

  const cardClasses = `${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${clickableStyles} ${className}`;

  const CardWrapper = onClick ? 'button' : 'div';

  return (
    <CardWrapper
      className={cardClasses}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      {...props}
    >
      {/* Header */}
      {(title || subtitle || icon || actions) && (
        <div className="px-6 py-4 border-b border-base-300">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              {/* Icon */}
              {icon && (
                <div className="flex-shrink-0 text-neutral-content mt-0.5">
                  {icon}
                </div>
              )}

              {/* Title and Subtitle */}
              <div className="flex-1 min-w-0">
                {title && (
                  <h3 className="text-lg font-semibold text-base-content truncate">
                    {title}
                  </h3>
                )}
                {subtitle && (
                  <p className="text-sm text-neutral-content mt-0.5">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* Actions */}
            {actions && (
              <div className="flex-shrink-0 ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      {children && (
        <div className="px-6 py-4">
          {children}
        </div>
      )}
    </CardWrapper>
  );
};

export default Card;
