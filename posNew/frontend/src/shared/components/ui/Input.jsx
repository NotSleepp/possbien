import { forwardRef } from 'react';

/**
 * Input Component
 * Reusable input field with label, error display, and icon support
 * 
 * @param {Object} props
 * @param {string} props.type - Input type (text, password, email, etc.)
 * @param {string} props.label - Label text
 * @param {string} props.error - Error message to display
 * @param {React.ReactNode} props.icon - Icon element to display
 * @param {string} props.placeholder - Placeholder text
 * @param {string} props.value - Input value
 * @param {Function} props.onChange - Change handler
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.required - Mark as required
 * @param {boolean} props.disabled - Disable input
 */
const Input = forwardRef(({
  type = 'text',
  label = '',
  error = '',
  icon = null,
  placeholder = '',
  value,
  onChange,
  className = '',
  required = false,
  disabled = false,
  id,
  name,
  ...props
}, ref) => {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-');
  const hasError = !!error;

  const handleChange = (e) => {
    if (onChange) {
      onChange(e.target.value, e);
    }
  };

  // Base input styles using CSS variables
  const baseInputStyles = 'input';
  
  // Conditional styles based on error state
  const inputStyles = hasError
    ? `${baseInputStyles} border-error focus:border-error`
    : baseInputStyles;

  // Icon padding adjustment
  const iconPaddingStyles = icon ? 'pl-10' : '';

  return (
    <div className={`w-full ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-base-content mb-1.5"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-content pointer-events-none">
            {icon}
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={`${inputStyles} ${iconPaddingStyles}`}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...props}
        />
      </div>

      {/* Error Message */}
      {hasError && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-sm text-error flex items-center gap-1"
          role="alert"
        >
          <svg
            className="w-4 h-4 flex-shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
