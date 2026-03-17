import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ListEntry, WatchStatus } from '@/types/user';

interface ListState {
  entries: Record<number, ListEntry>; // anilistId → entry
  setEntries: (entries: ListEntry[]) => void;
  upsertEntry: (entry: ListEntry) => void;
  removeEntry: (anilistId: number) => void;
  getEntry: (anilistId: number) => ListEntry | undefined;
  getByStatus: (status: WatchStatus) => ListEntry[];
  clearList: () => void;
}

export const useListStore = create<ListState>()(
  persist(
    (set, get) => ({
      entries: {},
      setEntries: (list) =>
        set({ entries: Object.fromEntries(list.map((e) => [e.anilistId, e])) }),
      upsertEntry: (entry) =>
        set((s) => ({ entries: { ...s.entries, [entry.anilistId]: entry } })),
      removeEntry: (id) =>
        set((s) => {
          const next = { ...s.entries };
          delete next[id];
          return { entries: next };
        }),
      getEntry: (id) => get().entries[id],
      getByStatus: (status) => Object.values(get().entries).filter((e) => e.status === status),
      clearList: () => set({ entries: {} }),
    }),
    { name: 'voidanime-list' }
  )
);
