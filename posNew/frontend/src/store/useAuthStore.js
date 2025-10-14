import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  token: null,
  setToken: (token) => set({ token }),
  login: (userData, token) => set({ user: userData, token }),
  logout: () => set({ user: null, token: null }),
}));