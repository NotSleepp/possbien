import { create } from 'zustand';

// Initialize sidebar state based on screen size
const getInitialSidebarState = () => {
  if (typeof window !== 'undefined') {
    return window.innerWidth >= 768; // Open on desktop, closed on mobile
  }
  return true;
};

export const useUIStore = create((set) => ({
  isSidebarOpen: getInitialSidebarState(),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setSidebarOpen: (isOpen) => set({ isSidebarOpen: isOpen }),
}));