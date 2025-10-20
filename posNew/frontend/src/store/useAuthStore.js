import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../features/auth/api/api';

// Decode JWT payload safely to extract rolId (canonical role)
const decodeJwt = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (e) {
    console.warn('[AuthStore] Failed to decode JWT', e);
    return null;
  }
};

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
      login: (userData, token) => {
        const payload = token ? decodeJwt(token) : null;
        const userWithRole = payload?.rolId ? { ...userData, rolId: payload.rolId } : userData;
        return set({ 
          user: userWithRole, 
          token, 
          isAuthenticated: true,
          error: null 
        });
      },

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
          const payload = token ? decodeJwt(token) : null;
          const userWithRole = payload?.rolId ? { ...response.data, rolId: payload.rolId } : response.data;
          set({ 
            user: userWithRole, 
            isAuthenticated: true,
            isLoading: false 
          });
          return userWithRole;
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