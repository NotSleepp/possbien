import { create } from 'zustand';

let toastId = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],
  soundEnabled: false,

  // Set sound enabled
  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
  },

  // Add a new toast
  addToast: ({ message, type = 'info', duration = 5000, action = null }) => {
    const id = ++toastId;
    const toast = { 
      id, 
      message, 
      type, 
      duration,
      action,
      soundEnabled: get().soundEnabled,
    };
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));

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
  success: (message, options = {}) => {
    return get().addToast({ 
      message, 
      type: 'success', 
      duration: options.duration || 3000,
      action: options.action,
    });
  },

  error: (message, options = {}) => {
    return get().addToast({ 
      message, 
      type: 'error', 
      duration: options.duration || 5000,
      action: options.action,
    });
  },

  warning: (message, options = {}) => {
    return get().addToast({ 
      message, 
      type: 'warning', 
      duration: options.duration || 4000,
      action: options.action,
    });
  },

  info: (message, options = {}) => {
    return get().addToast({ 
      message, 
      type: 'info', 
      duration: options.duration || 3000,
      action: options.action,
    });
  },
}));
