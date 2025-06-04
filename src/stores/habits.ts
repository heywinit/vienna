import { create } from "zustand";
import { persist } from "zustand/middleware";

export type HabitFrequency = "daily" | "weekly" | "monthly" | "custom";

export interface HabitHistoryEntry {
  date: string; // ISO string
  completed: boolean;
}

export interface Habit {
  id: string;
  name: string;
  description?: string;
  frequency: HabitFrequency;
  schedule?: string; // e.g., cron or custom string
  streak: number;
  lastCompleted?: string; // ISO string
  tags?: string[];
  reminderTime?: string; // ISO time string
  history: HabitHistoryEntry[];
  deleted?: boolean;
}

interface HabitsState {
  habits: Habit[];
  addHabit: (
    habit: Omit<
      Habit,
      "id" | "streak" | "lastCompleted" | "history" | "deleted"
    > & { id?: string }
  ) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  completeHabit: (id: string) => void;
  resetHabit: (id: string) => void;
  removeHabit: (id: string) => void;
  restoreHabit: (id: string) => void;
}

export const useHabitsStore = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [],
      addHabit: (habit) => {
        const id = habit.id || `${habit.name}-${Date.now()}`;
        set((state) => ({
          habits: [
            ...state.habits,
            {
              ...habit,
              id,
              streak: 0,
              history: [],
              deleted: false,
            },
          ],
        }));
      },
      updateHabit: (id, updates) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, ...updates } : h
          ),
        })),
      completeHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) => {
            if (h.id === id && !h.deleted) {
              const today = new Date().toISOString().split("T")[0];
              const alreadyCompleted = h.history.some(
                (entry) => entry.date === today && entry.completed
              );
              if (!alreadyCompleted) {
                return {
                  ...h,
                  streak: h.streak + 1,
                  lastCompleted: new Date().toISOString(),
                  history: [...h.history, { date: today, completed: true }],
                };
              }
            }
            return h;
          }),
        })),
      resetHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id && !h.deleted
              ? {
                  ...h,
                  streak: 0,
                  lastCompleted: undefined,
                  history: [],
                }
              : h
          ),
        })),
      removeHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, deleted: true } : h
          ),
        })),
      restoreHabit: (id) =>
        set((state) => ({
          habits: state.habits.map((h) =>
            h.id === id ? { ...h, deleted: false } : h
          ),
        })),
    }),
    { name: "habits-store" }
  )
);
