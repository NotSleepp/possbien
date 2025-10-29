import { forwardRef, useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * TouchButton Component
 * Optimized button for touch interfaces with haptic feedback and ripple effect
 * 
 * @param {Object} props
 * @param {'sm' | 'md' | 'lg' | 'xl'} props.size - Button size
 * @param {'primary' | 'secondary' | 'danger' | 'success' | 'ghost'} props.variant - Button style variant
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {React.ReactNode} props.children - Button content
 * @param {boolean} props.isLoading - Show loading state
 * @param {boolean} props.disabled - Disable button
 * @param {Function} props.onLongPress - Long press handler (optional)
 * @param {number} props.longPressDuration - Duration for long press in ms (default: 500)
 * @param {boolean} props.hapticFeedback - Enable haptic feedback (default: false)
 * @param {string} props.className - Additional CSS classes
 */
const TouchButton = forwardRef(({
  size = 'md',
  variant = 'primary',
  icon = null,
  children,
  isLoading = false,
  disabled = false,
  onLongPress,
  longPressDuration = 500,
  hapticFeedback = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const [ripples, setRipples] = useState([]);
  const [isPressed, setIsPressed] = useState(false);
  const longPressTimer = useRef(null);
  const buttonRef = useRef(null);

  // Combine refs
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(buttonRef.current);
      } else {
        ref.current = buttonRef.current;
      }
    }
  }, [ref]);

  // Size styles - ensuring minimum touch target of 48x48px
  const sizeStyles = {
    sm: 'min-h-[44px] min-w-[44px] text-sm px-3 py-2 gap-1.5 rounded-lg',
    md: 'min-h-[48px] min-w-[48px] text-base px-4 py-2.5 gap-2 rounded-lg',
    lg: 'min-h-[60px] min-w-[60px] text-lg px-6 py-3 gap-2.5 rounded-xl',
    xl: 'min-h-[72px] min-w-[72px] text-xl px-8 py-4 gap-3 rounded-xl',
  };

  // Variant styles
  const variantStyles = {
    primary: 'btn-primary shadow-md hover:shadow-lg',
    secondary: 'btn-secondary shadow-md hover:shadow-lg',
    danger: 'btn-error shadow-md hover:shadow-lg',
    success: 'btn-success shadow-md hover:shadow-lg',
    ghost: 'btn-ghost hover:bg-base-200',
  };

  // Base styles
  const baseStyles = 'btn relative overflow-hidden touch-manipulation select-none font-semibold';
  
  // Active state for visual feedback
  const activeStyles = isPressed && !disabled && !isLoading ? 'scale-95' : '';

  const buttonClasses = `
    ${baseStyles}
    ${variantStyles[variant] || ''}
    ${sizeStyles[size]}
    ${activeStyles}
    ${className}
    transition-transform duration-100 ease-out
  `.trim();

  // Trigger haptic feedback if supported
  const triggerHaptic = () => {
    if (hapticFeedback && navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Create ripple effect
  const createRipple = (event) => {
    const button = buttonRef.current;
    if (!button) return;

    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const newRipple = {
      x,
      y,
      size,
      id: Date.now(),
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  // Handle touch/mouse down
  const handlePointerDown = (event) => {
    if (disabled || isLoading) return;

    setIsPressed(true);
    createRipple(event);
    triggerHaptic();

    // Start long press timer if handler provided
    if (onLongPress) {
      longPressTimer.current = setTimeout(() => {
        triggerHaptic();
        onLongPress(event);
        setIsPressed(false);
      }, longPressDuration);
    }
  };

  // Handle touch/mouse up
  const handlePointerUp = () => {
    setIsPressed(false);
    
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  // Handle click
  const handleClick = (event) => {
    if (disabled || isLoading) return;
    
    // Don't trigger click if it was a long press
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }

    if (onClick) {
      onClick(event);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
      }
    };
  }, []);

  return (
    <button
      ref={buttonRef}
      type={type}
      className={buttonClasses}
      disabled={disabled || isLoading}
      onClick={handleClick}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      aria-busy={isLoading}
      {...props}
    >
      {/* Ripple effects */}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: ripple.size,
            height: ripple.size,
          }}
        />
      ))}

      {/* Icon */}
      {icon && !isLoading && (
        <span className="flex-shrink-0" aria-hidden="true">
          {icon}
        </span>
      )}

      {/* Loading spinner */}
      {isLoading ? (
        <span className="loading loading-spinner" aria-label="Cargando" />
      ) : (
        <span className="relative z-10">{children}</span>
      )}
    </button>
  );
});

TouchButton.displayName = 'TouchButton';

TouchButton.propTypes = {
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'success', 'ghost']),
  icon: PropTypes.node,
  children: PropTypes.node,
  isLoading: PropTypes.bool,
  disabled: PropTypes.bool,
  onLongPress: PropTypes.func,
  longPressDuration: PropTypes.number,
  hapticFeedback: PropTypes.bool,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
};

export default TouchButton;
