import { create } from 'zustand';
import type { AppId, WindowState } from '../types';

interface OSState {
  windows: WindowState[];
  activeWindowId: string | null;
  zIndexCounter: number;
  isStartMenuOpen: boolean;
  
  // Actions
  openWindow: (appId: AppId, title: string, icon?: any) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  toggleStartMenu: (isOpen?: boolean) => void;
}

export const useOSStore = create<OSState>((set, get) => ({
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,
  isStartMenuOpen: false,

  openWindow: (appId, title, icon) => {
    const { windows, zIndexCounter } = get();
    // Check if already open (optional, for now allow multiple instances)
    const id = `${appId}-${Date.now()}`;
    const newWindow: WindowState = {
      id,
      appId,
      title,
      icon,
      isOpen: true,
      isMinimized: false,
      isMaximized: false,
      zIndex: zIndexCounter + 1,
      position: { x: 50 + windows.length * 20, y: 50 + windows.length * 20 }, // Simple cascade
    };

    set({
      windows: [...windows, newWindow],
      activeWindowId: id,
      zIndexCounter: zIndexCounter + 1,
      isStartMenuOpen: false, // Close start menu on launch
    });
  },

  closeWindow: (id) => {
    set((state) => ({
      windows: state.windows.filter((w) => w.id !== id),
      activeWindowId: state.activeWindowId === id ? null : state.activeWindowId,
    }));
  },

  minimizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMinimized: true } : w
      ),
      activeWindowId: null,
    }));
  },

  maximizeWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, isMaximized: !w.isMaximized } : w
      ),
      activeWindowId: id,
      zIndexCounter: state.zIndexCounter + 1,
    }));
  },

  focusWindow: (id) => {
    set((state) => ({
      windows: state.windows.map((w) =>
        w.id === id ? { ...w, zIndex: state.zIndexCounter + 1, isMinimized: false } : w
      ),
      activeWindowId: id,
      zIndexCounter: state.zIndexCounter + 1,
    }));
  },

  toggleStartMenu: (isOpen) => {
    set((state) => ({
      isStartMenuOpen: isOpen !== undefined ? isOpen : !state.isStartMenuOpen,
    }));
  },
}));
