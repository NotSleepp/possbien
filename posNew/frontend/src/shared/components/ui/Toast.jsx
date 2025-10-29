import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiX
} from 'react-icons/fi';
import { useToastStore } from '../../../store/useToastStore';
import { playSound, SOUND_TYPES } from '../../utils/sound';

const Toast = ({ id, message, type, duration, action, soundEnabled = false }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(100);
  const removeToast = useToastStore((state) => state.removeToast);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(id);
    }, 300); // Match animation duration
  };

  // Progress bar animation
  useEffect(() => {
    if (duration > 0) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
        setProgress(remaining);
      }, 50);

      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => {
        clearInterval(interval);
        clearTimeout(timer);
      };
    }
  }, [duration]);

  // Play sound on mount
  useEffect(() => {
    if (soundEnabled) {
      const soundMap = {
        success: SOUND_TYPES.PRODUCT_ADDED,
        error: SOUND_TYPES.ERROR,
        warning: SOUND_TYPES.WARNING,
        info: SOUND_TYPES.BUTTON_CLICK,
      };
      
      const soundType = soundMap[type] || SOUND_TYPES.BUTTON_CLICK;
      playSound(soundType, { enabled: true, volume: 0.3 });
    }
  }, [type, soundEnabled]);

  const variants = {
    success: {
      icon: FiCheckCircle,
      bgColor: 'bg-success/15',
      borderColor: 'border-success',
      textColor: 'text-base-content',
      iconColor: 'text-success',
    },
    error: {
      icon: FiXCircle,
      bgColor: 'bg-error/15',
      borderColor: 'border-error',
      textColor: 'text-base-content',
      iconColor: 'text-error',
    },
    warning: {
      icon: FiAlertTriangle,
      bgColor: 'bg-warning/15',
      borderColor: 'border-warning',
      textColor: 'text-base-content',
      iconColor: 'text-warning',
    },
    info: {
      icon: FiInfo,
      bgColor: 'bg-info/15',
      borderColor: 'border-info',
      textColor: 'text-base-content',
      iconColor: 'text-info',
    },
  };

  const variant = variants[type] || variants.info;
  const Icon = variant.icon;

  // Handle action button click
  const handleAction = () => {
    if (action?.onClick) {
      action.onClick();
      handleClose();
    }
  };

  return (
    <div
      className={`
        relative flex flex-col gap-2 p-4 rounded-lg border-l-4 shadow-xl
        bg-base-100 ${variant.borderColor}
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full scale-95' : 'opacity-100 translate-x-0 scale-100'}
        min-w-[320px] max-w-md
        border border-base-300
      `}
      role="alert"
      aria-live={type === 'error' ? 'assertive' : 'polite'}
    >
      {/* Main content */}
      <div className="flex items-start gap-3">
        <Icon className={`${variant.iconColor} flex-shrink-0 mt-0.5`} size={20} />
        
        <p className={`flex-1 text-sm font-medium ${variant.textColor}`}>
          {message}
        </p>

        <button
          onClick={handleClose}
          className={`
            ${variant.textColor} hover:opacity-70 
            transition-opacity flex-shrink-0
          `}
          aria-label="Cerrar notificación"
        >
          <FiX size={18} />
        </button>
      </div>

      {/* Action button */}
      {action && (
        <button
          onClick={handleAction}
          className={`
            text-sm font-medium underline hover:no-underline
            ${variant.iconColor} ml-8
          `}
        >
          {action.label || 'Acción'}
        </button>
      )}

      {/* Progress bar */}
      {duration > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-base-300/30 rounded-b-lg overflow-hidden">
          <div
            className={`h-full ${variant.borderColor.replace('border-', 'bg-')} transition-all duration-50 ease-linear`}
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
};

Toast.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  message: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['success', 'error', 'warning', 'info']),
  duration: PropTypes.number,
  action: PropTypes.shape({
    label: PropTypes.string,
    onClick: PropTypes.func,
  }),
  soundEnabled: PropTypes.bool,
};

export default Toast;
