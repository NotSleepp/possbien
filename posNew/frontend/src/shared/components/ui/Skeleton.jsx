/**
 * Skeleton Component
 * Reusable skeleton loader for various content types
 * 
 * @param {Object} props
 * @param {'text' | 'title' | 'avatar' | 'thumbnail' | 'button' | 'card' | 'rectangle'} props.variant - Skeleton type
 * @param {string} props.width - Custom width (e.g., '100%', '200px', 'w-full')
 * @param {string} props.height - Custom height (e.g., '20px', 'h-32')
 * @param {string} props.className - Additional CSS classes
 * @param {number} props.lines - Number of lines for text variant
 */
const Skeleton = ({
  variant = 'text',
  width,
  height,
  className = '',
  lines = 1,
}) => {
  const baseClasses = 'animate-pulse skeleton rounded';

  const variantClasses = {
    text: 'h-4 w-full',
    title: 'h-6 w-3/4',
    avatar: 'h-12 w-12 rounded-full',
    thumbnail: 'h-24 w-24 rounded-lg',
    button: 'h-10 w-32 rounded-lg',
    card: 'h-48 w-full rounded-lg',
    rectangle: 'h-32 w-full rounded-lg',
  };

  const variantClass = variantClasses[variant] || variantClasses.text;

  const style = {};
  if (width) style.width = width;
  if (height) style.height = height;

  // For text variant with multiple lines
  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${variantClass}`}
            style={{
              ...style,
              width: index === lines - 1 ? '80%' : width || '100%',
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClasses} ${variantClass} ${className}`}
      style={style}
    />
  );
};

export default Skeleton;
