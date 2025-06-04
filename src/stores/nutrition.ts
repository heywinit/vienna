import { create } from "zustand";
import { persist } from "zustand/middleware";

export type NutritionType = "meal" | "snack" | "supplement";
export type MealTime = "breakfast" | "lunch" | "dinner" | "snack" | "other";

export interface NutritionTemplate {
  id: string;
  name: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  description?: string;
  tags?: string[];
}

export interface NutritionEntry {
  id: string;
  date: string; // ISO string
  type: NutritionType;
  templateId?: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
  mealTime: MealTime;
  rating?: number; // 1-5
  notes?: string;
  description?: string;
  tags?: string[];
  deleted?: boolean;
}

interface NutritionState {
  entries: NutritionEntry[];
  templates: NutritionTemplate[];
  addEntry: (
    entry: Omit<NutritionEntry, "id" | "deleted"> & { id?: string }
  ) => void;
  updateEntry: (id: string, updates: Partial<NutritionEntry>) => void;
  removeEntry: (id: string) => void;
  restoreEntry: (id: string) => void;
  addTemplate: (
    template: Omit<NutritionTemplate, "id"> & { id?: string }
  ) => void;
  updateTemplate: (id: string, updates: Partial<NutritionTemplate>) => void;
  removeTemplate: (id: string) => void;
}

export const useNutritionStore = create<NutritionState>()(
  persist(
    (set) => ({
      entries: [],
      templates: [],
      addEntry: (entry) => {
        const id = entry.id || `${entry.type}-${Date.now()}`;
        set((state) => ({
          entries: [
            ...state.entries,
            {
              ...entry,
              id,
              deleted: false,
            },
          ],
        }));
      },
      updateEntry: (id, updates) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, deleted: true } : e
          ),
        })),
      restoreEntry: (id) =>
        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === id ? { ...e, deleted: false } : e
          ),
        })),
      addTemplate: (template) => {
        const id = template.id || `${template.name}-${Date.now()}`;
        set((state) => ({
          templates: [
            ...state.templates,
            {
              ...template,
              id,
            },
          ],
        }));
      },
      updateTemplate: (id, updates) =>
        set((state) => ({
          templates: state.templates.map((t) =>
            t.id === id ? { ...t, ...updates } : t
          ),
          entries: state.entries.map((e) =>
            e.templateId === id ? { ...e, ...updates } : e
          ),
        })),
      removeTemplate: (id) =>
        set((state) => ({
          templates: state.templates.filter((t) => t.id !== id),
        })),
    }),
    { name: "nutrition-store" }
  )
);
