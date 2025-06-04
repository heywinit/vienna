import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Mode {
  id: string;
  name: string;
  description?: string;
  icon?: string; // emoji or icon string
  deleted?: boolean;
}

interface ModeState {
  modes: Mode[];
  activeModeId: string | null;
  addMode: (mode: Omit<Mode, "deleted">) => void;
  updateMode: (id: string, updates: Partial<Omit<Mode, "id">>) => void;
  deleteMode: (id: string) => void; // soft delete
  restoreMode: (id: string) => void;
  setActiveMode: (id: string | null) => void;
}

export const useModeStore = create<ModeState>()(
  persist(
    (set) => ({
      modes: [
        {
          id: "locked-in",
          name: "Locked In",
          description: "Deep focus mode for maximum productivity.",
          icon: "🔒",
          deleted: false,
        },
        {
          id: "lackin",
          name: "Lackin",
          description: "Relaxed mode for light work or breaks.",
          icon: "😌",
          deleted: false,
        },
      ],
      activeModeId: null,
      addMode: (mode) =>
        set((state) => ({
          modes: [...state.modes, { ...mode, deleted: false }],
        })),
      updateMode: (id, updates) =>
        set((state) => ({
          modes: state.modes.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        })),
      deleteMode: (id) =>
        set((state) => ({
          modes: state.modes.map((m) =>
            m.id === id ? { ...m, deleted: true } : m
          ),
          // Optionally unset active mode if deleted
          activeModeId: state.activeModeId === id ? null : state.activeModeId,
        })),
      restoreMode: (id) =>
        set((state) => ({
          modes: state.modes.map((m) =>
            m.id === id ? { ...m, deleted: false } : m
          ),
        })),
      setActiveMode: (id) =>
        set(() => ({
          activeModeId: id,
        })),
    }),
    { name: "mode-store" }
  )
);
