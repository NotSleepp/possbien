import { useEffect, useState } from 'react';
import { 
  FiCheckCircle, 
  FiXCircle, 
  FiAlertTriangle, 
  FiInfo, 
  FiX 
} from 'react-icons/fi';
import { useToastStore } from '../../../store/useToastStore';

const Toast = ({ id, message, type, duration }) => {
  const [isExiting, setIsExiting] = useState(false);
  const removeToast = useToastStore((state) => state.removeToast);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      removeToast(id);
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]);

  const variants = {
    success: {
      icon: FiCheckCircle,
      bgColor: 'bg-green-50',
      borderColor: 'border-green-500',
      textColor: 'text-green-800',
      iconColor: 'text-green-500',
    },
    error: {
      icon: FiXCircle,
      bgColor: 'bg-red-50',
      borderColor: 'border-red-500',
      textColor: 'text-red-800',
      iconColor: 'text-red-500',
    },
    warning: {
      icon: FiAlertTriangle,
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-500',
      textColor: 'text-yellow-800',
      iconColor: 'text-yellow-500',
    },
    info: {
      icon: FiInfo,
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-500',
      textColor: 'text-blue-800',
      iconColor: 'text-blue-500',
    },
  };

  const variant = variants[type] || variants.info;
  const Icon = variant.icon;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-lg border-l-4 shadow-lg
        ${variant.bgColor} ${variant.borderColor}
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        min-w-[320px] max-w-md
      `}
      role="alert"
      aria-live="polite"
    >
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
        aria-label="Close notification"
      >
        <FiX size={18} />
      </button>
    </div>
  );
};

export default Toast;
