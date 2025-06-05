import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Tab {
  id?: string; // id is optional for initial tabs
  label: string;
  icon: string;
  deleted?: boolean;
}

interface TabState {
  tabs: Tab[];
  activeTabId: string | null;
  addTab: (tab: Omit<Tab, "deleted">) => void;
  updateTab: (id: string, updates: Partial<Omit<Tab, "id">>) => void;
  deleteTab: (id: string) => void; // soft delete
  restoreTab: (id: string) => void;
  setActiveTab: (id: string | null) => void;
}

export const useTabStore = create<TabState>()(
  persist(
    (set) => ({
      tabs: [
        { label: "Home", icon: "Home" },
        { label: "Calendar", icon: "Calendar" },
        { label: "Tasks", icon: "ListTodo" },
        { label: "Timer", icon: "Clock" },
        { label: "KStore", icon: "Library" },
        { label: "Projects", icon: "FolderKanban" },
        { label: "Nutrition", icon: "Apple" },
        { label: "Habits", icon: "CheckCircle" },
      ],
      activeTabId: "Home",
      addTab: (tab) =>
        set((state) => ({
          tabs: [...state.tabs, { ...tab, deleted: false }],
        })),
      updateTab: (id, updates) =>
        set((state) => ({
          tabs: state.tabs.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        })),
      deleteTab: (id) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === id ? { ...t, deleted: true } : t
          ),
          // Optionally unset active tab if deleted
          activeTabId: state.activeTabId === id ? null : state.activeTabId,
        })),
      restoreTab: (id) =>
        set((state) => ({
          tabs: state.tabs.map((t) =>
            t.id === id ? { ...t, deleted: false } : t
          ),
        })),
      setActiveTab: (id) =>
        set(() => ({
          activeTabId: id,
        })),
    }),
    { name: "tabs-store" }
  )
);
