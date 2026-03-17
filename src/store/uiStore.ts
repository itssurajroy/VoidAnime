import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '@/types/user';

interface UiState {
  theme: ThemeMode;
  sidebarOpen: boolean;
  commandPaletteOpen: boolean;
  statusModalOpen: boolean;
  statusModalAnimeId: number | null;
  setTheme: (t: ThemeMode) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (v: boolean) => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openStatusModal: (animeId: number) => void;
  closeStatusModal: () => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarOpen: false,
      commandPaletteOpen: false,
      statusModalOpen: false,
      statusModalAnimeId: null,
      setTheme: (t) => set({ theme: t }),
      toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
      setSidebarOpen: (v) => set({ sidebarOpen: v }),
      openCommandPalette: () => set({ commandPaletteOpen: true }),
      closeCommandPalette: () => set({ commandPaletteOpen: false }),
      openStatusModal: (id) => set({ statusModalOpen: true, statusModalAnimeId: id }),
      closeStatusModal: () => set({ statusModalOpen: false, statusModalAnimeId: null }),
    }),
    { name: 'voidanime-ui', partialize: (s) => ({ theme: s.theme }) }
  )
);
