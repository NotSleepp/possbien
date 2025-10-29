import PropTypes from 'prop-types';
import { useToastStore } from '../../../store/useToastStore';
import Toast from './Toast';

/**
 * ToastContainer Component
 * Container for displaying toast notifications with configurable positioning
 * 
 * @param {Object} props
 * @param {'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center'} props.position
 * @param {number} props.maxToasts - Maximum number of visible toasts (default: 3)
 */
const ToastContainer = ({ position = 'top-right', maxToasts = 3 }) => {
  const toasts = useToastStore((state) => state.toasts);

  // Position classes
  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-center': 'top-4 left-1/2 -translate-x-1/2',
    'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  };

  // Limit visible toasts
  const visibleToasts = toasts.slice(0, maxToasts);

  return (
    <div
      className={`fixed ${positionClasses[position]} z-50 flex flex-col gap-3 pointer-events-none`}
      aria-live="polite"
      aria-atomic="false"
    >
      {visibleToasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto animate-slide-in">
          <Toast {...toast} />
        </div>
      ))}
      
      {/* Queue indicator */}
      {toasts.length > maxToasts && (
        <div className="pointer-events-auto bg-base-200 text-base-content text-sm px-4 py-2 rounded-lg shadow-lg text-center">
          +{toasts.length - maxToasts} más en cola
        </div>
      )}
    </div>
  );
};

ToastContainer.propTypes = {
  position: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
    'top-center',
    'bottom-center',
  ]),
  maxToasts: PropTypes.number,
};

export default ToastContainer;
