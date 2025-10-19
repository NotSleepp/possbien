import { forwardRef } from 'react';

/**
 * Button Component
 * Reusable button with multiple variants and states
 * 
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'} props.variant - Button style variant
 * @param {'sm' | 'md' | 'lg'} props.size - Button size
 * @param {boolean} props.isLoading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {React.ReactNode} props.children - Button content
 * @param {string} props.className - Additional CSS classes
 * @param {Function} props.onClick - Click handler
 */
const Button = forwardRef(({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  icon = null,
  children,
  className = '',
  type = 'button',
  ...props
}, ref) => {
  // Base styles using CSS variables
  const baseStyles = 'btn';

  // Variant styles using CSS variables
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    danger: 'btn-error',
    ghost: 'btn-ghost',
    outline: 'btn-outline',
  };

  // Size styles using CSS variables
  const sizeStyles = {
    sm: 'text-sm px-3 py-1.5 gap-1.5',
    md: 'text-base px-4 py-2 gap-2',
    lg: 'text-lg px-6 py-3 gap-2.5',
  };

  const buttonClasses = `${baseStyles} ${variantStyles[variant] || ''} ${sizeStyles[size]} ${className}`;

  return (
    <button
      ref={ref}
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {icon && (
        <span className="flex-shrink-0" aria-hidden="true">{icon}</span>
      )}
      {isLoading ? (
        <span className="loading" aria-label="Cargando" />
      ) : (
        <span>{children}</span>
      )}
    </button>
  );
});

export default Button;
