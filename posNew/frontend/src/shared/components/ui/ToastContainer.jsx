import { useToastStore } from '../../../store/useToastStore';
import Toast from './Toast';

const ToastContainer = () => {
  const toasts = useToastStore((state) => state.toasts);

  return (
    <div
      className="fixed top-4 right-4 z-50 flex flex-col gap-3 pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <Toast {...toast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
