import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../features/auth/api/api';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      // Set token
      setToken: (token) => set({ token, isAuthenticated: !!token }),

      // Login action
      login: (userData, token) => 
        set({ 
          user: userData, 
          token, 
          isAuthenticated: true,
          error: null 
        }),

      // Logout action
      logout: () => {
        set({ 
          user: null, 
          token: null, 
          isAuthenticated: false,
          error: null 
        });
      },

      // Set error
      setError: (error) => set({ error }),

      // Clear error
      clearError: () => set({ error: null }),

      // Initialize authentication on app load
      initializeAuth: () => {
        const { token } = get();
        if (token) {
          set({ isLoading: true, error: null });
          // Verify token is still valid by fetching user data
          get().refreshUser()
            .catch(() => {
              // Token is invalid, clear auth state
              get().logout();
            })
            .finally(() => {
              set({ isLoading: false });
            });
        }
      },

      // Refresh user data from server
      refreshUser: async () => {
        const { token } = get();
        if (!token) {
          throw new Error('No token available');
        }

        try {
          set({ isLoading: true, error: null });
          const response = await api.get('/auth/me');
          set({ 
            user: response.data, 
            isAuthenticated: true,
            isLoading: false 
          });
          return response.data;
        } catch (error) {
          const errorMessage = error.response?.data?.message || 'Failed to fetch user data';
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },
    }),
    {
      name: 'auth-storage', // localStorage key
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
    }
  )
);