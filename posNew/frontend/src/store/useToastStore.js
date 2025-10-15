import { create } from 'zustand';

let toastId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  // Add a new toast
  addToast: ({ message, type = 'info', duration = 5000 }) => {
    const id = ++toastId;
    const toast = { id, message, type, duration };
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));

    // Auto-remove toast after duration
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, duration);
    }

    return id;
  },

  // Remove a toast by id
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },

  // Clear all toasts
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Convenience methods for different toast types
  success: (message, duration) => {
    return get().addToast({ message, type: 'success', duration });
  },

  error: (message, duration) => {
    return get().addToast({ message, type: 'error', duration });
  },

  warning: (message, duration) => {
    return get().addToast({ message, type: 'warning', duration });
  },

  info: (message, duration) => {
    return get().addToast({ message, type: 'info', duration });
  },
}));
